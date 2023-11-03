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
import { LLMResponse } from "@/types"

export default function Main() {
  const [_isPending, startTransition] = useTransition()

  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const setGeneratingStory = useStore(state => state.setGeneratingStory)

  const font = useStore(state => state.font)
  const preset = useStore(state => state.preset)
  const prompt = useStore(state => state.prompt)

  const nbPages = useStore(state => state.nbPages)
  const nbTotalPanels = useStore(state => state.nbTotalPanels)

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

      // I don't think we are going to need a rate limiter on the LLM part anymore
      const enableRateLimiter = false // `${process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITER}`  === "true"

      let llmResponse: LLMResponse = []

      const [stylePrompt, userStoryPrompt] = prompt.split("||")

      try {
        llmResponse = await getStory({
          preset,
          prompt: [
            `${userStoryPrompt}`,
            stylePrompt ? `in the following context: ${stylePrompt}` : ''
          ].filter(x => x).join(", "), nbTotalPanels })
        console.log("LLM responded:", llmResponse)

      } catch (err) {
        console.log("LLM step failed due to:", err)
        console.log("we are now switching to a degraded mode, using 4 similar panels")
        
        llmResponse = []
        for (let p = 0; p < nbTotalPanels; p++) {
          llmResponse.push({
            panel: p,
            instructions: `${prompt} ${".".repeat(p)}`,
            caption: "(Sorry, LLM generation failed: using degraded mode)"
          })
        }
        console.error(err)
      }

      // we have to limit the size of the prompt, otherwise the rest of the style won't be followed

      let limitedStylePrompt = stylePrompt.slice(0, 77)
      if (limitedStylePrompt.length !== stylePrompt.length) {
        console.log("Sorry folks, the style prompt was cut to:", limitedStylePrompt)
      }

      // new experimental prompt: let's drop the user prompt, and only use the style
      const lightPanelPromptPrefix = preset.imagePrompt(limitedStylePrompt).filter(x => x).join(", ")

      // this prompt will be used if the LLM generation failed
      const degradedPanelPromptPrefix = [
        ...preset.imagePrompt(limitedStylePrompt),

        // we re-inject the story, then
        userStoryPrompt,
      ].filter(x => x).join(", ")

      const newPanels: string[] = []
      const newCaptions: string[] = []
      setWaitABitMore(true)
      console.log("Panel prompts for SDXL:")
      for (let p = 0; p < nbTotalPanels; p++) {
        newCaptions.push(llmResponse[p]?.caption || "...")
        const newPanel = [

          // what we do here is that ideally we give full control to the LLM for prompting,
          // unless there was a catastrophic failure, in that case we preserve the original prompt
          llmResponse[p]?.instructions
          ? lightPanelPromptPrefix
          : degradedPanelPromptPrefix,

          llmResponse[p]?.instructions || ""
        ].map(chunk => chunk).join(", ")
        newPanels.push(newPanel)
        console.log(newPanel)
      }
   
      setCaptions(newCaptions)
      setPanels(newPanels)

      setTimeout(() => {
        setGeneratingStory(false)
        setWaitABitMore(false)
      }, enableRateLimiter ? 12000 : 0)
 
    })
  }, [prompt, preset?.label, nbTotalPanels]) // important: we need to react to preset changes too

  return (
    <div>
      <TopMenu />
      <div className={cn(
        `flex items-start w-screen h-screen pt-24 md:pt-[72px] overflow-y-scroll`,
        `transition-all duration-200 ease-in-out`,
        zoomLevel > 105 ? `px-0` : `pl-1 pr-8 md:pl-16 md:pr-16`,
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
              `flex flex-col md:flex-row md:space-x-8 lg:space-x-12 xl:space-x-16 md:items-center md:justify-start print:space-x-4`,
            )}
            style={{
              width: `${zoomLevel}%`
            }}>
            <Page page={0} />

            <Page page={1} />
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
          `text-center text-xl text-stone-700 w-[70%]`,
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