import { RenderingModelVendor, Settings } from "@/types"

export const defaultSettings: Settings = {
  renderingModelVendor: "SERVER" as RenderingModelVendor,
  renderingUseTurbo: false,
  huggingFaceOAuth: "",
  huggingfaceApiKey: "",
  huggingfaceInferenceApiModel: "stabilityai/stable-diffusion-xl-base-1.0",
  huggingfaceInferenceApiModelTrigger: "",
  huggingfaceInferenceApiFileType: "image/png",
  replicateApiKey: "",
  replicateApiModel: "stabilityai/sdxl",
  replicateApiModelVersion: "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
  replicateApiModelTrigger: "",
  openaiApiKey: "",
  openaiApiModel: "dall-e-3",
  openaiApiLanguageModel: "gpt-4",
  groqApiKey: "",
  groqApiLanguageModel: "mixtral-8x7b-32768",
  hasGeneratedAtLeastOnce: false,
  userDefinedMaxNumberOfPages: 1,
}