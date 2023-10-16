"use server"

import { LLMEngine } from "@/types"

const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export const predict = async () => {
    if (llmEngine === "OPENAI")  {
        const module = await import("./predictWithOpenAI")  
        return module.predictWithOpenAI
    } else {
        const module = await import("./predictWithHuggingFace")  
        return module.predictWithHuggingFace
    }
} 