import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { predict } from "./predict"
import { Preset } from "../engine/presets"

export const getBackground = async ({
  preset,
  storyPrompt = "",
  previousPanelPrompt = "",
  newPanelPrompt = "",
}: {
  preset: Preset;
  storyPrompt: string;
  previousPanelPrompt: string;
  newPanelPrompt: string;
}) => {

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are a comic book author for a ${preset.llmPrompt}`,
        `Please write in a single sentence a photo caption for the next plausible page, using a few words for each of those categories: the environment, era, characters, objects, textures, lighting.`,
        `Separate each of those category descriptions using a comma.`,
        `Be brief in your caption don't add your own comments. Be straight to the point, and never reply things like "As the player approaches.." or "As the player clicks.." or "the scene shifts to.." (the best is not not mention the player at all)`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: storyPrompt
    }
  ])


  let result = ""
  try {
    result = await predict(prompt)
    if (!result.trim().length) {
      throw new Error("empty result!")
    }
  } catch (err) {
    console.log(`prediction of the background failed, trying again..`)
    try {
      result = await predict(prompt+".")
      if (!result.trim().length) {
        throw new Error("empty result!")
      }
    } catch (err) {
      console.error(`prediction of the background failed again!`)
      throw new Error(`failed to generate the background ${err}`)
    }
  }

  const tmp = result.split("Caption:").pop() || result
  return tmp.replaceAll("\n", ", ")
}