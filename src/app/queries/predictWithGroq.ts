"use server"

import { LLMPredictionFunctionParams } from "@/types"
import Groq from "groq-sdk"

export async function predict({
  systemPrompt,
  userPrompt,
  nbMaxNewTokens,
  llmVendorConfig
}: LLMPredictionFunctionParams): Promise<string> {
  const groqApiKey = `${
    llmVendorConfig.apiKey ||
    process.env.AUTH_GROQ_API_KEY ||
    ""
  }`
  const groqApiModel = `${
    llmVendorConfig.modelId ||
    process.env.LLM_GROQ_API_MODEL ||
    "mixtral-8x7b-32768"
  }`

  const groq = new Groq({
    apiKey: groqApiKey,
  })

  const messages: Groq.Chat.Completions.CompletionCreateParams.Message[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]

  try {
    const res = await groq.chat.completions.create({
      messages: messages,
      model: groqApiModel,
      stream: false,
      temperature: 0.5,
      max_tokens: nbMaxNewTokens,
    })

    return res.choices[0].message.content || ""
  } catch (err) {
    console.error(`error during generation: ${err}`)
    return ""
  }
}