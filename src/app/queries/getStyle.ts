import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { predict } from "./predict"
import { Preset } from "../engine/presets"

export const getStory = async ({
  preset,
  prompt = "",
}: {
  preset: Preset;
  prompt: string;
}) => {

  const query = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are a comic book author specialized in ${preset.llmPrompt}`,
        `You are going to be asked to write a comic book page, your mission is to answer a JSON array containing 4 items, to describe the page (one item per panel).`,
        `Each array item should be a comic book panel caption the describe the environment, era, characters, objects, textures, lighting.`,
        `Be brief in your caption don't add your own comments. Be straight to the point, and never reply things like "Sure, I can.." etc.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: `The story is: ${prompt}`,
    }
  ])


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

  const tmp = result // result.split("Caption:").pop() || result
  return tmp.replaceAll("\n", ", ")
}