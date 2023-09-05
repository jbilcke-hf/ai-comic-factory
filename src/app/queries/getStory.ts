import { createLlamaPrompt } from "@/lib/createLlamaPrompt"
import { dirtyLLMResponseCleaner } from "@/lib/dirtyLLMResponseCleaner"
import { dirtyLLMJsonParser } from "@/lib/dirtyLLMJsonParser"
import { dirtyCaptionCleaner } from "@/lib/dirtyCaptionCleaner"

import { predict } from "./predict"
import { Preset } from "../engine/presets"
import { LLMResponse } from "@/types"
import { cleanJson } from "@/lib/cleanJson"

export const getStory = async ({
  preset,
  prompt = "",
}: {
  preset: Preset;
  prompt: string;
}): Promise<LLMResponse> => {

  const query = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are a comic book author specialized in ${preset.llmPrompt}`,
        `Please write detailed drawing instructions and a one-sentence short caption for the 4 panels of a new silent comic book page.`,
        `Give your response as a JSON array like this: \`Array<{ panel: number; instructions: string; caption: string}>\`.`,
        // `Give your response as Markdown bullet points.`,
        `Be brief in your 4 instructions and captions, don't add your own comments. Be straight to the point, and never reply things like "Sure, I can.." etc.`
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

  // console.log("Raw response from LLM:", result)
  const tmp = cleanJson(result)
  
  let llmResponse: LLMResponse = []

  try {
    llmResponse = dirtyLLMJsonParser(tmp)
  } catch (err) {
    console.log(`failed to read LLM response: ${err}`)
    console.log(`original response was:`, result)

      // in case of failure here, it might be because the LLM hallucinated a completely different response,
      // such as markdown. There is no real solution.. but we can try a fallback:

    llmResponse = (
      tmp.split("*")
      .map(item => item.trim())
      .map((cap, i) => ({
        panel: i,
        caption: cap,
        instructions: cap,
      }))
    )
  }

  return llmResponse.map(res => dirtyCaptionCleaner(res))
}