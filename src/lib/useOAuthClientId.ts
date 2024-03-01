"use client"

export function useOAuthClientId(): string {
  const oauthClientId = `${process.env.NEXT_PUBLIC_HUGGING_FACE_OAUTH_CLIENT_ID || ""}`
  return oauthClientId
}