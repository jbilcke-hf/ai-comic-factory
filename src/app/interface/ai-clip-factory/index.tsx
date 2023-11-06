import { Button } from "@/components/ui/button"

export function AIClipFactory() {
  return (
    <Button
      variant="outline"
      className="bg-yellow-300"
      onClick={() => {
        window.open("https://huggingface.co/spaces/jbilcke-hf/ai-clip-factory?postId=f63df23d-de2f-4dee-961c-a56f160dd159&prompt=pikachu%2C+working+on+a+computer%2C+office%2C+serious%2C+typing%2C+keyboard&model=TheLastBen%2FPikachu_SDXL", "_blank")
      }}>
      <span className="hidden md:inline">Try the clip factory!</span>
      <span className="inline md:hidden">Clips</span>
    </Button>
  )
}