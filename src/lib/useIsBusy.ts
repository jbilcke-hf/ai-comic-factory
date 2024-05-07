import { useStore } from "@/app/store"

export function useIsBusy() {
  const isGeneratingStory = useStore(s => s.isGeneratingStory)
  const atLeastOnePanelIsBusy = useStore(s => s.atLeastOnePanelIsBusy)
  const isBusy = isGeneratingStory || atLeastOnePanelIsBusy

  return isBusy
}