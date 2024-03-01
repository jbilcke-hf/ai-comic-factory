"use client"

export function useOAuthEnabled(): boolean {
  const isOAuthEnabled = `${process.env.NEXT_PUBLIC_ENABLE_HUGGING_FACE_OAUTH || "false"}` === "true"
  return isOAuthEnabled
}