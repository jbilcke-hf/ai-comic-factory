
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Login } from "../login"
import { SettingsDialog } from "../settings-dialog"

export function AuthWall({ show }: { show: boolean }) {
  return (
    <Dialog open={show}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid gap-4 py-4 text-stone-800 text-center text-xl">
        <p className="">
          The AI Comic Factory is a free app compatible with many vendors.
        </p>
        <p>
          By default it uses Hugging Face for story and image generation,<br/>
          our service is free of charge but we would like you to sign-in 👇
         </p>
         <p>
          <Login />
         </p>
         {/*<p>(if login doesn&apos;t work for you, please use the button in the About panel)</p>*/}
         <p className="mt-2 text-lg">
          To hide this message, you can also go in the <SettingsDialog /> to replace<br/>
           both the image and the story providers to use external vendors.
      </p>
         <p className="mt-2 text-base">
          This pop-up will also disappear if you <a className="text-stone-600 underline" href="https://github.com/jbilcke-hf/ai-comic-factory" target="_blank">download the code</a> to run the app at home.
         </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}