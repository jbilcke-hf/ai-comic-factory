import { ClapSegment } from "@aitube/clap"

import { LayoutName } from "@/app/layouts"
import { layouts } from "@/app/layouts/settings"
import { getImageDimension } from "./getImageDimension"

export async function parseLayoutFromStoryboards(storyboards: ClapSegment[]): Promise<LayoutName> {

  let bestCandidate: LayoutName = "Layout0"

  for (const [layoutName, layoutPanels] of Object.entries(layouts)) {

    let nbMatchingStoryboards = 0
    let i = 0

    for (const { panel, orientation, width, height } of layoutPanels) {

      const storyboard = storyboards[i]

      if (!storyboard) { continue }
      if (!storyboard?.assetUrl) { continue }

      const imgDimension = await getImageDimension(storyboard.assetUrl)

      if (orientation === imgDimension.orientation) {
        nbMatchingStoryboards++
      }
      
      i++
    }

    if (nbMatchingStoryboards === 4) {
      bestCandidate = layoutName as LayoutName
    }
  }

  return bestCandidate
}