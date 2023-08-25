"use client"

import { useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import "react-virtualized/styles.css" // only needs to be imported once

import { Preset, PresetName, defaultPreset, getPreset } from "@/app/engine/presets"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { FontName } from "@/lib/fonts"
import Panel from "./interface/panel"

export default function Main() {
  const [_isPending, startTransition] = useTransition()
  const [isLoading, setLoading] = useState<boolean>()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const requestedPreset = (searchParams.get('preset') as PresetName) || defaultPreset
  const [preset, setPreset] = useState<Preset>(getPreset(requestedPreset))

  const [font, setFont] = useState<FontName>("cartoonist")

  const requestedPrompt = (searchParams.get('prompt') as string) || ""
  const [prompt, setPrompt] = useState<string>(requestedPrompt)
  const [panelPrompts, setPanelPrompts] = useState<string[]>([])
  
  const handleChangeFont = (newFont: FontName) => {
    setFont(newFont)
  }

  const handleChangePreset = (newPresetName: PresetName) => {
    setPreset(getPreset(newPresetName))
  }

  const handleChangePrompt = (newPrompt: string) => {
    setPrompt(newPrompt)

    // TODO call the LLM here!
    const prompt = preset.imagePrompt(newPrompt).join(", ")

    setPanelPrompts([
      prompt,
      prompt,
      prompt,
      prompt
    ])
  }

  return (
    <div className={cn(
      ``
    )}>
      <TopMenu
        defaultPreset={defaultPreset}
        preset={preset}
        onChangePreset={handleChangePreset}
        font={font}
        onChangeFont={handleChangeFont}
        prompt={prompt}
        onChangePrompt={handleChangePrompt}
      />
      <div className="flex flex-col items-center w-screen h-screen pt-16 overflow-y-scroll">
          <div
            // the "fixed" width ensure our comic keeps a consistent ratio
            className="grid grid-cols-2 grid-rows-3 gap-4 w-[1160px] h-screen">
            <div className="bg-stone-100">
              <Panel
                prompt={panelPrompts[0]}
                font={font}
                preset={preset}
                width={1024}
                height={512}
              />
            </div>
            <div className="bg-zinc-100 row-span-2">
              <Panel
                prompt={panelPrompts[1]}
                font={font}
                preset={preset}
                width={1024}
                height={1024}
              />
            </div>
            <div className="bg-gray-100 row-span-2 col-span-1">
              <Panel
                prompt={panelPrompts[2]}
                font={font}
                preset={preset}
                width={1024}
                height={1024}
              />
            </div>
            <div className="bg-slate-100">
              <Panel
                prompt={panelPrompts[3]}
                font={font}
                preset={preset}
                width={1024}
                height={512}
              />
            </div>
          </div>
        </div>
    </div>

  )
}