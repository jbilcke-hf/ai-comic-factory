export function dirtyCaptionCleaner(input: string) {
  return input.split(":").pop()?.trim() || ""
}