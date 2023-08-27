import { RenderedScene } from "@/types"

export const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: "pending",
  assetUrl: "", 
  alt: "",
  error: "",
  maskUrl: "",
  segments: []
})