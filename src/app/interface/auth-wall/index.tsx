
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Login } from "../login"

export function AuthWall({ show }: { show: boolean }) {
  return (
    <Dialog open={show}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4 text-stone-800">
        <p className="">
          The AI Comic Factory is a free app available to all Hugging Face users!
        </p>
        <p>
          Please sign-in to continue:
         </p>
         <p>
          <Login />
         </p>
         <p>(temporary issue alert: if this doesn&apos;t work for you, please use the button in the About panel)</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}