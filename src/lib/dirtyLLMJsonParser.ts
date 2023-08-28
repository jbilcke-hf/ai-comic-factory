import { LLMResponse } from "@/types"

export function dirtyLLMJsonParser(input: string): string[] {
  // we only keep what's after the first [
  let jsonOrNot = `[${input.split("[").pop() || ""}`

  // and before the first ]
  jsonOrNot = `${jsonOrNot.split("]").shift() || ""}]`

  const jsonData = JSON.parse(jsonOrNot) as LLMResponse

  const captions = jsonData.map(item => item.caption.trim())

  return captions
}