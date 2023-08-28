import { useStore } from "@/app/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomBar() {
  // const download = useStore(state => state.download)
  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const prompt = useStore(state => state.prompt)
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)

  const allStatus = Object.values(panelGenerationStatus)
  const remainingImages = allStatus.reduce((acc, s) => (acc + (s ? 1 : 0)), 0)
    

  const handlePrint = () => {
    window.print()
  }
  return (
    <div className={cn(
      `print:hidden`,
      `fixed bottom-6 right-6`,
      `flex flex-row`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
    )}>
      <div>
        <Button
          onClick={handlePrint}
          disabled={!prompt?.length}
        >{
          remainingImages ? `Print (${allStatus.length - remainingImages}/4 in HD ⌛)` : `Print (in HD)`
        }</Button>
      </div>
    </div>
  )
}