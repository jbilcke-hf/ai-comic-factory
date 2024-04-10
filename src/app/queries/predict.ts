"use server"

import { LLMEngine, LLMPredictionFunctionParams } from "@/types"
import { defaultLLMEngineName, getLLMEngineFunction } from "./getLLMEngineFunction"

export async function predict(params: LLMPredictionFunctionParams): Promise<string> {
  const { llmVendorConfig: { vendor } } = params
  // LLMVendor = what the user configure in the UI (eg. a dropdown item called default server)
  // LLMEngine = the actual engine to use (eg. hugging face)
  const llmEngineName: LLMEngine =
    vendor === "ANTHROPIC" ? "ANTHROPIC" :
    vendor === "GROQ" ? "GROQ" :
    vendor === "OPENAI" ? "OPENAI" :
    defaultLLMEngineName

  const llmEngineFunction = getLLMEngineFunction(llmEngineName)

  // console.log("predict: using " + llmEngineName)
  const results = await llmEngineFunction(params)

  // console.log("predict: result: " + results)
  return results
}