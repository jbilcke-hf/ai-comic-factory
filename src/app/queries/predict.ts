"use server"

import { LLMEngine } from "@/types"
import { predict as predictWithHuggingFace } from "./predictWithHuggingFace"
import { predict as predictWithOpenAI } from "./predictWithOpenAI"
import { predict as predictWithGroq } from "./predictWithGroq"
import { predict as predictWithAnthropic } from "./predictWithAnthropic"

const llmEngine = `${process.env.LLM_ENGINE || ""}` as LLMEngine

export const predict =
  llmEngine === "GROQ" ? predictWithGroq :
  llmEngine === "ANTHROPIC" ? predictWithAnthropic :
  llmEngine === "OPENAI" ? predictWithOpenAI :
  predictWithHuggingFace