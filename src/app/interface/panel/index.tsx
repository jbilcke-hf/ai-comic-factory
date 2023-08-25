"use client"

import { useEffect, useRef, useState, useTransition } from "react"

import { Preset } from "@/app/engine/presets"

import { RenderedScene } from "@/types"
import { cn } from "@/lib/utils"
import { FontName } from "@/lib/fonts"
import { getRender, newRender } from "../../engine/render"
import { getInitialRenderedScene } from "@/lib/getInitialRenderedScene"
// import { Bubble } from "./bubble"

export default function Panel({
  prompt = "",
  font,
  preset,
  className = "",
  width = 1,
  height = 1,
  delay = 0,
}: {
  prompt?: string
  font: FontName
  preset: Preset
  className?: string
  width?: number
  height?: number
  delay?: number
 }) {

  const [_isPending, startTransition] = useTransition()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [rendered, setRendered] = useState<RenderedScene>(getInitialRenderedScene())
  const renderedRef = useRef<RenderedScene>()

  const timeoutRef = useRef<any>(null)

  // since this run in its own loop, we need to use references everywhere
  // but perhaps this could be refactored
  useEffect(() => {
    startTransition(async () => {
      // console.log("Panel prompt: "+ prompt)
      if (!prompt?.length) { return }

      console.log("Loading panel..")
      setLoading(true)

      // console.log("calling:\nconst newRendered = await newRender({ prompt, preset, width, height })")
      console.log({
        prompt, preset, width, height
      })

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

        setLoading(false)
        return
      }
    })
  }, [prompt, font, preset])


  const checkStatus = () => {
    startTransition(async () => {
      clearTimeout(timeoutRef.current)

      if (!renderedRef.current?.renderId || renderedRef.current?.status !== "pending") {
        timeoutRef.current = setTimeout(checkStatus, 1000)
        return
      }
      try {
        // console.log(`Checking job status API for job ${renderedRef.current?.renderId}`)
        const newRendered = await getRender(renderedRef.current.renderId)
        // console.log("got a response!", newRendered)

        if (JSON.stringify(renderedRef.current) !== JSON.stringify(newRendered)) {
          console.log("updated panel:", newRendered)
          setRendered(renderedRef.current = newRendered)
          setLoading(true)
        }
        // console.log("status:", newRendered.status)

        if (newRendered.status === "pending") {
          // console.log("job not finished")
          timeoutRef.current = setTimeout(checkStatus, 1000)
        } else {
          console.log("panel finished!")
          setLoading(false)
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

  return (
    <div className={cn(
      `w-full h-full`,
      preset.color === "grayscale" ? "grayscale" : "",
      className
    )}>
      {rendered.assetUrl ? <img
        src={rendered.assetUrl}
        className="w-full h-full object-cover"
      /> : null}

      {/*<Bubble className="absolute top-4 left-4">
        Hello, world!
      </Bubble>
      */}
    </div>
  )
}