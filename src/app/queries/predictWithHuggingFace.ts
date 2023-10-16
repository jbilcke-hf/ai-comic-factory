"use server"

import { HfInference, HfInferenceEndpoint } from "@huggingface/inference"
import { LLMEngine } from "@/types"

export async function predict(inputs: string): Promise<string> {
  const hf = new HfInference(process.env.AUTH_HF_API_TOKEN)

  const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine
  const inferenceEndpoint = `${process.env.LLM_HF_INFERENCE_ENDPOINT_URL || ""}`
  const inferenceModel = `${process.env.LLM_HF_INFERENCE_API_MODEL || ""}`

  let hfie: HfInferenceEndpoint = hf

  switch (llmEngine) {
    case "INFERENCE_ENDPOINT":
      if (inferenceEndpoint) {
       //  console.log("Using a custom HF Inference Endpoint")
        hfie = hf.endpoint(inferenceEndpoint)
      } else {
        const error = "No Inference Endpoint URL defined"
        console.error(error)
        throw new Error(error)
      }
      break;
    
    case "INFERENCE_API":
      if (inferenceModel) {
        // console.log("Using an HF Inference API Model")
      } else {
        const error = "No Inference API model defined"
        console.error(error)
        throw new Error(error)
      }
      break;

    default:
      const error = "Please check your Hugging Face Inference API or Inference Endpoint settings"
      console.error(error)
      throw new Error(error)
  }
    
  const api = llmEngine === "INFERENCE_ENDPOINT" ? hfie : hf

  let instructions = ""
  try {
    for await (const output of api.textGenerationStream({
      model: llmEngine === "INFERENCE_ENDPOINT" ? undefined : (inferenceModel || undefined),
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
