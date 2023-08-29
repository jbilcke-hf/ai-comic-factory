import { createLlamaPrompt } from "@/lib/createLlamaPrompt"
import { dirtyLLMResponseCleaner } from "@/lib/dirtyLLMResponseCleaner"
import { dirtyLLMJsonParser } from "@/lib/dirtyLLMJsonParser"
import { dirtyCaptionCleaner } from "@/lib/dirtyCaptionCleaner"

import { predict } from "./predict"
import { Preset } from "../engine/presets"

export const getStory = async ({
  preset,
  prompt = "",
}: {
  preset: Preset;
  prompt: string;
}): Promise<string[]> => {

  const query = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are a comic book author specialized in ${preset.llmPrompt}`,
        `Please generate detailed drawing instructions for the 4 panels of a new silent comic book page.`,
        `Give your response as a JSON array like this: \`Array<{ panel: number; caption: string}>\`.`,
        // `Give your response as Markdown bullet points.`,
        `Be brief in your caption don't add your own comments. Be straight to the point, and never reply things like "Sure, I can.." etc.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: `The story is: ${prompt}`,
    }
  ]) + "```json\n["


  let result = ""

  try {
    result = await predict(query)
    if (!result.trim().length) {
      throw new Error("empty result!")
    }
  } catch (err) {
    console.log(`prediction of the story failed, trying again..`)
    try {
      result = await predict(query+".")
      if (!result.trim().length) {
        throw new Error("empty result!")
      }
    } catch (err) {
      console.error(`prediction of the story failed again!`)
      throw new Error(`failed to generate the story ${err}`)
    }
  }

  console.log("Raw response from LLM:", result)
  const tmp = dirtyLLMResponseCleaner(result)
  
  let captions: string[] = []

  try {
    captions = dirtyLLMJsonParser(tmp)
  } catch (err) {
    console.log(`failed to read LLM response: ${err}`)

    // it is possible that the LLM has generated multiple JSON files like this:
    
    /*
    [ {
      "panel": 1,
      "caption": "A samurai stands at the edge of a bustling street in San Francisco, looking out of place among the hippies and beatniks."
      } ]

      [ {
      "panel": 2,
      "caption": "The samurai spots a group of young people playing music on the sidewalk. He approaches them, intrigued."
      } ]
    */
    try {
      // in that case, we can try to repair it like so:
      let strategy2 = `[${tmp.split("[").pop() || ""}`
      strategy2.replaceAll("[", ",")

      captions = dirtyLLMJsonParser(strategy2)
    } catch (err2) {

      // in case of failure here, it might be because the LLM hallucinated a completely different response,
      // such as markdown. There is no real solution.. but we can try a fallback:

      captions = (
        tmp.split("*")
        .map(item => item.replaceAll("[", "[").replaceAll("]", "]").trim())
      )
    }
  }

  return captions.map(caption => dirtyCaptionCleaner(caption))
}