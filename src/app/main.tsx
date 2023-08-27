"use client"

import { useEffect, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { PresetName, defaultPreset, getPreset } from "@/app/engine/presets"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { FontName, defaultFont } from "@/lib/fonts"
import { getRandomLayoutName, layouts } from "./layouts"
import { useStore } from "./store"

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

    // what we want is for it to invent a small "story"
    setPanels([ panelPrompt, panelPrompt, panelPrompt, panelPrompt ])
  }, [prompt, preset]) // important: we need to react to preset changes too

  const LayoutElement = (layouts as any)[layout]

  return (
    <div className={cn(
      ``
    )}>
      <TopMenu />
      <div className="flex flex-col items-center w-screen h-screen pt-16 overflow-y-scroll">
        <LayoutElement />
      </div>
    </div>
  )
}