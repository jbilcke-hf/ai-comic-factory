"use server"

import { HfInference } from "@huggingface/inference"

const hfi = new HfInference(process.env.HF_API_TOKEN)
const hf = hfi.endpoint(`${process.env.HF_INFERENCE_ENDPOINT_URL || ""}`)

export async function predict(inputs: string) {

  console.log(`predict: `, inputs)
  
  let instructions = ""
  try {
    for await (const output of hf.textGenerationStream({
      inputs,
      parameters: {
        do_sample: true,

        // hard limit for max_new_tokens is 1512
        max_new_tokens: 330, // 1150,
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