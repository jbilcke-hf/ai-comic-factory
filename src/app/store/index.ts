"use client"

import { create } from "zustand"

import { FontName } from "@/lib/fonts"
import { Preset, PresetName, defaultPreset, getPreset, getRandomPreset } from "@/app/engine/presets"
import { LayoutName, defaultLayout, getRandomLayoutName, getRandomLayoutNames } from "../layouts"
import html2canvas from "html2canvas"

export const useStore = create<{
  prompt: string
  font: FontName
  preset: Preset
  nbFrames: number
  panels: string[]
  captions: string[]
  showCaptions: boolean
  layout: LayoutName
  layouts: LayoutName[]
  zoomLevel: number
  page: HTMLDivElement
  isGeneratingStory: boolean
  panelGenerationStatus: Record<number, boolean>
  isGeneratingText: boolean
  atLeastOnePanelIsBusy: boolean
  setPrompt: (prompt: string) => void
  setFont: (font: FontName) => void
  setPreset: (preset: Preset) => void
  setPanels: (panels: string[]) => void
  setShowCaptions: (showCaptions: boolean) => void
  setLayout: (layout: LayoutName) => void
  setLayouts: (layouts: LayoutName[]) => void
  setCaptions: (captions: string[]) => void
  setZoomLevel: (zoomLevel: number) => void
  setPage: (page: HTMLDivElement) => void
  setGeneratingStory: (isGeneratingStory: boolean) => void
  setGeneratingImages: (panelId: number, value: boolean) => void
  setGeneratingText: (isGeneratingText: boolean) => void
  pageToImage: () => Promise<string>
  download: () => Promise<void>
  generate: (prompt: string, presetName: PresetName, layoutName: LayoutName) => void
}>((set, get) => ({
  prompt: "",
  font: "actionman",
  preset: getPreset(defaultPreset),
  nbFrames: 1,
  panels: [],
  captions: [],
  showCaptions: false,
  layout: defaultLayout,
  layouts: [defaultLayout, defaultLayout],
  zoomLevel: 60,
  page: undefined as unknown as HTMLDivElement,
  isGeneratingStory: false,
  panelGenerationStatus: {},
  isGeneratingText: false,
  atLeastOnePanelIsBusy: false,
  setPrompt: (prompt: string) => {
    const existingPrompt = get().prompt
    if (prompt === existingPrompt) { return }
    set({
      prompt,
    })
  },
  setFont: (font: FontName) => {
    const existingFont = get().font
    if (font === existingFont) { return }
    set({
      font,
    })
  },
  setPreset: (preset: Preset) => {
    const existingPreset = get().preset
    if (preset.label === existingPreset.label) { return }
    set({
      preset,
    })
  },
  setNbFrames: (nbFrames: number) => {
    const existingNbFrames = get().nbFrames
    if (nbFrames === existingNbFrames) { return }
    set({
      nbFrames,
    })
  },
  setPanels: (panels: string[]) => set({ panels }),
  setCaptions: (captions: string[]) => {
    set({
      captions,
    })
  },
  setShowCaptions: (showCaptions: boolean) => {
    set({
      showCaptions,
    })
  },
  setLayout: (layoutName: LayoutName) => {
    const layout = layoutName === "random"
      ? getRandomLayoutName()
      : layoutName

    set({
      layout,
      layouts: [layout, layout]
    })
  },
  setLayouts: (layouts: LayoutName[]) => set({ layouts }),
  setZoomLevel: (zoomLevel: number) =>  set({ zoomLevel }),
  setPage: (page: HTMLDivElement) => {
    if (!page) { return }
    set({ page })
  },
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
  pageToImage: async () => {
    const { page } = get()
    if (!page) { return "" }
    
    
    const canvas = await html2canvas(page)
    console.log("canvas:", canvas)

    const data = canvas.toDataURL('image/jpeg', 0.5)
    return data
  },
  download: async () => {
    const { pageToImage } = get()
    const data = await pageToImage()
   
    const link = document.createElement('a')

    if (typeof link.download === 'string') {
      link.href = data
      link.download = 'comic.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      window.open(data)
    }
  },
  generate: (prompt: string, presetName: PresetName, layoutName: LayoutName) => {
    const layout = layoutName === "random"
      ? getRandomLayoutName()
      : layoutName
    set({
      prompt,
      panels: [],
      captions: [],
      preset: presetName === "random"
        ? getRandomPreset()
        : getPreset(presetName),
      layout,
      layouts: [layout, layout],
    })
  }
}))
