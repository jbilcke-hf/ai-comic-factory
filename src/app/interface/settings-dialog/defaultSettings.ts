import { RenderingModelVendor, Settings } from "@/types"

export const defaultSettings: Settings = {
  renderingModelVendor: "SERVER" as RenderingModelVendor,
  huggingfaceApiKey: "<USE YOUR OWN TOKEN>",
  huggingfaceInferenceApiModel: "stabilityai/stable-diffusion-xl-base-1.0",
  huggingfaceInferenceApiModelTrigger: "",
  replicateApiKey: "<USE YOUR OWN TOKEN>",
  replicateApiModel: "stabilityai/sdxl",
  replicateApiModelVersion: "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
  replicateApiModelTrigger: "style of TOK",
  openaiApiKey: "<USE YOUR OWN TOKEN>",
  openaiApiModel: "dall-e-3",
}