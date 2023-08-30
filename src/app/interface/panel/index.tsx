"use client"

import { useEffect, useRef, useState, useTransition } from "react"
// import AutoSizer from "react-virtualized-auto-sizer"

import { RenderedScene } from "@/types"

import { getRender, newRender } from "@/app/engine/render"
import { useStore } from "@/app/store"

import { cn } from "@/lib/utils"
import { getInitialRenderedScene } from "@/lib/getInitialRenderedScene"
import { Progress } from "@/app/interface/progress"
import { see } from "@/app/engine/caption"
import { writeIntoBubble } from "@/lib/writeIntoBubble"
// import { Bubble } from "./bubble"

export function Panel({
  panel,
  className = "",
  width = 1,
  height = 1,
  delay = 0,
}: {
  panel: number
  className?: string
  width?: number
  height?: number
  delay?: number
 }) {
  const font = useStore(state => state.font)
  const preset = useStore(state => state.preset)
  const setGeneratingImages = useStore(state => state.setGeneratingImages)

  const panels = useStore(state => state.panels)
  const prompt = panels[panel] || ""

  const zoomLevel = useStore(state => state.zoomLevel)

  // const setCaption = useStore(state => state.setCaption)
  // const captions = useStore(state => state.captions)
  // const caption = captions[panel] || ""

  const [_isPending, startTransition] = useTransition()
  const [rendered, setRendered] = useState<RenderedScene>(getInitialRenderedScene())
  const renderedRef = useRef<RenderedScene>()

  const timeoutRef = useRef<any>(null)

  // since this run in its own loop, we need to use references everywhere
  // but perhaps this could be refactored
  useEffect(() => {
    // console.log("Panel prompt: "+ prompt)
    if (!prompt?.length) { return }

    // important: update the status, and clear the scene
    setGeneratingImages(panel, true)
    setRendered(getInitialRenderedScene())

    setTimeout(() => {
      startTransition(async () => {

      console.log(`Loading panel ${panel}..`)
    
      let newRendered = await newRender({ prompt, width, height })
      try {
        newRendered = await newRender({ prompt, width, height })
      } catch (err) {
        console.log("Failed to load the panel! Don't worry, we are retrying..")
        newRendered = await newRender({ prompt, width, height })
      }

      if (newRendered) {
        // console.log("newRendered:", newRendered)
        setRendered(renderedRef.current = newRendered)

        // but we are still loading!
      } else {
        setRendered(renderedRef.current = {
          renderId: "",
          status: "error",
          assetUrl: "",
          alt: "",
          maskUrl: "",
          error: "failed to fetch the data",
          segments: []
        })
        setGeneratingImages(panel, false)
        return
      }
    })
  }, 1000 * panel)
  }, [prompt, width, height])


  const checkStatus = () => {
    startTransition(async () => {
      clearTimeout(timeoutRef.current)

      if (!renderedRef.current?.renderId || renderedRef.current?.status !== "pending") {
        timeoutRef.current = setTimeout(checkStatus, 1500)
        return
      }
      try {
        setGeneratingImages(panel, true)
        // console.log(`Checking job status API for job ${renderedRef.current?.renderId}`)
        const newRendered = await getRender(renderedRef.current.renderId)
        // console.log("got a response!", newRendered)

        if (JSON.stringify(renderedRef.current) !== JSON.stringify(newRendered)) {
          console.log("updated panel:", newRendered)
          setRendered(renderedRef.current = newRendered)
          setGeneratingImages(panel, true)
        }
        // console.log("status:", newRendered.status)

        if (newRendered.status === "pending") {
          // console.log("job not finished")
          timeoutRef.current = setTimeout(checkStatus, 1500)
        } else {
          console.log("panel finished!")
          setGeneratingImages(panel, false)
        }
      } catch (err) {
        console.error(err)
        timeoutRef.current = setTimeout(checkStatus, 1500)
      }
    })
  }
 
  useEffect(() => {
    // console.log("starting timeout")
    clearTimeout(timeoutRef.current)
    
    // normally it should reply in < 1sec, but we could also use an interval
    timeoutRef.current = setTimeout(checkStatus, delay)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [prompt, width, height])

  /*
  doing the captionning from the browser is expensive
  a simpler solution is to caption directly during SDXL generation

  useEffect(() => {
    if (!rendered.assetUrl) { return }
    // the asset url can evolve with time (link to a better resolution image)
    // however it would be costly to ask for the caption, the low resolution is enough for the semantic resolution
    // so we just do nothing if we already have the caption
    if (caption) { return }
    startTransition(async () => {
      try {
        const newCaption = await see({
          prompt: "please caption the following image",
          imageBase64: rendered.assetUrl 
        })
        if (newCaption) {
          setCaption(newCaption)
        }
      } catch (err) {
        console.error(`failed to generate the caption:`, err)
      }
    })
  }, [rendered.assetUrl, caption])
  */

  const frameClassName = cn(
    `w-full h-full`,
    `border-stone-800`,
    `transition-all duration-200 ease-in-out`,
    zoomLevel > 140 ? `border-[2px] md:border-[4px] rounded-sm md:rounded-md` :
    zoomLevel > 120 ? `border-[1.5px] md:border-[3px] rounded-xs md:rounded-sm` :
    zoomLevel > 90 ? `border-[1px] md:border-[2px] rounded-xs md:rounded-sm` :
    zoomLevel > 40 ? `border-[0.5px] md:border-[1px] rounded-none md:rounded-xs` :
    `border-transparent md:border-[0.5px] rounded-none md:rounded-none`,
    `shadow-sm`,
    `overflow-hidden`,
    `print:border-[1.5px] print:shadow-none`,
  )

  const [newMask, setNewMask] = useState("")

  useEffect(() => {
    const transformMask = async () => {
      if (rendered.maskUrl) {
        const imgSrc = await writeIntoBubble(
          rendered.maskUrl,
          "LOREM IPSUM! Dolor sit amet.."
        )
        setNewMask(imgSrc)
      }
    }
    transformMask()
  }, [rendered.maskUrl])


  if (prompt && !rendered.assetUrl) {
    return (
      <div className={cn(
        frameClassName,
        `flex flex-col items-center justify-center`,
        className
      )}>
       <Progress isLoading />
      </div>
    )
  }

  return (
    <div className={cn(
      frameClassName,
      { "grayscale": preset.color === "grayscale" },
      className
    )}>
        {rendered.assetUrl && <img
          src={rendered.assetUrl}
          width={width}
          height={height}
          alt={rendered.alt}
          className="h-full max-w-fit"
        />}



      {/*<Bubble className="absolute top-4 left-4">
        Hello, world!
      </Bubble>
      */}
    </div>
  )
}