"use client"

import { useEffect, useState, useTransition } from "react"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { fonts } from "@/lib/fonts"
import { useStore } from "./store"
import { Zoom } from "./interface/zoom"
import { getStory } from "./queries/getStory"
import { BottomBar } from "./interface/bottom-bar"
import { Page } from "./interface/page"

export default function Main() {
  const [_isPending, startTransition] = useTransition()

  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const setGeneratingStory = useStore(state => state.setGeneratingStory)

  const font = useStore(state => state.font)
  const preset = useStore(state => state.preset)
  const prompt = useStore(state => state.prompt)

  const setLayouts = useStore(state => state.setLayouts)

  const setPanels = useStore(state => state.setPanels)
  const setCaptions = useStore(state => state.setCaptions)

  const zoomLevel = useStore(state => state.zoomLevel)

  const [waitABitMore, setWaitABitMore] = useState(false)


  // react to prompt changes
  useEffect(() => {
    if (!prompt) { return }

    startTransition(async () => {
      setWaitABitMore(false)
      setGeneratingStory(true)

      try {

        const llmResponse = await getStory({ preset, prompt })
        console.log("response:", llmResponse)

        // we have to limit the size of the prompt, otherwise the rest of the style won't be followed

        let limitedPrompt = prompt.slice(0, 77)
        console.log("had to cut the length og the prompt to:", limitedPrompt)

        const panelPromptPrefix = preset.imagePrompt(limitedPrompt).join(", ")
        console.log("panel prompt prefix:", panelPromptPrefix)
    
        const nbPanels = 4
        const newPanels: string[] = []
        const newCaptions: string[] = []
        setWaitABitMore(true)

        for (let p = 0; p < nbPanels; p++) {
          newCaptions.push(llmResponse[p]?.caption || "...")
          const newPanel = [panelPromptPrefix, llmResponse[p]?.instructions || ""]
          newPanels.push(newPanel.map(chunk => chunk).join(", "))
        }
        console.log("newPanels:", newPanels)
        setCaptions(newCaptions)
        setPanels(newPanels)
      } catch (err) {
        console.error(err)
      } finally {
        setTimeout(() => {
          setGeneratingStory(false)
          setWaitABitMore(false)
        }, 12000)
      }
    })
  }, [prompt, preset?.label]) // important: we need to react to preset changes too

  return (
    <div>
      <TopMenu />
      <div className={cn(
        `flex items-start w-screen h-screen pt-[120px] md:pt-[72px] overflow-y-scroll`,
        `transition-all duration-200 ease-in-out`,
        zoomLevel > 105 ? `px-0` : `pl-2 pr-16 md:pl-16 md:pr-16`,
        `print:pt-0 print:px-0 print:pl-0 print:pr-0`,
        fonts.actionman.className
      )}>
        <div
          className={cn(
            `flex flex-col w-full`,
            zoomLevel > 105 ? `items-start` : `items-center`
          )}>
          <div
            className={cn(
              `comic-page`,
              `flex flex-col md:flex-row md:space-x-16 md:items-center md:justify-start`,
            )}
            style={{
              width: `${zoomLevel}%`
            }}>
            <Page page={0} />

            {/*
            // we could support multiple pages here,
            // but let's disable it for now
            <Page page={1} />
            */}
          </div>
        </div>
      </div>
      <Zoom />
      <BottomBar />
      <div className={cn(
        `print:hidden`,
        `z-20 fixed inset-0`,
        `flex flex-row items-center justify-center`,
        `transition-all duration-300 ease-in-out`,
        isGeneratingStory
          ? `bg-zinc-100/10 backdrop-blur-md`
          : `bg-zinc-100/0 backdrop-blur-none pointer-events-none`,
        fonts.actionman.className
      )}>
        <div className={cn(
          `text-center text-xl text-stone-600 w-[70%]`,
          isGeneratingStory ? ``: `scale-0 opacity-0`,
          `transition-all duration-300 ease-in-out`,
        )}>
          {waitABitMore ? `Story is ready, but server is a bit busy!`: 'Generating a new story..'}<br/>
          {waitABitMore ? `Please hold tight..` : ''}
        </div>
      </div>
    </div>
  )
}