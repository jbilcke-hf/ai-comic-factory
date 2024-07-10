"use client"

import { create } from "zustand"
import { ClapProject, ClapMediaOrientation, ClapSegment, ClapSegmentCategory, ClapSegmentStatus, ClapOutputType, ClapSegmentFilteringMode, filterSegments, newClap, newSegment, parseClap, serializeClap } from "@aitube/clap"

import { FontName } from "@/lib/fonts"
import { Preset, PresetName, defaultPreset, getPreset, getRandomPreset } from "@/app/engine/presets"
import { RenderedScene } from "@/types"
import { getParam } from "@/lib/getParam"

import { LayoutName, defaultLayout, getRandomLayoutName } from "../layouts"
import { putTextInInput } from "@/lib/putTextInInput"
import { parsePresetFromPrompts } from "@/lib/parsePresetFromPrompts"
import { parseLayoutFromStoryboards } from "@/lib/parseLayoutFromStoryboards"

export const useStore = create<{
  prompt: string
  font: FontName
  preset: Preset
  currentClap?: ClapProject
  currentNbPanelsPerPage: number
  maxNbPanelsPerPage: number
  currentNbPages: number
  maxNbPages: number
  previousNbPanels: number
  currentNbPanels: number
  maxNbPanels: number
  panels: string[]
  speeches: string[]
  captions: string[]
  upscaleQueue: Record<string, RenderedScene>
  showSpeeches: boolean
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
  setLayout: (layout: LayoutName, index?: number) => void
  setLayouts: (layouts: LayoutName[]) => void
  setShowSpeeches: (showSpeeches: boolean) => void
  setSpeeches: (speeches: string[]) => void
  setPanelSpeech: (newSpeech: string, index: number) => void
  setShowCaptions: (showCaptions: boolean) => void
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
  convertComicToClap: () => Promise<ClapProject>
  convertClapToComic: (clap: ClapProject) => Promise<{
    currentNbPanels: number
    prompt: string
    preset: Preset
    layout: LayoutName
    storyPrompt: string
    stylePrompt: string
    panels: string[]
    renderedScenes: Record<string, RenderedScene>
    speeches: string[]
    captions: string[]
  }>
  loadClap: (blob: Blob) => Promise<void>
  downloadClap: () => Promise<void>
}>((set, get) => ({
  prompt:
    (getParam("stylePrompt", "") || getParam("storyPrompt", ""))
     ? `${getParam("stylePrompt", "")}||${getParam("storyPrompt", "")}`
     : "",
  font: "actionman",
  preset: getPreset(getParam("preset", defaultPreset)),

  currentClap: undefined,
  currentNbPanelsPerPage: 4,
  maxNbPanelsPerPage: 4,
  currentNbPages: 1,
  maxNbPages: getParam("maxNbPages", 1),
  previousNbPanels: 0,
  currentNbPanels: 4,
  maxNbPanels: 4,

  panels: [],
  speeches: [],
  captions: [],
  upscaleQueue: {} as Record<string, RenderedScene>,
  renderedScenes: {} as Record<string, RenderedScene>,
  showSpeeches: getParam("showSpeeches", false),
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
  setSpeeches: (speeches: string[]) => {
    set({
      speeches,
    })
  },
  setShowSpeeches: (showSpeeches: boolean) => {
    set({
      showSpeeches,
    })
  },
  setPanelSpeech: (newSpeech, index) => {
    const { speeches } = get()
    set({
      speeches: speeches.map((c, i) => (
        index === i ? newSpeech : c
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
  setLayout: (layoutName: LayoutName, index?: number) => {
    const { maxNbPages, currentNbPanelsPerPage, layouts } = get()

    for (let i = 0; i < maxNbPages; i++) {
      let name = layoutName === "random" ? getRandomLayoutName() : layoutName

      if (typeof index === "number" && !isNaN(index) && isFinite(index)) {
        if (i === index) {
          layouts[i] = name
        }
      } else {
        layouts[i] = name
      }
    }

    set({
      // changing the layout isn't a free pass to generate tons of panels at once,
      // so we reset pretty much everything
      previousNbPanels: 0,
      currentNbPages: 1,
      currentNbPanels: currentNbPanelsPerPage,
      panels: [],
      speeches: [],
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
      speeches: [],
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
  },
  
  convertComicToClap: async (): Promise<ClapProject> => {
    const {
      currentNbPanels,
      prompt,
      panels,
      renderedScenes,
      speeches,
      captions
    } = get()

    const defaultSegmentDurationInMs = 7000

    let currentElapsedTimeInMs = 0


    const clap: ClapProject = newClap({
      meta: {
        title: "Untitled", // we don't need a title actually
        description: prompt,
        prompt: prompt,
        synopsis: "",
        licence: "",
        orientation: ClapMediaOrientation.LANDSCAPE,
        width: 512,
        height: 288,
        isInteractive: false,
        isLoop: false,
        durationInMs: panels.length * defaultSegmentDurationInMs,
        defaultVideoModel: "SDXL",
      }
    })

    for (let i = 0; i < panels.length; i++) {

      const panel = panels[i]
      const speech = speeches[i]
      const caption = captions[i]

      const renderedScene = renderedScenes[`${i}`]

      clap.segments.push(newSegment({
        track: 1,
        startTimeInMs: currentElapsedTimeInMs,
        assetDurationInMs: defaultSegmentDurationInMs,
        category: ClapSegmentCategory.STORYBOARD,
        prompt: panel,
        outputType: ClapOutputType.IMAGE,
        assetUrl: renderedScene?.assetUrl || "",
        status: ClapSegmentStatus.COMPLETED,
      }))
  
      clap.segments.push(newSegment({
        track: 2,
        startTimeInMs: currentElapsedTimeInMs,
        assetDurationInMs: defaultSegmentDurationInMs,
        category: ClapSegmentCategory.INTERFACE,
        prompt: caption,
        // assetUrl: `data:text/plain;base64,${btoa(title)}`,
        assetUrl: caption,
        outputType: ClapOutputType.TEXT,
        status: ClapSegmentStatus.COMPLETED,
      }))
  
      clap.segments.push(newSegment({
        track: 3,
        startTimeInMs: currentElapsedTimeInMs,
        assetDurationInMs: defaultSegmentDurationInMs,
        category: ClapSegmentCategory.DIALOGUE,
        prompt: speech,
        outputType: ClapOutputType.AUDIO,
        status: ClapSegmentStatus.TO_GENERATE,
      }))
  
      // the presence of a camera is mandatory
      clap.segments.push(newSegment({
        track: 4,
        startTimeInMs: currentElapsedTimeInMs,
        assetDurationInMs: defaultSegmentDurationInMs,
        category: ClapSegmentCategory.CAMERA,
        prompt: "movie still",
        outputType: ClapOutputType.TEXT,
        status: ClapSegmentStatus.COMPLETED,
      }))
  
      currentElapsedTimeInMs += defaultSegmentDurationInMs
    }

    set({ currentClap: clap })

    return clap
  },

  convertClapToComic: async (clap: ClapProject): Promise<{
    currentNbPanels: number
    prompt: string
    preset: Preset
    layout: LayoutName
    storyPrompt: string
    stylePrompt: string
    panels: string[]
    renderedScenes: Record<string, RenderedScene>
    speeches: string[]
    captions: string[]
  }> => {

    const prompt = clap.meta.description
    const [stylePrompt, storyPrompt] = prompt.split("||").map(x => x.trim())

    const panels: string[] = []
    const renderedScenes: Record<string, RenderedScene> = {}
    const captions: string[] = []
    const speeches: string[] = []

    const panelGenerationStatus: Record<number, boolean> = {}

    const cameraShots = clap.segments.filter(s => s.category === ClapSegmentCategory.CAMERA)

    const shots = cameraShots.map(cameraShot => ({
      camera: cameraShot,
      storyboard: filterSegments(
        ClapSegmentFilteringMode.START,
        cameraShot,
        clap.segments,
        ClapSegmentCategory.STORYBOARD,
      ).at(0) as (ClapSegment | undefined),
      ui: filterSegments(
        ClapSegmentFilteringMode.START,
        cameraShot,
        clap.segments,
        ClapSegmentCategory.INTERFACE,
      ).at(0) as (ClapSegment | undefined),
      dialogue: filterSegments(
        ClapSegmentFilteringMode.START,
        cameraShot,
        clap.segments,
        ClapSegmentCategory.DIALOGUE,
      ).at(0) as (ClapSegment | undefined)
    })).filter(item => item.storyboard && item.ui) as {
      camera: ClapSegment
      storyboard: ClapSegment
      ui: ClapSegment
      dialogue: ClapSegment
    }[]

    shots.forEach(({ camera, storyboard, ui, dialogue }, id) => {

      panels.push(storyboard.prompt)

      const renderedScene: RenderedScene = {
        renderId: storyboard?.id || "",
        status: "pending",
        assetUrl: "", 
        alt: storyboard?.prompt || "",
        error: "",
        maskUrl: "",
        segments: []
      }

      if (storyboard?.assetUrl) {
        renderedScene.assetUrl = storyboard.assetUrl
        renderedScene.status = "pregenerated" // <- special trick to indicate that it should not be re-generated
      }

      renderedScenes[id] = renderedScene

      panelGenerationStatus[id] = false
      
      speeches.push(dialogue?.prompt || "")

      captions.push(ui?.prompt || "")
    })


    return {
      currentNbPanels: shots.length,
      prompt,
      preset: parsePresetFromPrompts(panels),
      layout: await parseLayoutFromStoryboards(shots.map(x => x.storyboard)),
      storyPrompt,
      stylePrompt,
      panels,
      renderedScenes,
      speeches,
      captions,

    }
  },

  loadClap: async (blob: Blob) => {
    const { convertClapToComic, currentNbPanelsPerPage } = get()

    const currentClap = await parseClap(blob)

    const {
      currentNbPanels,
      prompt,
      preset,
      layout,
      storyPrompt,
      stylePrompt,
      panels,
      renderedScenes,
      speeches,
      captions,
    } = await convertClapToComic(currentClap)

    // kids, don't do this in your projects: use state managers instead!
    putTextInInput(document.getElementById("top-menu-input-style-prompt") as HTMLInputElement, stylePrompt)
    putTextInInput(document.getElementById("top-menu-input-story-prompt") as HTMLInputElement, storyPrompt)

    set({
      currentClap,
      currentNbPanels,
      prompt,
      preset,
      // layout,
      panels,
      renderedScenes,
      speeches,
      captions,
      currentNbPages: Math.round(currentNbPanels / currentNbPanelsPerPage),
      upscaleQueue: {},
      isGeneratingStory: false,
      isGeneratingText: false,
    })
  },

  downloadClap: async () => {
    const { convertComicToClap, prompt } = get()

    const currentClap = await convertComicToClap()

    if (!currentClap) { throw new Error(`cannot save a clap.. if there is no clap`) }

    const currentClapBlob: Blob = await serializeClap(currentClap)

    // Create an object URL for the compressed clap blob
    const objectUrl = URL.createObjectURL(currentClapBlob)
  
    // Create an anchor element and force browser download
    const anchor = document.createElement("a")
    anchor.href = objectUrl

    const [stylePrompt, storyPrompt] = prompt.split("||").map(x => x.trim())

    const cleanStylePrompt = (stylePrompt || "").replace(/([^a-z0-9, ]+)/gi, " ")

    const firstPartOfStory = (storyPrompt || "").split(",").shift() || ""
    const cleanStoryPrompt = firstPartOfStory.replace(/([^a-z0-9, ]+)/gi, " ")

    const cleanName = `${cleanStoryPrompt.slice(0, 90)} (${cleanStylePrompt.slice(0, 90) || "default style"})`

    anchor.download = `${cleanName}.clap`

    document.body.appendChild(anchor) // Append to the body (could be removed once clicked)
    anchor.click() // Trigger the download
  
    // Cleanup: revoke the object URL and remove the anchor element
    URL.revokeObjectURL(objectUrl)
    document.body.removeChild(anchor)
  },
}))
