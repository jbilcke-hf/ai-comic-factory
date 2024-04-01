import { Preset } from "../engine/presets"

export function getSystemPrompt({
  preset,
  // prompt,
  // existingPanelsTemplate,
  firstNextOrLast,
  maxNbPanels,
  nbPanelsToGenerate,
  // nbMaxNewTokens,
}: {
  preset: Preset
  // prompt: string
  // existingPanelsTemplate: string
  firstNextOrLast: string
  maxNbPanels: number
  nbPanelsToGenerate: number
  // nbMaxNewTokens: number
}) {
  return [
    `You are a writer specialized in ${preset.llmPrompt}`,
    `Please write detailed drawing instructions and short (2-3 sentences long) speech captions for the ${firstNextOrLast} ${nbPanelsToGenerate} panels (out of ${maxNbPanels} in total) of a new story, but keep it open-ended (it will be continued and expanded later). Please make sure each of those ${nbPanelsToGenerate} panels include info about character gender, age, origin, clothes, colors, location, lights, etc. Only generate those ${nbPanelsToGenerate} panels, but take into account the fact the panels are part of a longer story (${maxNbPanels} panels long).`,
    `Give your response as a VALID JSON array like this: \`Array<{ panel: number; instructions: string; caption: string; }>\`.`,
    // `Give your response as Markdown bullet points.`,
    `Be brief in the instructions and narrative captions of those ${nbPanelsToGenerate} panels, don't add your own comments. The captions must be captivating, smart, entertaining. Be straight to the point, and never reply things like "Sure, I can.." etc. Reply using valid JSON!! Important: Write valid JSON!`
  ].filter(item => item).join("\n")
}