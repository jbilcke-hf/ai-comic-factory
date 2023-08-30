import { useStore } from "@/app/store"
import { HuggingClap } from "@/components/icons/hugging-clap"
import { Button } from "@/components/ui/button"
import { base64ToFile } from "@/lib/base64ToFile"
import { uploadToHuggingFace } from "@/lib/uploadToHuggingFace"
import { cn } from "@/lib/utils"

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
    // const dataUrl = await pageToImage()
    // console.log("dataUrl:", dataUrl)
    // const fileToUpload = base64ToFile(dataUrl, "comic.png")
    // const uploadUrl = await uploadToHuggingFace(fileToUpload)
    // console.log("uploadUrl:", uploadUrl)

    const descriptionMd = `
#### Prompt:
\`\`\`${prompt}\`\`\`

#### Preset:
\`\`\`${preset.label}\`\`\`

#### Comic:

(drag & drop your downloaded comic here)
`;
// ![${prompt}](${uploadUrl})

    console.log("descriptionMd:", descriptionMd)

    const params = new URLSearchParams({
      title: `captionTxt`,
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
      `fixed bottom-6 right-6`,
      `flex flex-row`,
      `animation-all duration-300 ease-in-out`,
      isGeneratingStory ? `scale-0 opacity-0` : ``,
      `space-x-3`,
    )}>
      {/*
      <div>
        <Button
          onClick={handlePrint}
          disabled={!prompt?.length}
        >{
          remainingImages ? `${allStatus.length - remainingImages}/4 panels ⌛` : `Print as PDF`
          // remainingImages ? `Print (${allStatus.length - remainingImages}/4 in HD ⌛)` : `Print (in HD)`
        
        }</Button>
      </div>
      */}
      <div>
        <Button
          onClick={download}
          disabled={!prompt?.length}
        >{
          remainingImages ? `${allStatus.length - remainingImages}/4 panels ⌛` : `Download`
        }</Button>
      </div>
      <div>
        <Button
          onClick={handleShare}
          disabled={!prompt?.length}
          className="space-x-2"
        >
          <span className="scale-105"><HuggingClap /></span>
          <span>Share to community</span>
        </Button>
      </div>
    </div>
  )
}