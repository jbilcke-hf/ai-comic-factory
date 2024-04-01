"use server"

import Anthropic from '@anthropic-ai/sdk';
import { MessageParam } from '@anthropic-ai/sdk/resources';

export async function predict({
  systemPrompt,
  userPrompt,
  nbMaxNewTokens,
}: {
  systemPrompt: string
  userPrompt: string
  nbMaxNewTokens: number
}): Promise<string> {
  const anthropicApiKey = `${process.env.AUTH_ANTHROPIC_API_KEY || ""}`
  const anthropicApiModel = `${process.env.LLM_ANTHROPIC_API_MODEL || "claude-3-opus-20240229"}`
  
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