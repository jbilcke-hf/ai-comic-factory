import { useStore } from "@/app/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { About } from "../about"
import { startTransition, useState } from "react"
import { upscaleImage } from "@/app/engine/render"
import { sleep } from "@/lib/sleep"
import { AIClipFactory } from "../ai-clip-factory"
import { Share } from "../share"
import { SettingsDialog } from "../settings-dialog"

export function BottomBar() {
  const download = useStore(state => state.download)
  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const prompt = useStore(state => state.prompt)
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)
  const page = useStore(state => state.page)
  const preset = useStore(state => state.preset)
  const pageToImage = useStore(state => state.pageToImage)

  const allStatus = Object.values(panelGenerationStatus)
  const remainingImages = allStatus.reduce((acc, s) => (acc + (s ? 1 : 0)), 0)

  const upscaleQueue = useStore(state => state.upscaleQueue)
  const renderedScenes = useStore(state => state.renderedScenes)
  const removeFromUpscaleQueue = useStore(state => state.removeFromUpscaleQueue)
  const setRendered = useStore(state => state.setRendered)
  const [isUpscaling, setUpscaling] = useState(false)

  const handleUpscale = () => {
    setUpscaling(true)
    startTransition(() => {
      const fn = async () => {
        for (let [panelId, renderedScene] of Object.entries(upscaleQueue)) {
          try {
            console.log(`upscaling panel ${panelId} (${renderedScene.renderId})`)
            const result = await upscaleImage(renderedScene.assetUrl)
            await sleep(1000)
            if (result.assetUrl) {
              console.log(`upscale successful, removing ${panelId} (${renderedScene.renderId}) from upscale queue`)
              setRendered(panelId, {
                ...renderedScene,
                assetUrl: result.assetUrl
              })
              removeFromUpscaleQueue(panelId)
            }

          } catch (err) {
            console.error(`failed to upscale: ${err}`)
          }
        }
        
        setUpscaling(false)
      }

      fn()
    })
  }

  const handlePrint = () => {
    window.print()
  }
  
  return (
    <div className={cn(
      `print:hidden`,
      `fixed bottom-2 md:bottom-4 left-2 right-0 md:left-3 md:right-1`,
      `flex flex-row`,
      `justify-between`,
      `pointer-events-none`
    )}>
      <div className={cn(
        `flex flex-row`,
        `items-end`,
        `pointer-events-auto`,
        `animation-all duration-300 ease-in-out`,
        isGeneratingStory ? `scale-0 opacity-0` : ``,
        `space-x-3`,
        `scale-[0.9]`
      )}>
        <About />
        <AIClipFactory />
      </div>
      <div className={cn(
      `flex flex-row`,
      `pointer-events-auto`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
      `space-x-3`,
      `scale-[0.9]`
    )}>
      <SettingsDialog />
      <Button
        onClick={handleUpscale}
        disabled={!prompt?.length || remainingImages > 0 || isUpscaling || !Object.values(upscaleQueue).length}
      >
        {isUpscaling
            ? `${allStatus.length - Object.values(upscaleQueue).length}/${allStatus.length} ⌛`
            : "Upscale"}
      </Button>

        {/*
        <div>
          <Button
            onClick={handlePrint}
            disabled={!prompt?.length}
          >
            Print
          </Button>
        </div>
        <div>
          <Button
            onClick={download}
            disabled={!prompt?.length}
          >
            <span className="hidden md:inline">{
            remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} panels ⌛` : `Save`
            }</span>
            <span className="inline md:hidden">{
              remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} ⌛` : `Save`
            }</span>
           </Button>
        </div>
          */}
          <Button
            onClick={handlePrint}
            disabled={!prompt?.length}
          >
            <span className="hidden md:inline">{
            remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} panels ⌛` : `Save PDF`
            }</span>
            <span className="inline md:hidden">{
              remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} ⌛` : `Save`
            }</span>
        </Button>
        <Share />
      </div>
    </div>
  )
}