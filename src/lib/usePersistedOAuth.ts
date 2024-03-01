"use client"

import { useLocalStorage } from "usehooks-ts"
import { OAuthResult } from "@huggingface/hub"

import { defaultSettings } from "@/app/interface/settings-dialog/defaultSettings"
import { localStorageKeys } from "@/app/interface/settings-dialog/localStorageKeys"
import { getValidOAuth } from "./getValidOAuth"

export function usePersistedOAuth(): [OAuthResult | undefined, (oauthResult: OAuthResult) => void] {
  const [serializedHuggingFaceOAuth, setSerializedHuggingFaceOAuth] = useLocalStorage<string>(
    localStorageKeys.huggingFaceOAuth,
    defaultSettings.huggingFaceOAuth
  )

  const oauthResult = getValidOAuth(serializedHuggingFaceOAuth)

  const setOAuthResult = (oauthResult: OAuthResult) => {
    setSerializedHuggingFaceOAuth(JSON.stringify(oauthResult))
  }

  return [oauthResult, setOAuthResult]
}