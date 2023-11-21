"use client"

import { useEffect, useState, useTransition } from "react"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { fonts } from "@/lib/fonts"
import { useStore } from "./store"
import { Zoom } from "./interface/zoom"
import { BottomBar } from "./interface/bottom-bar"
import { Page } from "./interface/page"
import { GeneratedPanel } from "@/types"
import { joinWords } from "@/lib/joinWords"
import { getStoryContinuation } from "./queries/getStoryContinuation"

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

      const [stylePrompt, userStoryPrompt] = prompt.split("||").map(x => x.trim())

      // we have to limit the size of the prompt, otherwise the rest of the style won't be followed

      let limitedStylePrompt = stylePrompt.trim().slice(0, 77).trim()
      if (limitedStylePrompt.length !== stylePrompt.length) {
        console.log("Sorry folks, the style prompt was cut to:", limitedStylePrompt)
      }
    
      // new experimental prompt: let's drop the user prompt, and only use the style
      const lightPanelPromptPrefix = joinWords(preset.imagePrompt(limitedStylePrompt))
    
      // this prompt will be used if the LLM generation failed
      const degradedPanelPromptPrefix = joinWords([
        ...preset.imagePrompt(limitedStylePrompt),
    
        // we re-inject the story, then
        userStoryPrompt
      ])

      let existingPanels: GeneratedPanel[] = []
      const newPanelsPrompts: string[] = []
      const newCaptions: string[] = []

      const nbPanelsToGenerate = 2

      for (
        let currentPanel = 0;
        currentPanel < nbTotalPanels;
        currentPanel += nbPanelsToGenerate
      ) {
        try {
          const candidatePanels = await getStoryContinuation({
            preset,
            stylePrompt,
            userStoryPrompt,
            nbPanelsToGenerate,
            nbTotalPanels,
            existingPanels,
          })
          console.log("LLM generated some new panels:", candidatePanels)

          existingPanels.push(...candidatePanels)

          console.log(`Converting the ${nbPanelsToGenerate} new panels into image prompts..`)
         
          const startAt = currentPanel
          const endAt = currentPanel + nbPanelsToGenerate
          for (let p = startAt; p < endAt; p++) {
            newCaptions.push(existingPanels[p]?.caption.trim() || "...")
            const newPanel = joinWords([
    
              // what we do here is that ideally we give full control to the LLM for prompting,
              // unless there was a catastrophic failure, in that case we preserve the original prompt
              existingPanels[p]?.instructions
              ? lightPanelPromptPrefix
              : degradedPanelPromptPrefix,
    
              existingPanels[p]?.instructions
            ])
            newPanelsPrompts.push(newPanel)

            console.log(`Image prompt for panel ${p} => "${newPanel}"`)
          }

          // update the frontend
          // console.log("updating the frontend..")
          setCaptions(newCaptions)
          setPanels(newPanelsPrompts)    

          setGeneratingStory(false)
        } catch (err) {
          console.log("failed to generate the story, aborting here")
          setGeneratingStory(false)
          break
        }
        if (currentPanel > (nbTotalPanels / 2)) {
          console.log("good, we are half way there, hold tight!")
          // setWaitABitMore(true)
        }
      }
   
      /*
      setTimeout(() => {
        setGeneratingStory(false)
        setWaitABitMore(false)
      }, enableRateLimiter ? 12000 : 0)
      */
 
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
          ? `bg-zinc-50/30 backdrop-blur-md`
          : `bg-zinc-50/0 backdrop-blur-none pointer-events-none`,
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