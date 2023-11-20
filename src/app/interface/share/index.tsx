import { useStore } from "@/app/store"
import { HuggingClap } from "@/components/icons/hugging-clap"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export function Share() {
  const [isOpen, setOpen] = useState(false)
  const preset = useStore(state => state.preset)
  const prompt = useStore(state => state.prompt)
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)
  const allStatus = Object.values(panelGenerationStatus)
  const remainingImages = allStatus.reduce((acc, s) => (acc + (s ? 1 : 0)), 0)


  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    /*

    ------------------------------------------------------------------
    Legacy mode: PNG export doesn't work well, so we are disabling it.
    ------------------------------------------------------------------

    const dataUrl = await pageToImage()
    // console.log("dataUrl:", dataUrl)
    const fileToUpload = base64ToFile(dataUrl, "comic.png")
    let uploadUrl = ""
    try {
      uploadUrl = await uploadToHuggingFace(fileToUpload)
      // console.log("uploadUrl:", uploadUrl)
    } catch (err) {
      console.error("Failed to upload the image to Hugging Face")
    }

    const comicFileMd = `
#### Comic:
${uploadUrl
  ? (`![${prompt}](${uploadUrl})`)
  : (`(please drag & drop a capture of your comic here - we recommend you to print the PDF and convert it to JPG for best quality!)`)}
`;
    */
     
    const storyPrompt = (prompt.split("||")[1] || "")

    const storyPromptMd = storyPrompt ? `
#### Story prompt:
\`\`\`${storyPrompt}\`\`\`
` : ``

    const stylePrompt = (prompt.split("||")[0] || "")

    const stylePromptMd = stylePrompt ? `
#### Style/character prompt:
\`\`\`${stylePrompt}\`\`\`
` : ``

    const comicFileMd =
`### Comic:

Drag & drop your comic image (converted to JPG) here!
`

    const descriptionMd = `
${storyPromptMd}
${stylePromptMd}
#### Preset:
\`\`\`${preset.label}\`\`\`

${comicFileMd}`;

    // console.log("descriptionMd:", descriptionMd)

    const slicedStory = storyPrompt.slice(0, 77)

    const params = new URLSearchParams({
      title: `[Comic] ${
        slicedStory
      }${
        slicedStory !== storyPrompt ? '...' : ''
      }${
        stylePrompt ? `(${stylePrompt.slice(0, 77)
      })` : ''}`,
      description: descriptionMd,
      });
    const paramsStr = params.toString();
    window.open(`https://huggingface.co/spaces/jbilcke-hf/comic-factory/discussions/new?${paramsStr}`, '_blank');
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!prompt?.length}
          className="space-x-1 md:space-x-2"
          >
          <div className="scale-105"><HuggingClap /></div>
          <div>
          <span className="hidden md:inline">{remainingImages ? `⌛` : `Share`}</span>
        <span className="inline md:hidden">{remainingImages ? `⌛` : `Share`}</span>
          </div>
        </Button> 
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            Sharing Your Comic
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-stone-800">
          <p className="">
            To ensure optimal output quality comics are saved as PDF files:
          </p>
          <p>
            👉 Step 1: Click on <Button
            onClick={handlePrint}
            disabled={!prompt?.length}
          >
            <span className="hidden md:inline">{
            remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} panels ⌛` : `Save PDF`
            }</span>
            <span className="inline md:hidden">{
              remainingImages ? `${allStatus.length - remainingImages}/${allStatus.length} ⌛` : `Save`
            }</span>
        </Button>
          </p>
          <p>
            👉 Step 2: Select &quot;Print to PDF&quot; in the printing options (Note: if you use Safari, print from the OS menu)
          </p>
          <p>
            👉 Step 3: Open your PDF and convert it to a JPG image (using &quot;Export to&quot; or &quot;Convert to&quot;)
          </p>
          <p>
            👉 Step 4: Click here to post: <Button
            onClick={handleShare}
            className="space-x-2"
          >
            <div className="scale-105"><HuggingClap /></div>
            <div>
              Share
            </div>
          </Button> 
          </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}