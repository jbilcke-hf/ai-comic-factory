import { RenderingModelVendor, Settings } from "@/types"

import { getValidString } from "@/lib/getValidString"
import { localStorageKeys } from "./localStorageKeys"
import { defaultSettings } from "./defaultSettings"
import { getValidBoolean } from "@/lib/getValidBoolean"

export function getSettings(): Settings {
  try {
    return {
      renderingModelVendor: getValidString(localStorage?.getItem?.(localStorageKeys.renderingModelVendor), defaultSettings.renderingModelVendor) as RenderingModelVendor,
      renderingUseTurbo: getValidBoolean(localStorage?.getItem?.(localStorageKeys.renderingUseTurbo), defaultSettings.renderingUseTurbo),
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
    }
  } catch (err) {
    return {
      ...defaultSettings
    }
  }
}