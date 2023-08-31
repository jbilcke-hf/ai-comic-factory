import { dirtyLLMResponseCleaner } from "./dirtyLLMResponseCleaner"

export function cleanJson(input: string) {
  
  let tmp = dirtyLLMResponseCleaner(input)
  
  // we only keep what's after the first [
  tmp = `[${tmp.split("[").pop() || ""}`

  // and before the first ]
  tmp = `${tmp.split("]").shift() || ""}]`
  
  tmp = dirtyLLMResponseCleaner(tmp)
  
  return tmp 
}