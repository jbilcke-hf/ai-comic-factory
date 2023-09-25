"use server"

import { LLMEngine } from "@/types"
import { predictWithHuggingFace } from "./predictWithHuggingFace"
import { predictWithOpenAI } from "./predictWithOpenAI"

const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export const predict = llmEngine === "OPENAI" ? predictWithOpenAI : predictWithHuggingFace