import { startTransition, useEffect, useState } from "react"
import { useFilePicker } from 'use-file-picker'

import { useStore } from "@/app/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { upscaleImage } from "@/app/engine/render"
import { sleep } from "@/lib/sleep"

import { Share } from "../share"
import { About } from "../about"
import { Discord } from "../discord"
import { SettingsDialog } from "../settings-dialog"
import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "../settings-dialog/localStorageKeys"
import { defaultSettings } from "../settings-dialog/defaultSettings"
import { getParam } from "@/lib/getParam"
import { Advert } from "../advert"


function BottomBar() {
  // deprecated, as HTML-to-bitmap didn't work that well for us
  // const page = useStore(s => s.page)
  // const download = useStore(s => s.download)
  // const pageToImage = useStore(s => s.pageToImage)

  const isGeneratingStory = useStore(s => s.isGeneratingStory)
  const prompt = useStore(s => s.prompt)
  const panelGenerationStatus = useStore(s => s.panelGenerationStatus)

  const preset = useStore(s => s.preset)
  
  const canSeeBetaFeatures = true // getParam<boolean>("beta", false)

  const allStatus = Object.values(panelGenerationStatus)
  const remainingImages = allStatus.reduce((acc, s) => (acc + (s ? 1 : 0)), 0)

  const currentClap = useStore(s => s.currentClap)
  
  const upscaleQueue = useStore(s => s.upscaleQueue)
  const renderedScenes = useStore(s => s.renderedScenes)
  const removeFromUpscaleQueue = useStore(s => s.removeFromUpscaleQueue)
  const setRendered = useStore(s => s.setRendered)
  const [isUpscaling, setUpscaling] = useState(false)

  const loadClap = useStore(s => s.loadClap)
  const downloadClap = useStore(s => s.downloadClap)

  const [hasGeneratedAtLeastOnce, setHasGeneratedAtLeastOnce] = useLocalStorage<boolean>(
    localStorageKeys.hasGeneratedAtLeastOnce,
    defaultSettings.hasGeneratedAtLeastOnce
  )

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
  const hasFinishedGeneratingImages = allStatus.length > 0 && (allStatus.length - remainingImages) === allStatus.length

  // keep track of the first generation, independently of the login status
  useEffect(() => {
    if (hasFinishedGeneratingImages && !hasGeneratedAtLeastOnce) {
      setHasGeneratedAtLeastOnce(true)
    }
  }, [hasFinishedGeneratingImages, hasGeneratedAtLeastOnce])

  const { openFilePicker, filesContent } = useFilePicker({
    accept: '.clap',
    readAs: "ArrayBuffer"
  })
  const fileData = filesContent[0]

  useEffect(() => {
    const fn = async () => {
      if (fileData?.name) {
        try {
          const blob = new Blob([fileData.content])
          await loadClap(blob)
        } catch (err) {
          console.error("failed to load the Clap file:", err)
        }
      }
    }
    fn()
  }, [fileData?.name])


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
        <Discord />
        <Advert />
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
      {/*<Button
        onClick={handleUpscale}
        disabled={!prompt?.length || remainingImages > 0 || isUpscaling || !Object.values(upscaleQueue).length}
      >
        {isUpscaling
            ? `${allStatus.length - Object.values(upscaleQueue).length}/${allStatus.length} ⌛`
            : "Upscale"}
        </Button>*/}

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
          {canSeeBetaFeatures ? <Button
            onClick={openFilePicker}
            disabled={remainingImages > 0}
          >Load</Button> : null}
          {canSeeBetaFeatures ? <Button
            onClick={downloadClap}
            disabled={remainingImages > 0}
          >
          {remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} ⌛` : `Save`}
        </Button> : null}
     
          <Button
            onClick={handlePrint}
            disabled={!prompt?.length}
          >
            <span className="hidden md:inline">{
            remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} panels ⌛` : `Get PDF`
            }</span>
            <span className="inline md:hidden">{
              remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} ⌛` : `PDF`
            }</span>
        </Button>
  
       <Share />
      </div>
    </div>
  )
}

export default BottomBar