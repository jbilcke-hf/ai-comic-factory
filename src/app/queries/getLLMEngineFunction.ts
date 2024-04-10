import { LLMEngine } from "@/types"
import { predict as predictWithHuggingFace } from "./predictWithHuggingFace"
import { predict as predictWithOpenAI } from "./predictWithOpenAI"
import { predict as predictWithGroq } from "./predictWithGroq"
import { predict as predictWithAnthropic } from "./predictWithAnthropic"

export const defaultLLMEngineName = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export function getLLMEngineFunction(llmEngineName: LLMEngine = defaultLLMEngineName) {
  const llmEngineFunction = 
    llmEngineName === "GROQ" ? predictWithGroq :
    llmEngineName === "ANTHROPIC" ? predictWithAnthropic :
    llmEngineName === "OPENAI" ? predictWithOpenAI :
    predictWithHuggingFace
  
  return llmEngineFunction
}

export const defaultLLMEngineFunction = getLLMEngineFunction()