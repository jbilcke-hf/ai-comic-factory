"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { RxReload, RxPencil2 } from "react-icons/rx"

import { RenderedScene } from "@/types"

import { getRender, newRender } from "@/app/engine/render"
import { useStore } from "@/app/store"

import { cn } from "@/lib/utils"
import { getInitialRenderedScene } from "@/lib/getInitialRenderedScene"
import { Progress } from "@/app/interface/progress"
import { EditModal } from "../edit-modal"

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

  // console.log("debug:", { page, nbPanels, panel })
  // the panel Id must be unique across all pages
  const panelId = `${panelIndex}`

  // console.log("panelId: " + panelId)

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

  const zoomLevel = useStore(state => state.zoomLevel)
  const showCaptions = useStore(state => state.showCaptions)

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
 

  const delay = enableRateLimiter ? (1000 + (500 * panelIndex)) : 1000

  const startImageGeneration = ({ prompt, width, height, revision }: {
    prompt: string
    width: number
    height: number
    revision: number
  }) => {
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
        const nbMaxRevisions = 10
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

            // TODO: here we never reset the revision, so only the first user
            // comic will be cached (we should fix that later)
            withCache: revision === 0
          })
        } catch (err) {
          // "Failed to load the panel! Don't worry, we are retrying..")
          newRendered = await newRender({
            prompt: cacheInvalidationHack + "   " + prompt,
            width,
            height,
            withCache,
          })
        }

        if (newRendered) {
          setRendered(panelId, newRendered)

          if (newRendered.status === "completed") {
            setGeneratingImages(panelId, false)
            addToUpscaleQueue(panelId, newRendered)
          }

          // but we are still loading!
        } else {
          setRendered(panelId, {
            renderId: "",
            status: "pending",
            assetUrl: "",
            alt: "",
            maskUrl: "",
            error: "",
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
        const newRendered = await getRender(renderedRef.current.renderId)

        if (JSON.stringify(renderedRef.current) !== JSON.stringify(newRendered)) {
          setRendered(panelId, renderedRef.current = newRendered)
          setGeneratingImages(panelId, true)
        }

        if (newRendered.status === "pending") {
          timeoutRef.current = setTimeout(checkStatus, delay)
        } else if (newRendered.status === "error" || 
        (newRendered.status === "completed" && !newRendered.assetUrl?.length)) {
          try {
            const newAttempt = await newRender({
              prompt,
              width,
              height,
              withCache: false,
            })
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

    startImageGeneration({ prompt, width, height, revision })

    clearTimeout(timeoutRef.current)
    
    // normally it should reply in < 1sec, but we could also use an interval
    timeoutRef.current = setTimeout(checkStatus, delay)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [prompt, width, height, revision])

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

  return (
    <div className={cn(
      frameClassName,
      { "grayscale": preset.color === "grayscale" },
      className
    )}
    onMouseEnter={() => setMouseOver(true)}
    onMouseLeave={() => setMouseOver(false)}
    >
        <div className={cn(
        `bg-stone-50`,
        `border-stone-800`,
        `transition-all duration-200 ease-in-out`,
        zoomLevel > 140 ? `border-b-[2px] md:border-b-[4px]` :
        zoomLevel > 120 ? `border-b-[1.5px] md:border-b-[3px]` :
        zoomLevel > 90 ? `border-b-[1px] md:border-b-[2px]` :
        zoomLevel > 40 ? `border-b-[0.5px] md:border-b-[1px]` :
        `border-transparent md:border-b-[0.5px]`,
        `print:border-b-[1.5px]`,
        `truncate`,

        zoomLevel > 200 ? `p-4 md:p-8` :
        zoomLevel > 180 ? `p-[14px] md:p-8` :
        zoomLevel > 160 ? `p-[12px] md:p-[28px]` :
        zoomLevel > 140 ? `p-[10px] md:p-[26px]` :
        zoomLevel > 120 ? `p-2 md:p-6` :
        zoomLevel > 100 ? `p-1.5 md:p-[20px]` :
        zoomLevel > 90 ? `p-1.5 md:p-4` :
        zoomLevel > 40 ? `p-1 md:p-2` :
        `p-0.5 md:p-2`,

        zoomLevel > 220 ? `text-xl md:text-4xl` :
        zoomLevel > 200 ? `text-lg md:text-3xl` :
        zoomLevel > 180 ? `text-md md:text-2xl` :
        zoomLevel > 140 ? `text-2xs md:text-2xl` :
        zoomLevel > 120 ? `text-3xs md:text-xl` :
        zoomLevel > 100 ? `text-4xs md:text-lg` :
        zoomLevel > 90 ? `text-5xs md:text-sm` :
        zoomLevel > 40 ? `md:text-xs` : `md:text-2xs`,

        showCaptions ? (
          zoomLevel > 90 ? `block` : `hidden md:block`
        ) : `hidden`,
      )}
      >{caption || ""}
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
        {
          // there is an issue, this env check doesn't work..
        // process.env.NEXT_PUBLIC_CAN_REDRAW === "true" ?
         <div
        className={cn(`relative -mt-8 ml-2 md:-mt-12md:ml-3 lg:-mt-14 lg:ml-4`,)}>
          <div className="flex flex-row space-x-2">
            <div
              onClick={rendered.status === "completed" ? handleReload : undefined}
              className={cn(
                `bg-stone-100 rounded-lg`,
                `flex flex-row space-x-2 items-center`,
                `py-1 px-2 md:py-2 md:px-3 cursor-pointer`,
                `transition-all duration-200 ease-in-out`,
                rendered.status === "completed" ? "opacity-95" : "opacity-50",
                mouseOver && rendered.assetUrl ? `scale-95 hover:scale-100 hover:opacity-100`: `scale-0`
              )}>
              <RxReload
                className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
              />
              <span className="text-2xs md:text-xs lg:text-sm">Redraw</span>
            </div>
            <EditModal
              isEnabled={rendered.status === "completed"}
              existingPrompt={prompt}
              onSave={handleSavePrompt}
            >
              <div
                className={cn(
                  `bg-stone-100 rounded-lg`,
                  `flex flex-row space-x-2 items-center`,
                  `py-1 px-3 md:py-2 md:px-3 cursor-pointer`,
                  `transition-all duration-200 ease-in-out`,
                  rendered.status === "completed" ? "opacity-95" : "opacity-50",
                  mouseOver && rendered.assetUrl ? `scale-95 hover:scale-100 hover:opacity-100`: `scale-0`
                )}>
                <RxPencil2
                  className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                />
                <span className="text-2xs md:text-xs lg:text-sm">Edit</span>
              </div>
                        
            </EditModal>
          </div>
        </div> 
        //: null
      }
    </div>
  )
}