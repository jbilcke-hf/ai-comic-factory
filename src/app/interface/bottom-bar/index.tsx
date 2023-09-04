import { useStore } from "@/app/store"
import { HuggingClap } from "@/components/icons/hugging-clap"
import { Button } from "@/components/ui/button"
import { base64ToFile } from "@/lib/base64ToFile"
import { uploadToHuggingFace } from "@/lib/uploadToHuggingFace"
import { cn } from "@/lib/utils"
import { About } from "../about"

export function BottomBar() {
  const download = useStore(state => state.download)
  const isGeneratingStory = useStore(state => state.isGeneratingStory)
  const prompt = useStore(state => state.prompt)
  const panelGenerationStatus = useStore(state => state.panelGenerationStatus)
  const page = useStore(state => state.page)
  const preset = useStore(state => state.preset)
  const pageToImage = useStore(state => state.pageToImage)

  const allStatus = Object.values(panelGenerationStatus)
  const remainingImages = allStatus.reduce((acc, s) => (acc + (s ? 1 : 0)), 0)
    
  const handleShare = async () => {
    const dataUrl = await pageToImage()
    // console.log("dataUrl:", dataUrl)
    const fileToUpload = base64ToFile(dataUrl, "comic.png")
    let uploadUrl = ""
    try {
      uploadUrl = await uploadToHuggingFace(fileToUpload)
      console.log("uploadUrl:", uploadUrl)
    } catch (err) {
      console.error("Failed to upload the image to Hugging Face")
    }


    const descriptionMd = `
#### Prompt:
\`\`\`${prompt}\`\`\`

#### Preset:
\`\`\`${preset.label}\`\`\`

#### Comic:
${uploadUrl
  ? (`![${prompt}](${uploadUrl})`)
  : (`(please drag & drop your JPG image here)`)}
`;

    console.log("descriptionMd:", descriptionMd)

    const params = new URLSearchParams({
      title: `[Comic] ${prompt}`,
      description: descriptionMd,
      });
    const paramsStr = params.toString();
    window.open(`https://huggingface.co/spaces/jbilcke-hf/comic-factory/discussions/new?${paramsStr}`, '_blank');
  }

  const handlePrint = () => {
    window.print()
  }
  return (
    <div className={cn(
      `print:hidden`,
      `fixed bottom-2 md:bottom-4 left-2 right-0 md:left-3 md:right-1`,
      `flex flex-row`,
      `justify-between`
    )}>
      <div className={cn(
        `flex flex-row`,
        `items-end`,
        `animation-all duration-300 ease-in-out`,
        isGeneratingStory ? `scale-0 opacity-0` : ``,
        `space-x-3`,
        `scale-[0.9]`
      )}>
        <About />
      </div>
      {/*
      <div>
        <Button
          onClick={handleUpscale}
          disabled={!prompt?.length && remainingImages}
        >
          Upscale
        </Button>
      </div>
      */}
      <div className={cn(
      `flex flex-row`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
      `space-x-3`,
      `scale-[0.9]`
    )}>
        <div>
          <Button
            onClick={handlePrint}
            disabled={!prompt?.length}
          >
            Print
          </Button>
        </div>
        <div>
          <Button
            onClick={download}
            disabled={!prompt?.length}
          >
            <span className="hidden md:inline">{
            remainingImages ? `${allStatus.length - remainingImages}/4 panels ⌛` : `Save`
            }</span>
            <span className="inline md:hidden">{
              remainingImages ? `${allStatus.length - remainingImages}/4 ⌛` : `Save`
            }</span>
           </Button>
        </div>
        <div>
          <Button
            onClick={handleShare}
            disabled={!prompt?.length}
            className="space-x-2"
          >
            <div className="scale-105"><HuggingClap /></div>
            <div>
              <span className="hidden md:inline">Share to community</span>
              <span className="inline md:hidden">Share</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}