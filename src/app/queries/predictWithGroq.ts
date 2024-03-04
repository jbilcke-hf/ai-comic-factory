"use server"

import Groq from "groq-sdk"

export async function predict(inputs: string, nbMaxNewTokens: number): Promise<string> {
  const groqApiKey = `${process.env.AUTH_GROQ_API_KEY || ""}`
  const groqApiModel = `${process.env.LLM_GROQ_API_MODEL || "mixtral-8x7b-32768"}`
  
  const groq = new Groq({
    apiKey: groqApiKey,
  })

  const messages: Groq.Chat.Completions.CompletionCreateParams.Message[] = [
    { role: "assistant", content: "" },
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