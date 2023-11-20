import { dirtyLLMResponseCleaner } from "./dirtyLLMResponseCleaner"

export function cleanJson(input: string): string {
  
  if (input.includes('```')) {
    input = input.split('```')[0]
  }
  let tmp = dirtyLLMResponseCleaner(input)
  
  // we only keep what's after the first [
  tmp = `[${tmp.split("[").pop() || ""}`

  // and before the first ]
  tmp = `${tmp.split("]").shift() || ""}]`
  
  tmp = dirtyLLMResponseCleaner(tmp)
  
  return tmp 
}