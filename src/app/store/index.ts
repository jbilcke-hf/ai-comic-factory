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
  captions: Record<string, string>
  layout: LayoutName
  zoomLevel: number
  isGeneratingStory: boolean
  panelGenerationStatus: Record<number, boolean>
  isGeneratingText: boolean
  atLeastOnePanelIsBusy: boolean
  setPrompt: (prompt: string) => void
  setFont: (font: FontName) => void
  setPreset: (preset: Preset) => void
  setPanels: (panels: string[]) => void
  setLayout: (layout: LayoutName) => void
  setCaption: (panelId: number, caption: string) => void
  setZoomLevel: (zoomLevel: number) => void
  setGeneratingStory: (isGeneratingStory: boolean) => void
  setGeneratingImages: (panelId: number, value: boolean) => void
  setGeneratingText: (isGeneratingText: boolean) => void
}>((set, get) => ({
  prompt: "",
  font: "cartoonist",
  preset: getPreset("japanese_manga"),
  panels: [],
  captions: {},
  layout: getRandomLayoutName(),
  zoomLevel: 50,
  isGeneratingStory: false,
  panelGenerationStatus: {},
  isGeneratingText: false,
  atLeastOnePanelIsBusy: false,
  setPrompt: (prompt: string) => {
    const existingPrompt = get().prompt
    if (prompt === existingPrompt) { return }
    set({
      prompt,
      layout: getRandomLayoutName(),
      panels: [],
      captions: {},
    })
  },
  setFont: (font: FontName) => {
    const existingFont = get().font
    if (font === existingFont) { return }
    set({
      font,
      layout: getRandomLayoutName(),
      panels: [],
      captions: {}
    })
  },
  setPreset: (preset: Preset) => {
    const existingPreset = get().preset
    if (preset.label === existingPreset.label) { return }
    set({
      preset,
      layout: getRandomLayoutName(),
      panels: [],
      captions: {}
    })
  },
  setPanels: (panels: string[]) => set({ panels }),
  setCaption: (panelId: number, caption: string) => {
    set({
      captions: {
        ...get().captions,
        [panelId]: caption
      }
    })
  },
  setLayout: (layout: LayoutName) => set({ layout }),
  setZoomLevel: (zoomLevel: number) =>  set({ zoomLevel }),
  setGeneratingStory: (isGeneratingStory: boolean) => set({ isGeneratingStory }),
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
