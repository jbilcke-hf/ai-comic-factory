"use client"

import { useEffect, useRef, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { PresetName, defaultPreset, getPreset } from "@/app/engine/presets"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { FontName, defaultFont, fontList, fonts } from "@/lib/fonts"
import { getRandomLayoutName, layouts } from "./layouts"
import { useStore } from "./store"
import { Zoom } from "./interface/zoom"
import { getStory } from "./queries/getStory"
import { BottomBar } from "./interface/bottom-bar"

export default function Main() {
  const [_isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()

  const requestedPreset = (searchParams.get('preset') as PresetName) || defaultPreset
  const requestedFont = (searchParams.get('font') as FontName) || defaultFont
  const requestedPrompt = (searchParams.get('prompt') as string) || ""

  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const setGeneratingStory = useStore(state => state.setGeneratingStory)

  const font = useStore(state => state.font)
  const setFont = useStore(state => state.setFont)

  const preset = useStore(state => state.preset)
  const setPreset = useStore(state => state.setPreset)

  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)

  const layout = useStore(state => state.layout)
  const setLayout = useStore(state => state.setLayout)

  const setPanels = useStore(state => state.setPanels)

  const zoomLevel = useStore(state => state.zoomLevel)

  const setPage = useStore(state => state.setPage)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = pageRef.current
    if (!element) { return }
    setPage(element)
  }, [pageRef.current])

  // react to URL params
  useEffect(() => {
    if (requestedPreset && requestedPreset !== preset.label) { setPreset(getPreset(requestedPreset)) }
  }, [requestedPreset])

  useEffect(() => {
    if (requestedFont && requestedFont !== font) { setFont(requestedFont) }
  }, [requestedFont])

  useEffect(() => {
    if (requestedPrompt && requestedPrompt !== prompt) { setPrompt(requestedPrompt) }
  }, [requestedPrompt])

  // react to prompt changes
  useEffect(() => {
    if (!prompt) { return }

    startTransition(async () => {

      setGeneratingStory(true)

      const newLayout = getRandomLayoutName()
      console.log("using layout " + newLayout)
      setLayout(newLayout)

      try {
        const llmResponse = await getStory({ preset, prompt })
        console.log("response:", llmResponse)

        // TODO call the LLM here!
        const panelPromptPrefix = preset.imagePrompt(prompt).join(", ")
        console.log("panel prompt prefix:", panelPromptPrefix)
    
        const nbPanels = 4
        const newPanels: string[] = []

        for (let p = 0; p < nbPanels; p++) {
          const newPanel = [panelPromptPrefix, llmResponse[p] || ""]
          newPanels.push(newPanel.map(chunk => chunk).join(", "))
        }
        console.log("newPanels:", newPanels)
        setPanels(newPanels)
      } catch (err) {
        console.error(err)
      } finally {
        setGeneratingStory(false)
      }
    })
  }, [prompt, preset?.label]) // important: we need to react to preset changes too

  const LayoutElement = (layouts as any)[layout]

  return (
    <div>
      <TopMenu />
      <div className={cn(
        `flex items-start w-screen h-screen pt-[120px] px-16 md:pt-[72px] overflow-y-scroll`,
        `transition-all duration-200 ease-in-out`,

        fonts.actionman.className
      )}>
        <div className="flex flex-col items-center w-full">
          <div
            ref={pageRef}
            className={cn(
              `flex flex-col items-center justify-start`,

              // we are trying to reach a "book" look
              // we are using aspect-[297/210] because it matches A4 (297mm x 210mm)
              // `aspect-[210/297]`,
              `aspect-[250/297]`,

              `transition-all duration-100 ease-in-out`,
              `border border-stone-200`,
              `shadow-2xl`
            )}
            style={{
              width: `${zoomLevel}%`,
              padding: `${Math.round((zoomLevel / 100) * 16)}px`
            }}
            >
            <LayoutElement />
          </div>
        </div>
      </div>
      <Zoom />
      <BottomBar />
      <div className={cn(
        `z-20 fixed inset-0`,
        `flex flex-row items-center justify-center`,
        `transition-all duration-300 ease-in-out`,
        isGeneratingStory
          ? `bg-zinc-100/10 backdrop-blur-md`
          : `bg-zinc-100/0 backdrop-blur-none pointer-events-none`,
        fonts.actionman.className
      )}>
        <div className={cn(
          `text-center text-lg text-stone-600 w-[70%]`,
          isGeneratingStory ? ``: `scale-0 opacity-0`,
          `transition-all duration-300 ease-in-out`,
        )}>
          Generating your story.. (hold tight)
        </div>
      </div>
    </div>
  )
}