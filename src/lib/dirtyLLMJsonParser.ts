import { LLMResponse } from "@/types"
import { cleanJson } from "./cleanJson"
import { parseBadJSON } from "./parseBadJSON"

export function dirtyLLMJsonParser(input: string): LLMResponse {

  if (input.includes("```")) {
    input = input.split("```")[0]
  }
  // we only keep what's after the first [
  let jsonOrNot = cleanJson(input)

  const jsonData = parseBadJSON(jsonOrNot) as LLMResponse

  const results = jsonData.map((item, i) => {
    let panel = i
    let caption = item.caption ? item.caption.trim() : ''
    let instructions = item.instructions ? item.instructions.trim() : ''
    if (!instructions && caption) {
      instructions = caption
    } 
    if (!caption && instructions) {
      caption = instructions
    }
    return { panel, caption, instructions }
  })

  return results
}