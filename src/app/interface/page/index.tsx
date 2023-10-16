import { allLayoutAspectRatios, allLayouts } from "@/app/layouts"
import { useStore } from "@/app/store"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

export function Page({ page }: { page: number }) {
  const zoomLevel = useStore(state => state.zoomLevel)
  const layouts = useStore(state => state.layouts)
  // const prompt = useStore(state => state.prompt)

  const LayoutElement = (allLayouts as any)[layouts[page]]
  const aspectRatio = ((allLayoutAspectRatios as any)[layouts[page]] as string) || "aspect-[250/297]"
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
  
  return (
    <div
      ref={pageRef}
      className={cn(
        `w-full`,
        aspectRatio,
        `transition-all duration-100 ease-in-out`,
        `border border-stone-200`,
        `shadow-2xl`,
        `print:shadow-none`,
        `print:border-0`,
        `print:width-screen`
      )}
      style={{
        padding: `${Math.round((zoomLevel / 100) * 16)}px`
        // marginLeft: `${zoomLevel > 100 ? `100`}`
      }}
      >
      <LayoutElement />
    </div>
  )
}