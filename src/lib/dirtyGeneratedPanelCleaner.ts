import { GeneratedPanel } from "@/types"

export function dirtyGeneratedPanelCleaner({
  panel,
  instructions,
  caption
}: GeneratedPanel): GeneratedPanel {
  let newCaption = `${caption || ""}`.split(":").pop()?.trim() || ""
  let newInstructions = (
    // need to remove from LLM garbage here, too
    (`${instructions || ""}`.split(":").pop() || "")
    .replaceAll("Draw a", "")
    .replaceAll("Draw the", "")
    .replaceAll("Draw", "")
    .replaceAll("Show a", "")
    .replaceAll("Show the", "")
    .replaceAll("Opens with a", "")
    .replaceAll("Opens with the", "")
    .replaceAll("Opens with", "")
    .replaceAll("Cut to a", "")
    .replaceAll("Cut to the", "")
    .replaceAll("Cut to", "")
    .replaceAll("End with a", "")
    .replaceAll("End with", "").trim() || ""
  )

  // we have to crop the instructions unfortunately, otherwise the style will disappear
  // newInstructions = newInstructions.slice(0, 77)
  // EDIT: well actually the instructions are already at the end of the prompt,
  // so we can let SDXL do this cropping job for us

  // american comic about brunette wood elf walks around a dark forrest and suddenly stops when hearing a strange noise, single panel, modern american comic, comicbook style, 2010s, digital print, color comicbook, color drawing, Full shot of the elf, her eyes widening in surprise, as a glowing, ethereal creature steps out of the shadows.",

  return {
    panel,
    instructions: newInstructions,
    caption: newCaption,
  }
}