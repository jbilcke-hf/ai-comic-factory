"use client"

import { useEffect, useRef } from "react"

import { allLayoutAspectRatios, allLayouts } from "@/app/layouts"
import { useStore } from "@/app/store"
import { cn } from "@/lib/utils"

export function Page({ page }: { page: number}) {
  const zoomLevel = useStore(state => state.zoomLevel)
  const layouts = useStore(state => state.layouts)

  const layout = layouts[page]

  const LayoutElement = (allLayouts as any)[layout]
  const aspectRatio = ((allLayoutAspectRatios as any)[layout] as string) || "aspect-[250/297]"

  const currentNbPages = useStore(s => s.currentNbPages)
  const maxNbPages = useStore(s => s.maxNbPages)
  const currentNbPanelsPerPage = useStore(s => s.currentNbPanelsPerPage)

  // in the future, different layouts might have different numbers of panels
  const allLayoutsNbPanels = {
    Layout0: currentNbPanelsPerPage,
    Layout1: currentNbPanelsPerPage,
    Layout2: currentNbPanelsPerPage,
    Layout3: currentNbPanelsPerPage,
    // Layout4: currentNbPanelsPerPage
  }

  const currentNbPanels = ((allLayoutsNbPanels as any)[layout] as number) || currentNbPanelsPerPage

  /*
  const [canLoad, setCanLoad] = useState(false)
  useEffect(() => {
    if (prompt?.length) {
      setCanLoad(false)
      setTimeout(() => {
        setCanLoad(true)
      }, page * 4000)
    }
  }, [prompt])
  */

  const setPage = useStore(state => state.setPage)
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = pageRef.current
    if (!element) { return }
    setPage(element)
  }, [pageRef.current])
  
  /*
  console.log("PAGE DEBUG:", {
    currentNbPages,
    maxNbPages,
    "currentNbPages < maxNbPages": currentNbPages < maxNbPages,
  })
  */
 
  return (
    <div
      ref={pageRef}
      className={cn(
        `w-full`,
        `print:w-screen`,
        `print:break-after-all`
      )}
      style={{
        padding: `${Math.round((zoomLevel / 100) * 16)}px`
        // marginLeft: `${zoomLevel > 100 ? `100`}`
      }}
      >
      <div
      className={cn(
        aspectRatio,
        `transition-all duration-100 ease-in-out`,
        `border border-stone-200`,
        `shadow-2xl`,
        `print:shadow-none`,
        `print:border-0`,
      )}
      style={{
        padding: `${Math.round((zoomLevel / 100) * 16)}px`
        // marginLeft: `${zoomLevel > 100 ? `100`}`
      }}
      >
       <LayoutElement page={page} nbPanels={currentNbPanels} />
      </div>
      {currentNbPages > 1 &&
        <p className="w-full text-center pt-4 font-sans text-2xs font-semibold text-stone-600">
          Page {page + 1}
          {/*
          alternative style:
          Page {page + 1} / {nbPages}
          */}
        </p>}
    </div>
  )
}