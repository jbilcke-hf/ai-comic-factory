"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { RxReload, RxPencil2 } from "react-icons/rx"

import { RenderedScene, RenderingModelVendor } from "@/types"

import { getRender, newRender } from "@/app/engine/render"
import { useStore } from "@/app/store"

import { cn } from "@/lib/utils"
import { getInitialRenderedScene } from "@/lib/getInitialRenderedScene"
import { Progress } from "@/app/interface/progress"
import { EditModal } from "../edit-modal"
import { Bubble } from "./bubble"
import { getSettings } from "../settings-dialog/getSettings"
import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "../settings-dialog/localStorageKeys"
import { defaultSettings } from "../settings-dialog/defaultSettings"

export function Panel({
  page,
  nbPanels,
  panel,
  className = "",
  width = 1,
  height = 1,
}: {
  // page number of which the panel is
  page: number

  // the number of panels should be unique to each layout
  nbPanels: number

  // panel id, between 0 and (nbPanels - 1)
  panel: number


  className?: string
  width?: number
  height?: number
 }) {

  // index of the panel in the whole app
  const panelIndex = page * nbPanels + panel


  // the panel Id must be unique across all pages
  const panelId = `${panelIndex}`

  // console.log(`panel/index.tsx: <Panel panelId=${panelId}> rendered again!`)


  const [mouseOver, setMouseOver] = useState(false)
  const ref = useRef<HTMLImageElement>(null)
  const font = useStore(state => state.font)
  const preset = useStore(state => state.preset)

  const setGeneratingImages = useStore(state => state.setGeneratingImages)

  const panels = useStore(state => state.panels)
  const prompt = panels[panelIndex] || ""

  const setPanelPrompt = useStore(state => state.setPanelPrompt)

  const captions = useStore(state => state.captions)
  const caption = captions[panelIndex] || ""
  const setPanelCaption = useStore(state => state.setPanelCaption)
  
  const zoomLevel = useStore(state => state.zoomLevel)

  const addToUpscaleQueue = useStore(state => state.addToUpscaleQueue)

  const [_isPending, startTransition] = useTransition()
  const renderedScenes = useStore(state => state.renderedScenes)
  const setRendered = useStore(state => state.setRendered)

  const rendered = renderedScenes[panelIndex] || getInitialRenderedScene()

  const [revision, setRevision] = useState(0)

  // keep a ref in sync
  const renderedRef = useRef<RenderedScene>()
  const renderedKey = JSON.stringify(rendered)
  useEffect(() => { renderedRef.current = rendered }, [renderedKey])

  const timeoutRef = useRef<any>(null)

  const enableRateLimiter = `${process.env.NEXT_PUBLIC_ENABLE_RATE_LIMITER}`  === "true"

  const [renderingModelVendor, _setRenderingModelVendor] = useLocalStorage<RenderingModelVendor>(
    localStorageKeys.renderingModelVendor,
    defaultSettings.renderingModelVendor
  )
  
  let delay = enableRateLimiter ? (1000 + (500 * panelIndex)) : 1000

  /*
  console.log("panel/index.tsx: DEBUG: " + JSON.stringify({
    page,
    nbPanels,
    panel,
    panelIndex,
    panelId,
    revision,
    renderedScenes: Object.keys(renderedScenes),
  }, null, 2))
  */

  // Let's be gentle with Replicate or else they will believe they are under attack
  if (renderingModelVendor === "REPLICATE") {
    delay += 8000
  }

  // nbFrames == 1 -> image
  // nbFrames >= 2 -> video
  // for AnimateLCM (the current supported engine)
  // the value is between 12 and 20, default is 16
  // This is not the ideal wait to configure this,
  // but the AI Comic Factory is a just a prototype, so it will do
  
  const nbFrames = preset.id.startsWith("video")
    ? 16
    : 1

  const startImageGeneration = ({ prompt, width, height, nbFrames, revision }: {
    prompt: string
    width: number
    height: number
    nbFrames: number
    revision: number
  }) => {
    console.log(`panel/index.tsx: startImageGeneration(${JSON.stringify({ prompt, width, height, nbFrames, revision }, null, 2)})`)
    if (!prompt?.length) { return }

    // important: update the status, and clear the scene
    setGeneratingImages(panelId, true)

    // just to empty it
    setRendered(panelId, getInitialRenderedScene())

    setTimeout(() => {
      startTransition(async () => {

        const withCache = revision === 0

        // atrocious and very, very, very, very, very, very, very ugly hack for the Inference API
        // as apparently "use_cache: false" doesn't work, or doesn't do what we want it to do
        let cacheInvalidationHack = ""
        const nbMaxRevisions = 20
        for (let i = 0; i < revision && revision < nbMaxRevisions; i++) {
          const j =  Math.random() 
          cacheInvalidationHack += j < 0.3 ? "_" : j < 0.6 ? "," : "-"
        }

        let newRendered: RenderedScene
        try {
  
          newRendered = await newRender({
            prompt: cacheInvalidationHack + " " + prompt,
            width,
            height,
            nbFrames,

            // TODO: here we never reset the revision, so only the first user
            // comic will be cached (we should fix that later)
            withCache: revision === 0,
            settings: getSettings(),
          })
          if (!newRendered.status || newRendered.status === "error") {
            throw new Error("invalid status")
          }
        } catch (err) {
          // "Failed to load the panel! Don't worry, we are retrying..")

          try {
            newRendered = await newRender({
              prompt: cacheInvalidationHack + "   " + prompt,
              width,
              height,
              nbFrames,
              withCache,
              settings: getSettings(),
            })
            if (!newRendered.status || newRendered.status === "error") {
              throw new Error("invalid status")
            }
          } catch (err2) {
            newRendered = {
              renderId: "",
              status: "error",
              assetUrl: "",
              alt: "",
              maskUrl: "",
              error: `${err2 || "unknown error"}`,
              segments: []
            }
          }
        }

        if (newRendered) {
          setRendered(panelId, newRendered)

          if (newRendered.status === "completed") {
            setGeneratingImages(panelId, false)
            addToUpscaleQueue(panelId, newRendered)
          } else if (!newRendered.status || newRendered.status === "error") {
            setGeneratingImages(panelId, false)
          } else {
            // still loading
          }


        } else {
          // 
          setRendered(panelId, {
            renderId: "",
            status: "error",
            assetUrl: "",
            alt: "",
            maskUrl: "",
            error: "empty newRendered",
            segments: []
          })
          setGeneratingImages(panelId, false)
          return
        }
      })
    }, enableRateLimiter ? 1000 * panel : 0)
  }


  const checkStatus = () => {
    startTransition(async () => {
      clearTimeout(timeoutRef.current)

      if (!renderedRef.current?.renderId || renderedRef.current?.status !== "pending") {
        timeoutRef.current = setTimeout(checkStatus, delay)
        return
      }

      try {
        setGeneratingImages(panelId, true)
        const newRendered = await getRender(renderedRef.current.renderId, getSettings())

        if (JSON.stringify(renderedRef.current) !== JSON.stringify(newRendered)) {
          setRendered(panelId, renderedRef.current = newRendered)
          setGeneratingImages(panelId, true)
        }

        if (newRendered.status === "pending") {
          timeoutRef.current = setTimeout(checkStatus, delay)
        } else if (!newRendered.status || newRendered.status === "error" || 
        (newRendered.status === "completed" && !newRendered.assetUrl?.length)) {
          try {
            // we try only once
            const newAttempt = await newRender({
              prompt,
              width,
              height,
              nbFrames,
              withCache: false,
              settings: getSettings(),
            })
            if (!newAttempt.status || newAttempt.status === "error") {
              throw new Error("invalid status")
            }
            setRendered(panelId, newAttempt)
          } catch (err) {
            console.error("yeah sorry, something is wrong.. aborting", err)
            setGeneratingImages(panelId, false)
          }
        } else {
          console.log("panel finished!")
          setGeneratingImages(panelId, false)
          addToUpscaleQueue(panelId, newRendered)
  
        }
      } catch (err) {
        console.error(err)
        timeoutRef.current = setTimeout(checkStatus, delay)
      }
    })
  }

  useEffect(() => {
    if (!prompt.length) { return }

    startImageGeneration({ prompt, width, height, nbFrames, revision })

    clearTimeout(timeoutRef.current)
    
    // normally it should reply in < 1sec, but we could also use an interval
    timeoutRef.current = setTimeout(checkStatus, delay)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [prompt, width, height, nbFrames, revision])

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
    //`flex`,
    `relative`,
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

  const handleReload = () => {
    console.log(`Asked to reload panel ${panelId}`)
    setRevision(revision + 1)
  }


  const handleSavePrompt = (newPrompt: string) => {
    console.log(`Asked to save a new prompt: ${newPrompt}`)
    setPanelPrompt(newPrompt, panelIndex)
  }

  const handleSaveCaption = (newCaption: string) => {
    console.log(`Asked to save a new caption: ${newCaption}`)
    setPanelCaption(newCaption, panelIndex)
  }
  if (prompt && !rendered.assetUrl) {
    return (
      <div className={cn(
        frameClassName,
        `flex flex-col items-center justify-center`,
        className,
      )}>
       <Progress isLoading />
      </div>
    )
  }

  const hasSucceededOrFailed =
    rendered.status === "completed" ||
    rendered.status === "error"

  return (
    <div className={cn(
      frameClassName,
      { "grayscale": preset.color === "grayscale" },
      className
    )}
    onMouseEnter={() => setMouseOver(true)}
    onMouseLeave={() => setMouseOver(false)}
    >
      {(prompt && rendered.assetUrl && caption)
        ? <Bubble onChange={handleSaveCaption}>{caption}</Bubble>
        : null}
      <div
          className={cn(
            `absolute`,
            `top-0 w-full`,
            `flex justify-between`,
            `p-2 space-x-2`,
            `print:hidden`
            )}>
            <div
              onClick={
                hasSucceededOrFailed
                ? handleReload
                : undefined}
              className={cn(
                `bg-stone-100 rounded-lg`,
                `flex flex-row space-x-2 items-center`,
                `py-1 px-2 md:py-2 md:px-3`,
                `transition-all duration-200 ease-in-out`,
                hasSucceededOrFailed
                ?  "opacity-95 cursor-pointer"
                : "opacity-50 cursor-wait",
                mouseOver && (
                  hasSucceededOrFailed
                ) ? `scale-95 hover:scale-100 hover:opacity-100`: `scale-0`
              )}>
              <RxReload
                className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
              />
              <span className={cn(
                zoomLevel > 80
                ? `text-xs md:text-sm lg:text-base` :
                zoomLevel > 40
                ? `text-2xs md:text-xs lg:text-sm` :
                  `text-3xs md:text-2xs lg:text-xs`
              )}>Redraw</span>
            </div>
            <EditModal
              isEnabled={hasSucceededOrFailed}
              existingPrompt={prompt}
              onSave={handleSavePrompt}
            >
              <div
                className={cn(
                  `bg-stone-100 rounded-lg`,
                  `flex flex-row space-x-2 items-center`,
                  `py-1 px-3 md:py-2 md:px-3 cursor-pointer`,
                  `transition-all duration-200 ease-in-out`,
                  hasSucceededOrFailed ? "opacity-95" : "opacity-50",
                  mouseOver && hasSucceededOrFailed ? `scale-95 hover:scale-100 hover:opacity-100`: `scale-0`
                )}>
                <RxPencil2
                  className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                />
                <span className={cn(
                  zoomLevel > 80
                  ? `text-xs md:text-sm lg:text-base` :
                  zoomLevel > 40
                  ? `text-2xs md:text-xs lg:text-sm` :
                    `text-3xs md:text-2xs lg:text-xs`
                  )}>Edit</span>
              </div>
                        
            </EditModal>
       </div>

      {rendered.assetUrl &&
        <img
          ref={ref}
          src={rendered.assetUrl}
          width={width}
          height={height}
          alt={rendered.alt}
          className={cn(
            `comic-panel w-full h-full object-cover max-w-max`,
            // showCaptions ? `-mt-11` : ''
            )}
        />}
    </div>
  )
}