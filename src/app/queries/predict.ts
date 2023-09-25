"use server"

import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"

import type { ChatCompletionMessage } from "openai/resources/chat"
import { LLMEngine } from "@/types"
import OpenAI from "openai"

const hf = new HfInference(process.env.HF_API_TOKEN)


// note: we always try "inference endpoint" first
const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine
const inferenceEndpoint = `${process.env.LLM_HF_INFERENCE_ENDPOINT_URL || ""}`
const inferenceModel = `${process.env.LLM_HF_INFERENCE_API_MODEL || ""}`
const openaiApiKey = `${process.env.LLM_OPENAI_API_KEY || ""}`


let hfie: HfInferenceEndpoint

switch (llmEngine) {
  case "INFERENCE_ENDPOINT":
    if (inferenceEndpoint) {
      console.log("Using a custom HF Inference Endpoint")
      hfie = hf.endpoint(inferenceEndpoint)
    } else {
      const error = "No Inference Endpoint URL defined"
      console.error(error)
      throw new Error(error)
    }
    break;
  
  case "INFERENCE_API":
    if (inferenceModel) {
      console.log("Using an HF Inference API Model")
    } else {
      const error = "No Inference API model defined"
      console.error(error)
      throw new Error(error)
    }
    break;

  case "OPENAI":
    if (openaiApiKey) {
      console.log("Using an OpenAI API Key")
    } else {
      const error = "No OpenAI API key defined"
      console.error(error)
      throw new Error(error)
    }
    break;
  
  default:
    const error = "No Inference Endpoint URL or Inference API Model defined"
    console.error(error)
    throw new Error(error)
}

export async function predict(inputs: string) {

  console.log(`predict: `, inputs)
  
  if (llmEngine==="OPENAI") {
    return predictWithOpenAI(inputs)
  } 
  
  const api = llmEngine ==="INFERENCE_ENDPOINT" ? hfie : hf

  let instructions = ""
  try {
    for await (const output of api.textGenerationStream({
      model: llmEngine ==="INFERENCE_ENDPOINT" ? undefined : (inferenceModel || undefined),
      inputs,
      parameters: {
        do_sample: true,
        // we don't require a lot of token for our task
        // but to be safe, let's count ~110 tokens per panel
        max_new_tokens: 450, // 1150,
        return_full_text: false,
      }
    })) {
      instructions += output.token.text
      process.stdout.write(output.token.text)
      if (
        instructions.includes("</s>") || 
        instructions.includes("<s>") ||
        instructions.includes("[INST]") ||
        instructions.includes("[/INST]") ||
        instructions.includes("<SYS>") ||
        instructions.includes("</SYS>") ||
        instructions.includes("<|end|>") ||
        instructions.includes("<|assistant|>")
      ) {
        break
      }
    }
  } catch (err) {
    console.error(`error during generation: ${err}`)
  }

  // need to do some cleanup of the garbage the LLM might have gave us
  return (
    instructions
    .replaceAll("<|end|>", "")
    .replaceAll("<s>", "")
    .replaceAll("</s>", "")
    .replaceAll("[INST]", "")
    .replaceAll("[/INST]", "") 
    .replaceAll("<SYS>", "")
    .replaceAll("</SYS>", "")
    .replaceAll("<|assistant|>", "")
    .replaceAll('""', '"')
  )
}

async function predictWithOpenAI(inputs: string) {
  const openaiApiBaseUrl = `${process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1"}`
  const openaiApiModel = `${process.env.OPENAI_API_MODEL || "gpt-3.5-turbo"}`
  
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiApiBaseUrl,
  })

  const messages: ChatCompletionMessage[] = [
    { role: "system", content: inputs },
  ]

  try {
    const res = await openai.chat.completions.create({
      messages: messages,
      stream: false,
      model: openaiApiModel,
      temperature: 0.8
    })

    return res.choices[0].message.content
  } catch (err) {
    console.error(`error during generation: ${err}`)
  }
}