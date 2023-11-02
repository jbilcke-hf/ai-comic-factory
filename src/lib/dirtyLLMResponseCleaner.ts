export function dirtyLLMResponseCleaner(input: string) {
  let str = (
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
    .replaceAll("[[", "[")
    .replaceAll("{{", "{")
    .replaceAll(",,", ",")
    .replaceAll("[0]", "")
    .replaceAll("[1]", "")
    .replaceAll("[2]", "")
    .replaceAll("[3]", "")
    .replaceAll("[4]", "")
    .replaceAll("[5]", "")
    .replaceAll("[6]", "")
    .replaceAll("[7]", "")
    .replaceAll("[8]", "")
    .replaceAll("[panel 0]", "")
    .replaceAll("[panel 1]", "")
    .replaceAll("[panel 2]", "")
    .replaceAll("[panel 3]", "")
    .replaceAll("[panel 4]", "")
    .replaceAll("[panel 5]", "")
    .replaceAll("[panel 6]", "")
    .replaceAll("[panel 7]", "")
    .replaceAll("[panel 8]", "")
  )

  // repair missing end of JSON array
  if (str.at(-1) === '}') {
    str = str + "]"
  }

  if (str.at(-1) === '"') {
    str = str + "}]"
  }

  if (str[0] === '{') {
    str = "[" + str
  }
  
  if (str[0] === '"') {
    str = "[{" + str
  }

  return str
}