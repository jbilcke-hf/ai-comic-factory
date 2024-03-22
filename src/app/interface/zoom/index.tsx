import { useStore } from "@/app/store"
import { VerticalSlider } from "@/components/ui/vertical-slider"
import { cn } from "@/lib/utils"

export function Zoom() {
  const zoomLevel = useStore((state) => state.zoomLevel)
  const setZoomLevel = useStore((state) => state.setZoomLevel)
  const isGeneratingStory = useStore((state) => state.isGeneratingStory)

  return (
    <div className={cn(
      `print:hidden`,
      // `fixed flex items-center justify-center bottom-8 top-32 right-8 z-10 h-screen`,
      `fixed flex flex-col items-center bottom-8 top-40 right-2 md:top-28 md:right-6 z-10`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
    )}>
      <div className="font-bold text-xs pb-2 text-stone-600 bg-stone-50 dark:text-stone-600 dark:bg-stone-50 p-1 rounded-sm">
        Zoom
      </div>
      <div className="w-2">
        <VerticalSlider
          defaultValue={[zoomLevel]}
          min={30}
          max={250}
          step={1}
          onValueChange={value => setZoomLevel(value[0] || 10)}
          value={[zoomLevel]}
          className="h-64 md:h-80"
          orientation="vertical"
        />
      </div>
    </div>
  )
}