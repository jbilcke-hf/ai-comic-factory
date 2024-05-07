import { ClapMediaOrientation } from "@aitube/clap"

export interface ImageDimension {
  width: number
  height: number
  orientation: ClapMediaOrientation
}

export async function getImageDimension(src: string): Promise<ImageDimension> {
  if (!src) {
    return { width: 0, height: 0, orientation:  ClapMediaOrientation.SQUARE }
  }
  const img = new Image()
  img.src = src
  await img.decode()
  const width = img.width
  const height = img.height

  let orientation = ClapMediaOrientation.SQUARE
  if (width > height) { 
    orientation = ClapMediaOrientation.LANDSCAPE
  } else if (width < height) {
    orientation = ClapMediaOrientation.PORTRAIT
  }
  return { width, height, orientation }
}