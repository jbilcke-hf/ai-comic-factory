import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export function About() {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="hidden md:inline">About this project</span>
          <span className="inline md:hidden">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>The AI Comic Factory</DialogTitle>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            What is the AI Comic Factory?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-stone-800">
        <p className="">
           The AI Comic Factory is a free and open-source application made to demonstrate the capabilities of AI models.
         </p>
         <p>
         👉 The language model used to generate the descriptions of each panel is <a className="text-stone-600 underline" href="https://huggingface.co/blog/llama2" target="_blank">Llama-2 70b</a>.
         </p>
         <p>
         👉 The stable diffusion model used to generate the images is the base <a className="text-stone-600 underline" href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" target="_blank">SDXL 1.0</a>.
        </p>
        <p>
           The code is public and can be deployed at home with some changes in the code. See the <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/blob/main/README.md" target="_blank">README</a> for details about the architecture.
         </p>
         <p>
            Do you want to create high-res image exports? Please check <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/discussions/105#64f84d182f7d3d945cdde3d2" target="_blank">this tutorial</a>.
         </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}