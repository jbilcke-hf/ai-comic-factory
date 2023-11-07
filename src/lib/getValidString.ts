export function getValidString(something: any, defaultValue: string) {
  const strValue = `${something || defaultValue}`
  try {
   return JSON.parse(strValue) || defaultValue
  } catch (err) {
    return defaultValue
  }
}