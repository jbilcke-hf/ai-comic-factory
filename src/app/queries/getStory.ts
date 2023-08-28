import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { predict } from "./predict"
import { Preset } from "../engine/presets"

type LLMResponse = Array<{panel: number; caption: string }>

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

  console.log("Raw response from LLM:", result)
  let tmp = result // result.split("Caption:").pop() || result
  tmp = tmp
    .replaceAll("}}", "}")
    .replaceAll("]]", "]")
    .replaceAll(",,", ",")

  try {
    // we only keep what's after the first [
    let jsonOrNot = `[${tmp.split("[").pop() || ""}`

    // and before the first ]
    jsonOrNot = `${jsonOrNot.split("]").shift() || ""}]`

    const jsonData = JSON.parse(jsonOrNot) as LLMResponse
    const captions = jsonData.map(item => item.caption.trim())
    return captions.map(caption => caption.split(":").pop()?.trim() || "")
  } catch (err) {
    console.log(`failed to read LLM response: ${err}`)

    // in case of failure, it might be because the LLM hallucinated a completely different response,
    // such as markdown. There is no real solution.. but we can try a fallback:

    const candidateList = (
      tmp.split("*")
      .map(item => item.replaceAll("[", "[").replaceAll("]", "]").trim())
    )

    return candidateList
  }
}