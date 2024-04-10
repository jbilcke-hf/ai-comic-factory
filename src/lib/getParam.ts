import queryString from 'query-string'

export function getParam<T>(name: string, defaultValue: T): T {
  try {
    const params = queryString.parseUrl(
      typeof window !== "undefined" ? (window.location.href || "") : ""
    )
    const stringValue = params.query[name]?.toString() || `${defaultValue || ""}`
    if (typeof defaultValue === "number") {
      return Number(stringValue) as T
    } else if (typeof defaultValue === "boolean") {
      return Boolean(stringValue) as T
    } else {
      return stringValue as T
    }
  } catch (err) {
    return defaultValue
  }
}