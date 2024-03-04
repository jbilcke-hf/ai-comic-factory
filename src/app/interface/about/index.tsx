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
          <span className="hidden md:inline">About this project</span>
          <span className="inline md:hidden">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>The AI Comic Factory</DialogTitle>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            What is the AI Comic Factory?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-stone-800 text-sm">
        <p className="">
           The AI Comic Factory is an app to generate stories using AI in a few clicks.
        </p>
          <p>
            It is free for all Hugging Face users: <Login />
         </p>
         <p>
           As an artist, you can use your <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/discussions/402#654ab848fa25dfb780aa19fb" target="_blank">own art to generate comic panels.</a>
         </p>
         <p>
         👉 The language model used to generate the story is <a className="text-stone-600 underline" href="https://huggingface.co/HuggingFaceH4/zephyr-7b-beta" target="_blank">Zephyr-7b-beta</a>.
         </p>
         <p>
         👉 The diffusion model used by default is <a className="text-stone-600 underline" href="https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0" target="_blank">SDXL</a>.
        </p>
        <p>
           The code is public and can be deployed at home with some changes in the code. See the <a className="text-stone-600 underline" href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/blob/main/README.md" target="_blank">README</a> for details about the architecture.
         </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}