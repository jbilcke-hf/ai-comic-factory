"use client"

import { ReactNode, useRef } from "react"

// import Draggable from "react-draggable"
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"

import { useStore } from "@/app/store"
import { cn } from "@/lib/utils"

export function Bubble({ children, onChange }: {
  children: ReactNode;
  onChange: (newCaption: string) => void
}) {
   
  const ref = useRef<HTMLDivElement>(null)
  const zoomLevel = useStore(s => s.zoomLevel)
  const showCaptions = useStore(s => s.showCaptions)

  const text = useRef(`${children || ''}`)

  const handleChange = (evt: ContentEditableEvent) => {
    // hmm no, this returns us some rich HTML - but it's too early for that
    // text.current = evt.target.value

    text.current = `${ref.current?.innerText || ''}`
  };

  const handleBlur = () => {
    onChange(text.current)
  };

  // we can wrap this bubble in a <Draggable>
  // but the zoom will break it, so we will need to figure out something
  return (
    <div className={cn(
      `bottom-0`,
      // `cursor-grab`,
      `absolute flex w-full items-center justify-center`,
      zoomLevel > 200 ? `p-4 md:p-8` :
      zoomLevel > 180 ? `p-[14px] md:p-8` :
      zoomLevel > 160 ? `p-[12px] md:p-[28px]` :
      zoomLevel > 140 ? `p-[10px] md:p-[26px]` :
      zoomLevel > 120 ? `p-2 md:p-6` :
      zoomLevel > 100 ? `p-1.5 md:p-[20px]` :
      zoomLevel > 90 ? `p-1.5 md:p-4` :
      zoomLevel > 40 ? `p-1 md:p-2` :
      `p-0.5 md:p-2`,
      `print:p-2`
    )}>
      <div
        ref={ref}
        className={cn(
        `bg-stone-50`,
        `border-stone-800`,
        `transition-all duration-200 ease-in-out`,
        zoomLevel > 140 ? `border-[1.5px] md:border-[2px]` :
        zoomLevel > 120 ? `border-[1px] md:border-[1.5px]` :
        zoomLevel > 90 ? `border-[0.5px] md:border-[1px]` :
        zoomLevel > 40 ? `border-transparent md:border-[0.5px]` :
        `border-transparent md:border-transparent`,
        `print:border-[1px]`,

        zoomLevel > 200 ? `p-4 md:p-8` :
        zoomLevel > 180 ? `p-[14px] md:p-6` :
        zoomLevel > 160 ? `p-3 md:p-5` :
        zoomLevel > 140 ? `p-[10px] md:p-4` :
        zoomLevel > 120 ? `p-2 md:p-3` :
        zoomLevel > 100 ? `p-1.5 md:p-2` :
        zoomLevel > 90 ? `p-1 md:p-1` :
        zoomLevel > 40 ? `p-0.5 md:p-0.5` :
        `p-0.5 md:p-0.5`,
        `print:p-1.5`,

        zoomLevel > 220 ? `text-base md:text-lg` :
        zoomLevel > 200 ? `text-sm md:text-md` :
        zoomLevel > 180 ? `text-xs md:text-base` :
        zoomLevel > 140 ? `text-2xs md:text-sm` :
        zoomLevel > 120 ? `text-3xs md:text-xs` :
        zoomLevel > 100 ? `text-4xs md:text-2xs` :
        zoomLevel > 90 ? `text-5xs md:text-3xs` :
        zoomLevel > 40 ? `text-6xs md:text-4xs`
        : `text-7xs md:text-5xs`,
        `print:text-4xs`,

        zoomLevel > 140 ? `rounded-xl md:rounded-2xl` :
        zoomLevel > 120 ? `rounded-lg md:rounded-xl` :
        zoomLevel > 90 ? `rounded-md md:rounded-lg` :
        zoomLevel > 40 ? `rounded-sm md:rounded-md` :
        `rounded-sm md:rounded-sm`,
        `print:rounded-xl`,

        showCaptions ? (
          zoomLevel > 90 ? `block` : `hidden md:block`
        ) : `hidden`,

        `text-center`
      )}>
        <ContentEditable
          html={text.current}
          className="line-clamp-3"
          onBlur={handleBlur}
          onChange={handleChange} 
        />
      </div>
    </div>
  )
}