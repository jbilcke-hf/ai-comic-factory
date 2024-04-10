import { useLocalStorage } from "usehooks-ts"

import { LLMVendor, RenderingModelVendor } from "@/types"
import { localStorageKeys } from "@/app/interface/settings-dialog/localStorageKeys"
import { defaultSettings } from "@/app/interface/settings-dialog/defaultSettings"

import { useDynamicConfig } from "./useDynamicConfig"

// we don't want to display the login wall to people forking the project,
// or to people who selected no hugging face server at all
export function useShouldDisplayLoginWall() {
  const { config, isConfigReady } = useDynamicConfig()

  const clientId = config.oauthClientId
  const enableOAuth = config.enableHuggingFaceOAuth
  const enableOAuthWall = config.enableHuggingFaceOAuthWall

  const isConfigEnablingOAuthWall = Boolean(
    clientId &&
    enableOAuth &&
    enableOAuthWall
  )

  const [renderingModelVendor,] = useLocalStorage<RenderingModelVendor>(
    localStorageKeys.renderingModelVendor,
    defaultSettings.renderingModelVendor
  )
  const [llmVendor,] = useLocalStorage<LLMVendor>(
    localStorageKeys.llmVendor,
    defaultSettings.llmVendor
  )

  const isUsingOneOfTheDefaultServices =
    renderingModelVendor === "SERVER" ||
    llmVendor === "SERVER"


  const shouldDisplayLoginWall =
    isConfigReady &&
    isConfigEnablingOAuthWall &&
    isUsingOneOfTheDefaultServices 
    
  return shouldDisplayLoginWall
}