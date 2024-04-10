import { useLocalStorage } from "usehooks-ts"

import { defaultSettings } from "@/app/interface/settings-dialog/defaultSettings"
import { localStorageKeys } from "@/app/interface/settings-dialog/localStorageKeys"
import { LLMEngine, LLMVendor, LLMVendorConfig } from "@/types"

export function useLLMVendorConfig(): LLMVendorConfig {

  const [vendor, ] = useLocalStorage<LLMVendor>(
    localStorageKeys.llmVendor,
    defaultSettings.llmVendor
  )
  const [openaiApiKey, ] = useLocalStorage<string>(
    localStorageKeys.openaiApiKey,
    defaultSettings.openaiApiKey
  )
  const [openaiApiLanguageModel, ] = useLocalStorage<string>(
    localStorageKeys.openaiApiLanguageModel,
    defaultSettings.openaiApiLanguageModel
  )
  const [groqApiKey, ] = useLocalStorage<string>(
    localStorageKeys.groqApiKey,
    defaultSettings.groqApiKey
  )
  const [groqApiLanguageModel, ] = useLocalStorage<string>(
    localStorageKeys.groqApiLanguageModel,
    defaultSettings.groqApiLanguageModel
  )
  const [anthropicApiKey, ] = useLocalStorage<string>(
    localStorageKeys.anthropicApiKey,
    defaultSettings.anthropicApiKey
  )
  const [anthropicApiLanguageModel, ] = useLocalStorage<string>(
    localStorageKeys.anthropicApiLanguageModel,
    defaultSettings.anthropicApiLanguageModel
  )

  const apiKey =
    vendor === "ANTHROPIC" ? anthropicApiKey :
    vendor === "GROQ" ? groqApiKey :
    vendor === "OPENAI" ? openaiApiKey :
    ""
  
  const modelId =
    vendor === "ANTHROPIC" ? anthropicApiLanguageModel :
    vendor === "GROQ" ? groqApiLanguageModel :
    vendor === "OPENAI" ? openaiApiLanguageModel :
    ""

  return {
    vendor,
    apiKey,
    modelId,
  }
}