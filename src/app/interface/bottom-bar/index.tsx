import { useStore } from "@/app/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomBar() {
  const download = useStore(state => state.download)
  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const prompt = useStore(state => state.prompt)
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)

  const remainingImages = Object.values(panelGenerationStatus).reduce((acc, s) => (acc + (s ? 1 : 0)), 0)
    
  return (
    <div className={cn(
      `fixed bottom-8 right-8`,
      `flex flex-row`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
    )}>
      <div>
        <Button onClick={download} disabled={!prompt?.length}>{
          remainingImages ? `${remainingImages} remaining..` : `Download`
        }</Button>
      </div>
    </div>
  )
}