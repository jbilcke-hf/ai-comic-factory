
  interface Message {
    role: "system" | "user" | "assistant";
    content: string;
  }
  
  /**
   * Formats the messages for the chat with the LLM model in the style of a pirate.
   * @param messages - Array of message objects with role and content.
   * @returns The formatted chat prompt.
   */
  export function createZephyrPrompt(messages: Message[]): string {
    let prompt = ``;
  
    // Iterate over messages and generate corresponding chat entries.
    messages.forEach(message => {
      prompt += `<|${message.role}|>\n${message.content.trim()}</s>`;
    });

    if (messages.at(-1)?.role === "user") {
      // Append the assistant's tag for the next response but without a closing tag.
      prompt += `<|assistant|>`;
    }
  
    return prompt;
  }