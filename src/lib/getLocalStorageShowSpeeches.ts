export function getLocalStorageShowSpeeches(defaultValue: boolean): boolean {
  try {
    const result = localStorage.getItem("AI_COMIC_FACTORY_SHOW_SPEECHES")
    if (typeof result !== "string") {
      return defaultValue
    }
    if (result === "true") { return true }
    if (result === "false") { return false }
    return defaultValue
  } catch (err) {
    return defaultValue
  }
}