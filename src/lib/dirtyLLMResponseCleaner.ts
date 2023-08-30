export function dirtyLLMResponseCleaner(input: string) {
  return (
    `${input || ""}`
    // a summary of all the weird hallucinations I saw it make..
    .replaceAll(`"]`, `"}]`)
    .replaceAll(`" ]`, `"}]`)
    .replaceAll(`"  ]`, `"}]`)
    .replaceAll(`"\n]`, `"}]`)
    .replaceAll(`"\n ]`, `"}]`)
    .replaceAll(`"\n  ]`, `"}]`)
    .replaceAll("}}", "}")
    .replaceAll("]]", "]")
    .replaceAll(",,", ",")
    .replaceAll("[0]", "")
    .replaceAll("[1]", "")
    .replaceAll("[2]", "")
    .replaceAll("[3]", "")
    .replaceAll("[4]", "")
    .replaceAll("[panel 0]", "")
    .replaceAll("[panel 1]", "")
    .replaceAll("[panel 2]", "")
    .replaceAll("[panel 3]", "")
    .replaceAll("[panel 4]", "")
  )
}