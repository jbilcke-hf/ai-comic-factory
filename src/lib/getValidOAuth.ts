import { OAuthResult } from "@huggingface/hub"

// return a valid OAuthResult, or else undefined
export function getValidOAuth(rawInput?: any): OAuthResult | undefined {
  try {
    let untypedOAuthResult: any
    try {
      untypedOAuthResult = JSON.parse(rawInput)
      if (!untypedOAuthResult) { throw new Error("no valid serialized oauth result") }
    } catch (err) {
      untypedOAuthResult = rawInput
    }

    const maybeValidOAuth = untypedOAuthResult as OAuthResult

    const accessTokenExpiresAt = new Date(maybeValidOAuth.accessTokenExpiresAt)

    // Get the current date
    const currentDate = new Date()

    if (accessTokenExpiresAt.getTime() < currentDate.getTime()) {
      throw new Error("the serialized oauth result has expired")
    }

    return maybeValidOAuth
  } catch (err) {
    // console.error(err)
    return undefined
  }
}