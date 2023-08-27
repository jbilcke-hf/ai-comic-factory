"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { FontName, fontList, fonts } from "@/lib/fonts"
import { Input } from "@/components/ui/input"
import { defaultPreset, getPreset, presets } from "@/app/engine/presets"
import { useState } from "react"
import { useStore } from "@/app/store"

export function TopMenu() {
  const font = useStore(state => state.font)
  const setFont = useStore(state => state.setFont)

  const preset = useStore(state => state.preset)
  const setPreset = useStore(state => state.setPreset)

  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)

  const atLeastOnePanelIsBusy = useStore(state => state.atLeastOnePanelIsBusy)

  const [draft, setDraft] = useState("")
  return (
    <div className={cn(
      `z-10 fixed top-0 left-0 right-0`,
      `flex flex-row w-full justify-between items-center`,
      `backdrop-blur-xl`,
      `px-2 py-2 border-b-1 border-gray-50 dark:border-gray-50`,
      `bg-stone-900/70 dark:bg-stone-900/70 text-gray-50 dark:text-gray-50`,
      `space-x-6`
    )}>
      <div className="flex flex-row items-center space-x-3 font-mono">
        <Label className="flex text-sm">Select a preset:</Label>
        <Select
          defaultValue={defaultPreset}
          onValueChange={(value) => { setPreset(getPreset(value as FontName)) }}
          disabled={atLeastOnePanelIsBusy}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue className="text-sm" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(presets).map(([key, preset]) =>
              <SelectItem key={key} value={key}>{preset.label}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row flex-grow items-center space-x-3 font-mono">
        <Input
          placeholder="Story"
          className="w-full bg-neutral-300 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-800"
          disabled={atLeastOnePanelIsBusy}
          onChange={(e) => {
            setDraft(e.target.value)
          }}
          onBlur={(e) => {
            if (draft !== prompt) {
              if (draft.trim() !== prompt.trim()) {
                setPrompt(draft.trim())
              }
            }
          }}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              if (draft.trim() !== prompt.trim()) {
                setPrompt(draft.trim())
              }
            }
          }}
          value={draft}
         />
      </div>
      <div className="flex flex-row items-center space-x-3 font-mono">
        <Label className="flex text-sm">Font:</Label>
        <Select
          defaultValue={fontList.includes(preset.font) ? preset.font : "cartoonist"}
          onValueChange={(value) => { setFont(value as FontName) }}
          disabled={atLeastOnePanelIsBusy}
          >
          <SelectTrigger className="w-[144px]">
            <SelectValue className="text-sm" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(fonts)
              .map((font) =>
              <SelectItem
                key={font}
                value={font}>{
                  font
                }</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}