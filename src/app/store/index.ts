"use client"

import { create } from "zustand"
import html2canvas from "html2canvas"

import { FontName } from "@/lib/fonts"
import { Preset, PresetName, defaultPreset, getPreset, getRandomPreset } from "@/app/engine/presets"
import { RenderedScene } from "@/types"
import { LayoutName, defaultLayout, getRandomLayoutName } from "../layouts"
import { getParam } from "@/lib/getParam"

export const useStore = create<{
  prompt: string
  font: FontName
  preset: Preset
  currentNbPanelsPerPage: number
  maxNbPanelsPerPage: number
  currentNbPages: number
  maxNbPages: number
  previousNbPanels: number
  currentNbPanels: number
  maxNbPanels: number
  panels: string[]
  captions: string[]
  upscaleQueue: Record<string, RenderedScene>
  showCaptions: boolean
  renderedScenes: Record<string, RenderedScene>
  layout: LayoutName
  layouts: LayoutName[]
  zoomLevel: number
  page: HTMLDivElement
  isGeneratingStory: boolean
  panelGenerationStatus: Record<number, boolean>
  isGeneratingText: boolean
  atLeastOnePanelIsBusy: boolean

  setCurrentNbPanelsPerPage: (currentNbPanelsPerPage: number) => void
  setMaxNbPanelsPerPage: (maxNbPanelsPerPage: number) => void
  setCurrentNbPages: (currentNbPages: number) => void
  setMaxNbPages: (maxNbPages: number) => void
  setPreviousNbPanels: (previousNbPanels: number) => void
  setCurrentNbPanels: (currentNbPanels: number) => void
  setMaxNbPanels: (maxNbPanels: number) => void
  
  setRendered: (panelId: string, renderedScene: RenderedScene) => void
  addToUpscaleQueue: (panelId: string, renderedScene: RenderedScene) => void
  removeFromUpscaleQueue: (panelId: string) => void
  setPrompt: (prompt: string) => void
  setFont: (font: FontName) => void
  setPreset: (preset: Preset) => void
  setPanels: (panels: string[]) => void
  setPanelPrompt: (newPrompt: string, index: number) => void
  setShowCaptions: (showCaptions: boolean) => void
  setLayout: (layout: LayoutName) => void
  setLayouts: (layouts: LayoutName[]) => void
  setCaptions: (captions: string[]) => void
  setPanelCaption: (newCaption: string, index: number) => void
  setZoomLevel: (zoomLevel: number) => void

  setGeneratingStory: (isGeneratingStory: boolean) => void
  setGeneratingImages: (panelId: string, value: boolean) => void
  setGeneratingText: (isGeneratingText: boolean) => void
  
  // I think we should deprecate those three functions
  // this was used to keep track of the page HTML element,
  // for use with a HTML-to-bitmap library
  // but the CSS layout wasn't followed properly and it depended on the zoom level
  // pageToImage: () => Promise<string>
  // download: () => Promise<void>
  // setPage: (page: HTMLDivElement) => void

  generate: (prompt: string, presetName: PresetName, layoutName: LayoutName) => void
}>((set, get) => ({
  prompt:
    (getParam("stylePrompt", "") || getParam("storyPrompt", ""))
     ? `${getParam("stylePrompt", "")}||${getParam("storyPrompt", "")}`
     : "",
  font: "actionman",
  preset: getPreset(getParam("preset", defaultPreset)),

  currentNbPanelsPerPage: 4,
  maxNbPanelsPerPage: 4,
  currentNbPages: 1,
  maxNbPages: getParam("maxNbPages", 1),
  previousNbPanels: 0,
  currentNbPanels: 4,
  maxNbPanels: 4,

  panels: [],
  captions: [],
  upscaleQueue: {} as Record<string, RenderedScene>,
  renderedScenes: {} as Record<string, RenderedScene>,
  showCaptions: getParam("showCaptions", false),

  // deprecated?
  layout: defaultLayout,

  layouts: [defaultLayout, defaultLayout, defaultLayout, defaultLayout],

  zoomLevel: getParam("zoomLevel", 60),

  // deprecated?
  page: undefined as unknown as HTMLDivElement,

  isGeneratingStory: false,
  panelGenerationStatus: {},
  isGeneratingText: false,
  atLeastOnePanelIsBusy: false,

  setCurrentNbPanelsPerPage: (currentNbPanelsPerPage: number) => {
    const { currentNbPages } = get()
    set({
      currentNbPanelsPerPage,
      currentNbPanels: currentNbPanelsPerPage * currentNbPages
    })
  },
  setMaxNbPanelsPerPage: (maxNbPanelsPerPage: number) => {
    const { maxNbPages } = get()
    set({
      maxNbPanelsPerPage,
      maxNbPanels: maxNbPanelsPerPage * maxNbPages,
    })
  },
  setCurrentNbPages: (currentNbPages: number) => {
    const state = get()

    const newCurrentNumberOfPages = Math.min(state.maxNbPages, currentNbPages)
    
    const newCurrentNbPanels = state.currentNbPanelsPerPage * newCurrentNumberOfPages

    /*
    console.log(`setCurrentNbPages(${currentNbPages}): ${JSON.stringify({
      "state.maxNbPages": state.maxNbPages,
      currentNbPages,
      newCurrentNumberOfPages,
      "state.currentNbPanelsPerPage": state.currentNbPanelsPerPage,
      newCurrentNbPanels,
      "state.currentNbPanels": state.currentNbPanels,
      "state.previousNbPanels": state.previousNbPanels,
      previousNbPanels:
      newCurrentNbPanels > state.currentNbPanels ? state.currentNbPanels :
      newCurrentNbPanels < state.currentNbPanels ? 0 :
      state.previousNbPanels,

    }, null, 2)}`)
    */

    set({
      // we keep the previous number of panels for convenience
      // so if we are adding a new panel,
      // state.currentNbPanels gets copied to state.previousNbPanels
      previousNbPanels:
        newCurrentNbPanels > state.currentNbPanels ? state.currentNbPanels :
        newCurrentNbPanels < state.currentNbPanels ? 0 :
        state.previousNbPanels,

      currentNbPanels: newCurrentNbPanels,
      currentNbPages: newCurrentNumberOfPages,
  
    })
  },
  setMaxNbPages: (maxNbPages: number) => {
    const { maxNbPanelsPerPage } = get()
    set({
      maxNbPages,
      maxNbPanels: maxNbPanelsPerPage * maxNbPages,
    })
  },
  setPreviousNbPanels: (previousNbPanels: number) => {
    set({
      previousNbPanels
    })
  },
  setCurrentNbPanels: (currentNbPanels: number) => {
    const state = get()


    /*
    console.log(`setCurrentNbPanels(${currentNbPanels}): ${JSON.stringify({
      "state.maxNbPages": state.maxNbPages,
      "state.currentNbPages": state.currentNbPages,
      currentNbPanels,
      "state.currentNbPanelsPerPage": state.currentNbPanelsPerPage,
      "state.currentNbPanels": state.currentNbPanels,
      "state.previousNbPanels": state.previousNbPanels,
      previousNbPanels:
      currentNbPanels > state.currentNbPanels ? state.currentNbPanels :
        currentNbPanels < state.currentNbPanels ? 0 :
        state.previousNbPanels,

    }, null, 2)}`)
    */

    set({
      // we keep the previous number of panels for convenience
      // so if we are adding a new panel,
      // state.currentNbPanels gets copied to state.previousNbPanels
      previousNbPanels:
        currentNbPanels > state.currentNbPanels ? state.currentNbPanels :
        currentNbPanels < state.currentNbPanels ? 0 :
        state.previousNbPanels,
      
      currentNbPanels,
    })
  },
  setMaxNbPanels: (maxNbPanels: number) => {
    set({
      maxNbPanels
    })
  },
  
  setRendered: (panelId: string, renderedScene: RenderedScene) => {
    const { renderedScenes } = get()
    set({
      renderedScenes: {
        ...renderedScenes,
        [panelId]: renderedScene
      }
    })
  },
  addToUpscaleQueue: (panelId: string, renderedScene: RenderedScene) => {
    const { upscaleQueue } = get()
    set({
      upscaleQueue: {
        ...upscaleQueue,
        [panelId]: renderedScene
      },
    })
  },
  removeFromUpscaleQueue: (panelId: string) => {
    const upscaleQueue = { ...get().upscaleQueue }
    delete upscaleQueue[panelId]
    set({
      upscaleQueue,
    })
  },
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
  setPanels: (panels: string[]) => set({ panels }),
  setPanelPrompt: (newPrompt, index) => {
    const { panels } = get()
    set({
      panels: panels.map((p, i) => (
        index === i ? newPrompt : p
      ))
    })
  },
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
  setPanelCaption: (newCaption, index) => {
    const { captions } = get()
    set({
      captions: captions.map((c, i) => (
        index === i ? newCaption : c
      ))
    })
  },
  setLayout: (layoutName: LayoutName) => {
    const { maxNbPages, currentNbPanelsPerPage } = get()

    const layouts: LayoutName[] = []
    for (let i = 0; i < maxNbPages; i++) {
      layouts.push(
        layoutName === "random"
          ? getRandomLayoutName()
          : layoutName)
    }

    set({
      // changing the layout isn't a free pass to generate tons of panels at once,
      // so we reset pretty much everything
      previousNbPanels: 0,
      currentNbPages: 1,
      currentNbPanels: currentNbPanelsPerPage,
      panels: [],
      captions: [],
      upscaleQueue: {},
      renderedScenes: {},
      isGeneratingStory: false,
      panelGenerationStatus: {},
      isGeneratingText: false,
      atLeastOnePanelIsBusy: false,

      layouts,
      layout: layouts[0],
    })
  },
  setLayouts: (layouts: LayoutName[]) => set({ layouts }),
  setZoomLevel: (zoomLevel: number) =>  set({ zoomLevel }),
  setGeneratingStory: (isGeneratingStory: boolean) => set({ isGeneratingStory }),
  setGeneratingImages: (panelId: string, value: boolean) => {
    const panelGenerationStatus: Record<string, boolean> = {
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

  // I think we should deprecate those three functions
  // this was used to keep track of the page HTML element,
  // for use with a HTML-to-bitmap library
  // but the CSS layout wasn't followed properly and it depended on the zoom level
  /*
  setPage: (page: HTMLDivElement) => {
    if (!page) { return }
    set({ page })
  },
  pageToImage: async () => {
    const { page } = get()
    if (!page) { return "" }
    
    
    const canvas = await html2canvas(page)
    // console.log("canvas:", canvas)

    const data = canvas.toDataURL('image/jpeg', 0.97)
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
  */
  generate: (prompt: string, presetName: PresetName, layoutName: LayoutName) => {
    const { maxNbPages, currentNbPanelsPerPage } = get()

    const layouts: LayoutName[] = []
    for (let i = 0; i < maxNbPages; i++) {
      layouts.push(
        layoutName === "random"
          ? getRandomLayoutName()
          : layoutName)
    }

    set({
      // we reset pretty much everything
      previousNbPanels: 0,
      currentNbPages: 1,
      currentNbPanels: currentNbPanelsPerPage,
      panels: [],
      captions: [],
      upscaleQueue: {},
      renderedScenes: {},
      isGeneratingStory: false,
      panelGenerationStatus: {},
      isGeneratingText: false,
      atLeastOnePanelIsBusy: false,

      prompt,
      preset: presetName === "random"
        ? getRandomPreset()
        : getPreset(presetName),
      layout: layouts[0],
      layouts,
    })
  }
}))
