// clean a list of words (which may be null, undefined or empty)
// into one clean string of separator-divided (by default comma-separated) words
// the words will be trimmed, and empty elements will be removed
export function joinWords(inputs: any[] = [], separator = ", "): string {
  return inputs.map(x => `${x || ""}`.trim()).filter(x => x).join(separator)
}