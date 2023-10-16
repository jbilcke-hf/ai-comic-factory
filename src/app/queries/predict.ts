"use server"

import { LLMEngine } from "@/types"
import { predict as predictWithHuggingFace } from "./predictWithHuggingFace"
import { predict as predictWithOpenAI } from "./predictWithOpenAI"

const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export const predict = llmEngine === "OPENAI" ? predictWithOpenAI : predictWithHuggingFace