import { ClapMediaOrientation } from "@aitube/clap"

import { LayoutName } from "."

export type LayoutSettings = {
  panel: number
  orientation: ClapMediaOrientation
  width: number
  height: number
}

export const layouts: Record<LayoutName, LayoutSettings[]> = {
  random: [],
  Layout0: [
    { panel: 0, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
    { panel: 1, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
    { panel: 2, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
    { panel: 3, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
  ],
  Layout1: [
    { panel: 0, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
    { panel: 1, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 2, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 3, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
  ],
  Layout2: [
    { panel: 0, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 1, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 2, orientation: ClapMediaOrientation.PORTRAIT, width: 512, height: 1024 },
    { panel: 3, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
  ],
  Layout3: [
    { panel: 0, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
    { panel: 1, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 2, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 3, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
  ],
  Layout4: [
    { panel: 0, orientation: ClapMediaOrientation.PORTRAIT, width: 512, height: 1024 },
    { panel: 1, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 768 },
    { panel: 2, orientation: ClapMediaOrientation.PORTRAIT, width: 768, height: 1024 },
    { panel: 3, orientation: ClapMediaOrientation.LANDSCAPE, width: 1024, height: 512 },
  ],
}
/*
Layout5: [
  { panel: 0, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
  { panel: 1, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
  { panel: 2, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
  { panel: 3, orientation: ClapMediaOrientation.SQUARE, width: 1024, height: 1024 },
]
*/
