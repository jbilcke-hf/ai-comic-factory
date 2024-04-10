import { LLMVendor, RenderingModelVendor, Settings } from "@/types"

import { getValidString } from "@/lib/getValidString"
import { localStorageKeys } from "./localStorageKeys"
import { defaultSettings } from "./defaultSettings"
import { getValidBoolean } from "@/lib/getValidBoolean"
import { getValidNumber } from "@/lib/getValidNumber"

export function getSettings(): Settings {
  try {
    return {
      renderingModelVendor: getValidString(localStorage?.getItem?.(localStorageKeys.renderingModelVendor), defaultSettings.renderingModelVendor) as RenderingModelVendor,
      renderingUseTurbo: getValidBoolean(localStorage?.getItem?.(localStorageKeys.renderingUseTurbo), defaultSettings.renderingUseTurbo),
      llmVendor: getValidString(localStorage?.getItem?.(localStorageKeys.llmVendor), defaultSettings.llmVendor) as LLMVendor,
      huggingFaceOAuth: getValidString(localStorage?.getItem?.(localStorageKeys.huggingFaceOAuth), defaultSettings.huggingFaceOAuth),
      huggingfaceApiKey: getValidString(localStorage?.getItem?.(localStorageKeys.huggingfaceApiKey), defaultSettings.huggingfaceApiKey),
      huggingfaceInferenceApiModel: getValidString(localStorage?.getItem?.(localStorageKeys.huggingfaceInferenceApiModel), defaultSettings.huggingfaceInferenceApiModel),
      huggingfaceInferenceApiModelTrigger: getValidString(localStorage?.getItem?.(localStorageKeys.huggingfaceInferenceApiModelTrigger), defaultSettings.huggingfaceInferenceApiModelTrigger),
      huggingfaceInferenceApiFileType:  getValidString(localStorage?.getItem?.(localStorageKeys.huggingfaceInferenceApiFileType), defaultSettings.huggingfaceInferenceApiFileType),
      replicateApiKey: getValidString(localStorage?.getItem?.(localStorageKeys.replicateApiKey), defaultSettings.replicateApiKey),
      replicateApiModel: getValidString(localStorage?.getItem?.(localStorageKeys.replicateApiModel), defaultSettings.replicateApiModel),
      replicateApiModelVersion: getValidString(localStorage?.getItem?.(localStorageKeys.replicateApiModelVersion), defaultSettings.replicateApiModelVersion),
      replicateApiModelTrigger: getValidString(localStorage?.getItem?.(localStorageKeys.replicateApiModelTrigger), defaultSettings.replicateApiModelTrigger),
      openaiApiKey: getValidString(localStorage?.getItem?.(localStorageKeys.openaiApiKey), defaultSettings.openaiApiKey),
      openaiApiModel: getValidString(localStorage?.getItem?.(localStorageKeys.openaiApiModel), defaultSettings.openaiApiModel),
      openaiApiLanguageModel: getValidString(localStorage?.getItem?.(localStorageKeys.openaiApiLanguageModel), defaultSettings.openaiApiLanguageModel),
      groqApiKey: getValidString(localStorage?.getItem?.(localStorageKeys.groqApiKey), defaultSettings.groqApiKey),
      groqApiLanguageModel: getValidString(localStorage?.getItem?.(localStorageKeys.groqApiLanguageModel), defaultSettings.groqApiLanguageModel),
      anthropicApiKey: getValidString(localStorage?.getItem?.(localStorageKeys.anthropicApiKey), defaultSettings.anthropicApiKey),
      anthropicApiLanguageModel: getValidString(localStorage?.getItem?.(localStorageKeys.anthropicApiLanguageModel), defaultSettings.anthropicApiLanguageModel),
      hasGeneratedAtLeastOnce: getValidBoolean(localStorage?.getItem?.(localStorageKeys.hasGeneratedAtLeastOnce), defaultSettings.hasGeneratedAtLeastOnce),
      userDefinedMaxNumberOfPages: getValidNumber(localStorage?.getItem?.(localStorageKeys.userDefinedMaxNumberOfPages), 1, Number.MAX_SAFE_INTEGER, defaultSettings.userDefinedMaxNumberOfPages),
    }
  } catch (err) {
    return {
      ...defaultSettings
    }
  }
}