"use server"

import { LLMEngine } from "@/types"

const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export const predict = async () => {
    if (llmEngine === "OPENAI")  {
        return (await import("./predictWithOpenAI")).predictWithOpenAI
    } else {
        return (await import("./predictWithHuggingFace")).predictWithHuggingFace
    }
} 