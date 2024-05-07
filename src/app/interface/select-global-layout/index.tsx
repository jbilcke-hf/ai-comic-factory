"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { useStore } from "@/app/store"
import { LayoutName, defaultLayout, nonRandomLayouts } from "@/app/layouts"
import { useIsBusy } from "@/lib/useIsBusy"

import { SelectLayout } from "../select-layout"

export function SelectGlobalLayout() {
  const searchParams = useSearchParams()

  const requestedLayout = (searchParams?.get('layout') as LayoutName) || defaultLayout

  const layout = useStore(s => s.layout)
  const setLayout = useStore(s => s.setLayout)

  const isBusy = useIsBusy()

  const [draftLayout, setDraftLayout] = useState<LayoutName>(requestedLayout)
  
  useEffect(() => {
    const layoutChanged = draftLayout !== layout
    if (layoutChanged && !isBusy) {
      setLayout(draftLayout)
    }
  }, [layout, draftLayout, isBusy])
    
  return (
    <SelectLayout
      defaultValue={defaultLayout}
      onLayoutChange={setDraftLayout}
      disabled={isBusy}
      layouts={nonRandomLayouts}
    />
  )
}