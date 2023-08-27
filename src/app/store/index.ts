"use client"
import { create } from "zustand"

import { FontName } from "@/lib/fonts"
import { Preset, getPreset } from "@/app/engine/presets"
import { LayoutName, getRandomLayoutName } from "../layouts"

export const useStore = create<{
  prompt: string
  font: FontName
  preset: Preset
  panels: string[]
  layout: LayoutName
  zoomLevel: number
  isGeneratingLogic: boolean
  panelGenerationStatus: Record<number, boolean>
  isGeneratingText: boolean
  atLeastOnePanelIsBusy: boolean
  setPrompt: (prompt: string) => void
  setFont: (font: FontName) => void
  setPreset: (preset: Preset) => void
  setPanels: (panels: string[]) => void
  setLayout: (layout: LayoutName) => void
  setZoomLevel: (zoomLevel: number) => void
  setGeneratingLogic: (isGeneratingLogic: boolean) => void
  setGeneratingImages: (panelId: number, value: boolean) => void
  setGeneratingText: (isGeneratingText: boolean) => void
}>((set, get) => ({
  prompt: "",
  font: "cartoonist",
  preset: getPreset("japanese_manga"),
  panels: [],
  layout: getRandomLayoutName(),
  zoomLevel: 50,
  isGeneratingLogic: false,
  panelGenerationStatus: {},
  isGeneratingText: false,
  atLeastOnePanelIsBusy: false,
  setPrompt: (prompt: string) => set({ prompt }),
  setFont: (font: FontName) => set({ font }),
  setPreset: (preset: Preset) => set({ preset }),
  setPanels: (panels: string[]) => set({ panels }),
  setLayout: (layout: LayoutName) => set({ layout }),
  setZoomLevel: (zoomLevel: number) =>  set({ zoomLevel }),
  setGeneratingLogic: (isGeneratingLogic: boolean) => set({ isGeneratingLogic }),
  setGeneratingImages: (panelId: number, value: boolean) => {

    const panelGenerationStatus: Record<number, boolean> = {
      ...get().panelGenerationStatus,
      [panelId]: value
    }

    const atLeastOnePanelIsBusy = Object.values(panelGenerationStatus).includes(true)
    
    set({
      panelGenerationStatus,
      atLeastOnePanelIsBusy
    })
  },
  setGeneratingText: (isGeneratingText: boolean) => set({ isGeneratingText }),
}))
