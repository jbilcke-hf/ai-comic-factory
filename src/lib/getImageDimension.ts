export interface ImageDimension {
  width: number
  height: number
}

export async function getImageDimension(src: string): Promise<ImageDimension> {
  if (!src) {
    return { width: 0, height: 0 }
  }
  const img = new Image()
  img.src = src
  await img.decode()
  const width = img.width
  const height = img.height
  return { width, height }
}