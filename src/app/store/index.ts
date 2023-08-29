"use client"

import { create } from "zustand"

import { FontName } from "@/lib/fonts"
import { Preset, getPreset } from "@/app/engine/presets"
import { LayoutName, getRandomLayoutNames } from "../layouts"
import html2canvas from "html2canvas"

export const useStore = create<{
  prompt: string
  font: FontName
  preset: Preset
  nbFrames: number
  panels: string[]
  captions: Record<string, string>
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
  setLayouts: (layouts: LayoutName[]) => void
  setCaption: (panelId: number, caption: string) => void
  setZoomLevel: (zoomLevel: number) => void
  setPage: (page: HTMLDivElement) => void
  setGeneratingStory: (isGeneratingStory: boolean) => void
  setGeneratingImages: (panelId: number, value: boolean) => void
  setGeneratingText: (isGeneratingText: boolean) => void
  download: () => void
}>((set, get) => ({
  prompt: "",
  font: "actionman",
  preset: getPreset("japanese_manga"),
  nbFrames: 1,
  panels: [],
  captions: {},
  layouts: getRandomLayoutNames(),
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
      layouts: getRandomLayoutNames(),
      panels: [],
      captions: {},
    })
  },
  setFont: (font: FontName) => {
    const existingFont = get().font
    if (font === existingFont) { return }
    set({
      font,
      layouts: getRandomLayoutNames(),
      panels: [],
      captions: {}
    })
  },
  setPreset: (preset: Preset) => {
    const existingPreset = get().preset
    if (preset.label === existingPreset.label) { return }
    set({
      preset,
      layouts: getRandomLayoutNames(),
      panels: [],
      captions: {}
    })
  },
  setNbFrames: (nbFrames: number) => {
    const existingNbFrames = get().nbFrames
    if (nbFrames === existingNbFrames) { return }
    set({
      nbFrames,
      layouts: getRandomLayoutNames(),
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
  download: async () => {
    console.log("download called!")
    const { page } = get()
    console.log("page:", page)
    if (!page) { return }
    
    const canvas = await html2canvas(page)
    console.log("canvas:", canvas)

    const data = canvas.toDataURL('image/jpg')
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
  }
}))
