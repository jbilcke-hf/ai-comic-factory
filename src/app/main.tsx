"use client"

import { useEffect, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { PresetName, defaultPreset, getPreset } from "@/app/engine/presets"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { FontName, defaultFont } from "@/lib/fonts"
import { getRandomLayoutName, layouts } from "./layouts"
import { useStore } from "./store"
import { Zoom } from "./interface/zoom"

export default function Main() {
  const [_isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()

  const requestedPreset = (searchParams.get('preset') as PresetName) || defaultPreset
  const requestedFont = (searchParams.get('font') as FontName) || defaultFont
  const requestedPrompt = (searchParams.get('prompt') as string) || ""

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

    const newLayout = getRandomLayoutName()
    console.log("using layout " + newLayout)
    setLayout(newLayout)

    // TODO call the LLM here!
    const panelPrompt = preset.imagePrompt(prompt).join(", ")
    console.log("panelPrompt:", panelPrompt)

    // what we want is for it to invent a small "story"
    // we are going to use a LLM for this, but until then let's do this:
    setPanels([
      `introduction scene, ${panelPrompt}`,
      panelPrompt,
      panelPrompt,
      `final scene, ${panelPrompt}`,
    ])
  }, [prompt, preset?.label]) // important: we need to react to preset changes too

  const LayoutElement = (layouts as any)[layout]

  return (
    <div>
      <TopMenu />
      <div className={cn(
        `flex items-start w-screen h-screen pt-[120px] px-16 md:pt-[72px] overflow-y-scroll`,
        `transition-all duration-200 ease-in-out`
      )}>
        <div className="flex flex-col items-center w-full">
          <div

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
    </div>
  )
}