import { allLayouts } from "@/app/layouts"
import { useStore } from "@/app/store"
import { cn } from "@/lib/utils"

export function Page({ page }: { page: number }) {
  const zoomLevel = useStore(state => state.zoomLevel)
  const layouts = useStore(state => state.layouts)
  // const prompt = useStore(state => state.prompt)

  const LayoutElement = (allLayouts as any)[layouts[page]]

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

  return (
    <div
      className={cn(
        `w-full`,
        // we are trying to reach a "book" look
        // we are using aspect-[297/210] because it matches A4 (297mm x 210mm)
        // `aspect-[210/297]`,
        `aspect-[250/297]`,

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