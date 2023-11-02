import { LLMResponse } from "@/types"

export function parseBadJSON(jsonLikeString: string): LLMResponse {

  try {
    return JSON.parse(jsonLikeString) as LLMResponse
  } catch (err) {
    var regex = /\{\s*"panel":\s*(\d+),\s*"instructions"\s*:\s*"([^"]+)",\s*"caption":\s*"([^"]*)"\s*\}/gs;
      
    let results = [];
    let match;
    
    while ((match = regex.exec(jsonLikeString)) !== null) {
      let json = {
        panel: Number(match[1]),
        instructions: match[2],
        caption: match[3]
      };
      results.push(json);
    }
    
    return results as LLMResponse
  }
}