import { Button } from "@/components/ui/button"

export function AIClipFactory() {
  return (
    <Button
      variant="outline"
      className="bg-yellow-300"
      onClick={() => {
        window.open("https://huggingface.co/spaces/jbilcke-hf/ai-clip-factory", "_blank")
      }}>
      <span className="hidden md:inline">Try the clip factory!</span>
      <span className="inline md:hidden">AI Clips</span>
    </Button>
  )
}