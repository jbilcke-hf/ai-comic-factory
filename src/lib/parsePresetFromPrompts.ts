import { presets, PresetName, Preset } from "@/app/engine/presets"

/**
 * Try to guess the preset from a list of prompts
 * 
 * @param prompts 
 * @returns 
 */
export function parsePresetFromPrompts(prompts: string[]): Preset {

  const presetToCount: Record<PresetName, number> = {}
  const chunkToPresets: Record<string, PresetName[]> = {}
  
  Object.values(presets).forEach(preset => {
    preset.imagePrompt("").map(x => x.trim().toLowerCase()).forEach(chunk => {
      chunkToPresets[chunk] = Array.isArray(chunkToPresets[chunk]) ? chunkToPresets[chunk] : []
      if (!chunkToPresets[chunk].includes(preset.id)) {
        chunkToPresets[chunk].push(preset.id)
      }
    })
  })
  
  prompts.forEach(prompt => {
    prompt.split(",").map(x => x.trim().toLowerCase()).forEach(chunk => {
      if (Array.isArray(chunkToPresets[chunk])) {
        const presetNames = chunkToPresets[chunk] as PresetName[]
        presetNames.forEach(preset => {
          presetToCount[preset] = (presetToCount[preset] || 0) + 1
        })
      }
    })
  })

  const bestMatch: PresetName | undefined = Object.entries(presetToCount).sort((a, b) => b[1] - a[1]).map(x => x[0]).at(0) as (PresetName | undefined)

  return presets[bestMatch || "neutral"] || presets.neutral
}