import { RenderedScene } from "@/types"

export function Display ({ rendered }: { rendered: RenderedScene }) {
  return (
    <>
      <img
        src={rendered.assetUrl || undefined}
        className="fixed w-screen top-0 left-0 right-0"
      />
    </>
  )
}