import { ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea"

export function EditModal({
    existingPrompt,
    isEnabled,
    className,
    children,
    onSave,
  }: {
    existingPrompt: string;
    isEnabled: boolean;
    className?: string;
    children?: ReactNode;
    onSave: (newPrompt: string) => void;
  }) {
  const [draftPrompt, setDraftPrompt] = useState(existingPrompt)
  const [isOpen, setOpen] = useState(false)

  const handleSubmit = () => {
    if (draftPrompt) {
      onSave(draftPrompt)
      setOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open || isEnabled) {
        setOpen(open)
        if (!open) {
          setDraftPrompt(existingPrompt)
        }
      }
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-stone-800">
        <DialogHeader>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            Edit Prompt
          </DialogDescription>
        </DialogHeader>
          <div className="flex flex-row flex-grow w-full">
            <Textarea
              placeholder="Story"
              rows={10}
              className="w-full bg-neutral-300 text-neutral-800 dark:bg-neutral-300 dark:text-neutral-800 rounded-r-none"
              // disabled={atLeastOnePanelIsBusy}
              onChange={(e) => {
                setDraftPrompt(e.target.value)
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') {
                  handleSubmit()
                }
              }}
              value={draftPrompt}
            />
          </div>
        <DialogFooter>
        <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false)
              setDraftPrompt(existingPrompt)
            }}
            >cancel</Button>
          <Button
            type="submit"
            onClick={() => handleSubmit()}
            disabled={!draftPrompt.length}
            >Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}