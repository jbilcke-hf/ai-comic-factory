import { Settings } from "@/types"

// let's keep it "version 0" for now, so as to not disrupt current users
// however at some point we might need to upgrade and invalid the default values
const version = ``

export const localStorageKeys: Record<keyof Settings, string> = {
  renderingModelVendor: `${version}CONF_RENDERING_MODEL_VENDOR`,
  renderingUseTurbo: `${version}CONF_RENDERING_USE_TURBO`,
  llmVendor: `${version}CONF_LLM_MODEL_VENDOR`,
  huggingFaceOAuth: `${version}CONF_AUTH_HF_OAUTH`,
  huggingfaceApiKey: `${version}CONF_AUTH_HF_API_TOKEN`,
  huggingfaceInferenceApiModel: `${version}CONF_RENDERING_HF_INFERENCE_API_BASE_MODEL`,
  huggingfaceInferenceApiModelTrigger: `${version}CONF_RENDERING_HF_INFERENCE_API_BASE_MODEL_TRIGGER`,
  huggingfaceInferenceApiFileType: `${version}CONF_RENDERING_HF_INFERENCE_API_FILE_TYPE`,
  replicateApiKey: `${version}CONF_AUTH_REPLICATE_API_TOKEN`,
  replicateApiModel: `${version}CONF_RENDERING_REPLICATE_API_MODEL`,
  replicateApiModelVersion: `${version}CONF_RENDERING_REPLICATE_API_MODEL_VERSION`,
  replicateApiModelTrigger: `${version}CONF_RENDERING_REPLICATE_API_MODEL_TRIGGER`,
  openaiApiKey: `${version}CONF_AUTH_OPENAI_API_KEY`,
  openaiApiModel: `${version}CONF_AUTH_OPENAI_API_MODEL`,
  openaiApiLanguageModel: `${version}CONF_AUTH_OPENAI_API_LANGUAGE_MODEL`,
  groqApiKey: `${version}CONF_AUTH_GROQ_API_KEY`,
  groqApiLanguageModel: `${version}CONF_AUTH_GROQ_API_LANGUAGE_MODEL`,
  anthropicApiKey: `${version}CONF_AUTH_ANTHROPIC_API_KEY`,
  anthropicApiLanguageModel: `${version}CONF_AUTH_ANTHROPIC_API_LANGUAGE_MODEL`,
  hasGeneratedAtLeastOnce: `${version}CONF_HAS_GENERATED_AT_LEAST_ONCE`,
  userDefinedMaxNumberOfPages: `${version}CONF_USER_DEFINED_MAX_NUMBER_OF_PAGES`,
}
