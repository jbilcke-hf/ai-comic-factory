"use server"

import { LLMPredictionFunctionParams } from '@/types';
import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

export async function predict({
  systemPrompt,
  userPrompt,
  nbMaxNewTokens,
  llmVendorConfig
}: LLMPredictionFunctionParams): Promise<string> {
  const anthropicApiKey = `${
    llmVendorConfig.apiKey ||
    process.env.AUTH_ANTHROPIC_API_KEY ||
    ""
  }`
  const anthropicApiModel = `${
    llmVendorConfig.modelId ||
    process.env.LLM_ANTHROPIC_API_MODEL ||
    "claude-3-opus-20240229"
  }`
  
  const anthropic = new Anthropic({
    apiKey: anthropicApiKey,
  })

  const messages: MessageParam[] = [
    { role: "user", content: userPrompt },
  ]

  try {
    const res = await anthropic.messages.create({
      messages: messages,
      // stream: false,
      system: systemPrompt,
      model: anthropicApiModel,
      // temperature: 0.8,
      max_tokens: nbMaxNewTokens,
    })

    return res.content[0]?.text || ""
  } catch (err) {
    console.error(`error during generation: ${err}`)
    return ""
  }
}