import { Preset } from "../engine/presets"
import { GeneratedPanel } from "@/types"
import { predictNextPanels } from "./predictNextPanels"
import { joinWords } from "@/lib/joinWords"

export const getStoryContinuation = async ({
  preset,
  stylePrompt = "",
  userStoryPrompt = "",
  nbPanelsToGenerate = 2,
  nbTotalPanels = 8,
  existingPanels = [],
}: {
  preset: Preset;
  stylePrompt?: string;
  userStoryPrompt?: string;
  nbPanelsToGenerate?: number;
  nbTotalPanels?: number;
  existingPanels?: GeneratedPanel[];
}): Promise<GeneratedPanel[]> => {

  let panels: GeneratedPanel[] = []
  const startAt: number = (existingPanels.length + 1) || 0
  const endAt: number = startAt + nbPanelsToGenerate

  try {

    const prompt = joinWords([ userStoryPrompt ])

    const panelCandidates: GeneratedPanel[] = await predictNextPanels({
      preset,
      prompt,
      nbPanelsToGenerate,
      nbTotalPanels,
      existingPanels,
    })

    // console.log("LLM responded with panelCandidates:", panelCandidates)

    // we clean the output from the LLM
    // most importantly, we need to adjust the panel index,
    // to start from where we last finished
    for (let i = 0; i < nbPanelsToGenerate; i++) {
      panels.push({
        panel: startAt + i,
        instructions: `${panelCandidates[i]?.instructions || ""}`,
        caption: `${panelCandidates[i]?.caption || ""}`,
      })
    }
    
  } catch (err) {
    // console.log("LLM step failed due to:", err)
    // console.log("we are now switching to a degraded mode, using 4 similar panels")
    panels = []
    for (let p = startAt; p < endAt && p; p++) {
      panels.push({
        panel: p,
        instructions: joinWords([
          stylePrompt,
          userStoryPrompt,
          `${".".repeat(p)}`,
        ]),
        caption: "(Sorry, LLM generation failed: using degraded mode)"
      })
    }
    // console.error(err)
  } finally {
    return panels
  }
}
