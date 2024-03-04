"use server"

import type { ChatCompletionMessage } from "openai/resources/chat"
import OpenAI from "openai"

export async function predict(inputs: string, nbMaxNewTokens: number): Promise<string> {
  const openaiApiKey = `${process.env.AUTH_OPENAI_API_KEY || ""}`
  const openaiApiBaseUrl = `${process.env.LLM_OPENAI_API_BASE_URL || "https://api.openai.com/v1"}`
  const openaiApiModel = `${process.env.LLM_OPENAI_API_MODEL || "gpt-3.5-turbo"}`
  
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiApiBaseUrl,
  })

  const messages: ChatCompletionMessage[] = [
    { role: "assistant", content: inputs },
  ]

  try {
    const res = await openai.chat.completions.create({
      messages: messages,
      stream: false,
      model: openaiApiModel,
      temperature: 0.8,
      max_tokens: nbMaxNewTokens,

      // TODO: use the nbPanels to define a max token limit
    })

    return res.choices[0].message.content || ""
  } catch (err) {
    console.error(`error during generation: ${err}`)
    return ""
  }
}