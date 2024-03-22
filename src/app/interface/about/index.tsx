import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Login } from "../login"

export function About() {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span className="hidden md:inline">AI-Comic-Factory 1.0</span>
          <span className="inline md:hidden">Version 1.0</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Comic Factory 1.0</DialogTitle>
          <DialogDescription className="w-full text-center text-2xl font-bold text-stone-700">
            AI Comic Factory 1.0 (March 2024 Update)
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-stone-700 text-sm md:text-base xl:text-lg">
          <p className="">
            The AI Comic Factory generates stories using AI in a few clicks.
          </p>
          <p>
            App is free for Hugging Face users 👉 <Login />
         </p>
         <p className="pt-2 pb-2">
           Are you an artist? Learn <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/discussions/402#654ab848fa25dfb780aa19fb" target="_blank">how to use your own art style</a>
         </p>
         <p>
         👉 Default AI model used for stories is <a className="text-stone-600 underline" href="https://huggingface.co/HuggingFaceH4/zephyr-7b-beta" target="_blank">Zephyr-7b-beta</a>
         </p>
         <p>
         👉 Default AI model used for drawing is <a className="text-stone-600 underline" href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" target="_blank">SDXL</a> by Stability AI
        </p>
        <p className="pt-2 pb-2">
           This is an open-source project, see the <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/blob/main/README.md" target="_blank">README</a> for more info.
         </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}