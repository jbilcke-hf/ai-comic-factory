"use client"

import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { useStore } from "@/app/store"

export function Grid({ children, className }: { children: ReactNode; className: string }) {
  const zoomLevel = useStore(s => s.zoomLevel)

  return (
    <div
      // the "fixed" width ensure our comic keeps a consistent ratio
      className={cn(
        `w-full h-full grid`,
        className
      )}
      style={{
        gap: `${(zoomLevel / 100) * 0.7}vw`
      }}
      >
      {children}
    </div>
  )
}

