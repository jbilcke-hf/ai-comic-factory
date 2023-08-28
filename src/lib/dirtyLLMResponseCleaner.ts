export function dirtyLLMResponseCleaner(input: string) {
  return (
    `${input || ""}`
    .replaceAll("}}", "}")
    .replaceAll("]]", "]")
    .replaceAll(",,", ",")
  )
}