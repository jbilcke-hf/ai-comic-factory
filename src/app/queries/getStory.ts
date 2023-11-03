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
  nbTotalPanels = 4,
}: {
  preset: Preset;
  prompt: string;
  nbTotalPanels: number;
}): Promise<LLMResponse> => {
  // throw new Error("Planned maintenance")
  
  // In case you need to quickly debug the RENDERING engine you can uncomment this:
  // return mockLLMResponse

  const query = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are a writer specialized in ${preset.llmPrompt}`,
        `Please write detailed drawing instructions and a one-sentence short caption for the ${nbTotalPanels} panels of a new silent story. Please make sure each of the ${nbTotalPanels} panels include info about character gender, age, origin, clothes, colors, location, lights, etc.`,
        `Give your response as a VALID JSON array like this: \`Array<{ panel: number; instructions: string; caption: string}>\`.`,
        // `Give your response as Markdown bullet points.`,
        `Be brief in your ${nbTotalPanels} instructions and captions, don't add your own comments. Be straight to the point, and never reply things like "Sure, I can.." etc. Reply using valid JSON.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: `The story is: ${prompt}`,
    }
  ]) + "```json\n["


  let result = ""

  try {
    result = `${await predict(query, nbTotalPanels) || ""}`.trim()
    if (!result.length) {
      throw new Error("empty result!")
    }
  } catch (err) {
    console.log(`prediction of the story failed, trying again..`)
    try {
      result = `${await predict(query+".", nbTotalPanels) || ""}`.trim()
      if (!result.length) {
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