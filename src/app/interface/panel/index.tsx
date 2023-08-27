"use client"

import { useEffect, useRef, useState, useTransition } from "react"
// import AutoSizer from "react-virtualized-auto-sizer"

import { RenderedScene } from "@/types"

import { getRender, newRender } from "@/app/engine/render"
import { useStore } from "@/app/store"

import { cn } from "@/lib/utils"
import { getInitialRenderedScene } from "@/lib/getInitialRenderedScene"
import { Progress } from "@/app/interface/progress"
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
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)
  const isLoading = panelGenerationStatus[panel] || false
  const panels = useStore(state => state.panels)
  const prompt = panels[panel] || ""

  const [_isPending, startTransition] = useTransition()
  const [rendered, setRendered] = useState<RenderedScene>(getInitialRenderedScene())
  const renderedRef = useRef<RenderedScene>()

  const timeoutRef = useRef<any>(null)

  // since this run in its own loop, we need to use references everywhere
  // but perhaps this could be refactored
  useEffect(() => {
    startTransition(async () => {
      // console.log("Panel prompt: "+ prompt)
      if (!prompt?.length) { return }
      if (isLoading) { return }

      console.log("Loading panel..")

      // console.log("calling:\nconst newRendered = await newRender({ prompt, preset, width, height })")
      console.log({
        panel, prompt, width, height
      })

      console.log("")
      // important: update the status, and clear the scene
      setGeneratingImages(panel, true)
      setRendered(getInitialRenderedScene())

      const newRendered = await newRender({ prompt, width, height })

      if (newRendered) {
        // console.log("newRendered:", newRendered)
        setRendered(renderedRef.current = newRendered)

        // but we are still loading!
      } else {
        setRendered(renderedRef.current = {
          renderId: "",
          status: "error",
          assetUrl: "",
          maskUrl: "",
          error: "failed to fetch the data",
          segments: []
        })
        setGeneratingImages(panel, false)
        return
      }
    })
  }, [prompt, font, width, height])


  const checkStatus = () => {
    startTransition(async () => {
      clearTimeout(timeoutRef.current)

      if (!renderedRef.current?.renderId || renderedRef.current?.status !== "pending") {
        timeoutRef.current = setTimeout(checkStatus, 1000)
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
          timeoutRef.current = setTimeout(checkStatus, 1000)
        } else {
          console.log("panel finished!")
          setGeneratingImages(panel, false)
        }
      } catch (err) {
        console.error(err)
        timeoutRef.current = setTimeout(checkStatus, 1000)
      }
    })
  }
 
  useEffect(() => {
    console.log("starting timeout")
    // normally it should reply in < 1sec, but we could also use an interval
    timeoutRef.current = setTimeout(checkStatus, delay)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className={cn(
        `w-full h-full flex flex-col items-center justify-center`,
        className
      )}>
       <Progress isLoading />
      </div>
    )
  }

  return (
    <div className={cn(
      `w-full h-full`,
      { "grayscale": preset.color === "grayscale" },
      className
    )}>
      {rendered.assetUrl && <img
        src={rendered.assetUrl}
        className="w-full h-full object-cover"
      />}

      {/*<Bubble className="absolute top-4 left-4">
        Hello, world!
      </Bubble>
      */}
    </div>
  )
}