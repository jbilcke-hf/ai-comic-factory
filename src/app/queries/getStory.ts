
import { predict } from "./predict"
import { Preset } from "../engine/presets"
import { GeneratedPanels } from "@/types"
import { cleanJson } from "@/lib/cleanJson"
import { createZephyrPrompt } from "@/lib/createZephyrPrompt"

import { dirtyGeneratedPanelCleaner } from "@/lib/dirtyGeneratedPanelCleaner"
import { dirtyGeneratedPanelsParser } from "@/lib/dirtyGeneratedPanelsParser"

export const getStory = async ({
  preset,
  prompt = "",
  nbTotalPanels = 4,
}: {
  preset: Preset;
  prompt: string;
  nbTotalPanels: number;
}): Promise<GeneratedPanels> => {
  throw new Error("legacy, deprecated")
  
  // In case you need to quickly debug the RENDERING engine you can uncomment this:
  // return mockGeneratedPanels

  const query = createZephyrPrompt([
    {
      role: "system",
      content: [
        `You are a writer specialized in ${preset.llmPrompt}`,
        `Please write detailed drawing instructions and short (2-3 sentences long) speech captions for the ${nbTotalPanels} panels of a new story. Please make sure each of the ${nbTotalPanels} panels include info about character gender, age, origin, clothes, colors, location, lights, etc.`,
        `Give your response as a VALID JSON array like this: \`Array<{ panel: number; instructions: string; caption: string; }>\`.`,
        // `Give your response as Markdown bullet points.`,
        `Be brief in your ${nbTotalPanels} instructions and narrative captions, don't add your own comments. The whole story must be captivating, smart, entertaining. Be straight to the point, and never reply things like "Sure, I can.." etc. Reply using valid JSON.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: `The story is: ${prompt}`,
    }
  ]) + "\n```[{"


  let result = ""

  try {
    // console.log(`calling predict(${query}, ${nbTotalPanels})`)
    result = `${await predict(query, nbTotalPanels) || ""}`.trim()
    if (!result.length) {
      throw new Error("empty result!")
    }
  } catch (err) {
    // console.log(`prediction of the story failed, trying again..`)
    try {
      result = `${await predict(query+".", nbTotalPanels) || ""}`.trim()
      if (!result.length) {
        throw new Error("empty result!")
      }
    } catch (err) {
      console.error(`prediction of the story failed again 💩`)
      throw new Error(`failed to generate the story ${err}`)
    }
  }

  // console.log("Raw response from LLM:", result)
  const tmp = cleanJson(result)
  
  let GeneratedPanels: GeneratedPanels = []

  try {
    GeneratedPanels = dirtyGeneratedPanelsParser(tmp)
  } catch (err) {
    // console.log(`failed to read LLM response: ${err}`)
    // console.log(`original response was:`, result)

      // in case of failure here, it might be because the LLM hallucinated a completely different response,
      // such as markdown. There is no real solution.. but we can try a fallback:

    GeneratedPanels = (
      tmp.split("*")
      .map(item => item.trim())
      .map((cap, i) => ({
        panel: i,
        caption: cap,
        instructions: cap,
      }))
    )
  }

  return GeneratedPanels.map(res => dirtyGeneratedPanelCleaner(res))
}