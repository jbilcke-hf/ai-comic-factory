import { ClapImageRatio } from "@aitube/clap"

export interface ImageDimension {
  width: number
  height: number
  orientation: ClapImageRatio
}

export async function getImageDimension(src: string): Promise<ImageDimension> {
  if (!src) {
    return { width: 0, height: 0, orientation:  ClapImageRatio.SQUARE }
  }
  const img = new Image()
  img.src = src
  await img.decode()
  const width = img.width
  const height = img.height

  let orientation = ClapImageRatio.SQUARE
  if (width > height) { 
    orientation = ClapImageRatio.LANDSCAPE
  } else if (width < height) {
    orientation = ClapImageRatio.PORTRAIT
  }
  return { width, height, orientation }
}