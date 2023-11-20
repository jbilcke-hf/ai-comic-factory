import { Settings } from "@/types"

export const localStorageKeys: Record<keyof Settings, string> = {
  renderingModelVendor: "CONF_RENDERING_MODEL_VENDOR",
  renderingUseTurbo: "CONF_RENDERING_USE_TURBO",
  huggingfaceApiKey: "CONF_AUTH_HF_API_TOKEN",
  huggingfaceInferenceApiModel: "CONF_RENDERING_HF_INFERENCE_API_BASE_MODEL",
  huggingfaceInferenceApiModelTrigger: "CONF_RENDERING_HF_INFERENCE_API_BASE_MODEL_TRIGGER",
  huggingfaceInferenceApiFileType: "CONF_RENDERING_HF_INFERENCE_API_FILE_TYPE",
  replicateApiKey: "CONF_AUTH_REPLICATE_API_TOKEN",
  replicateApiModel: "CONF_RENDERING_REPLICATE_API_MODEL",
  replicateApiModelVersion: "CONF_RENDERING_REPLICATE_API_MODEL_VERSION",
  replicateApiModelTrigger: "CONF_RENDERING_REPLICATE_API_MODEL_TRIGGER",
  openaiApiKey: "CONF_AUTH_OPENAI_API_KEY",
  openaiApiModel: "CONF_AUTH_OPENAI_API_MODEL",
}
