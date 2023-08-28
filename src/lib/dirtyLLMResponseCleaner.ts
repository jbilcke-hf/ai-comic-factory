export function dirtyLLMResponseCleaner(input: string) {
  return (
    `${input || ""}`
    // a summary of all the weird hallucinations I saw it make..
    .replaceAll("}}", "}")
    .replaceAll("]]", "]")
    .replaceAll(",,", ",")
    .replaceAll("[0]", "")
    .replaceAll("[1]", "")
    .replaceAll("[2]", "")
    .replaceAll("[3]", "")
    .replaceAll("[4]", "")
  )
}