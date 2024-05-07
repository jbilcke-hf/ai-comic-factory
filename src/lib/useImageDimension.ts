import { useEffect, useState } from "react"

import { ImageDimension, getImageDimension } from "./getImageDimension"
import { ClapMediaOrientation } from "@aitube/clap"

export function useImageDimension(src: string) {
  const [dimension, setDimension] = useState<ImageDimension>({
    width: 0,
    height: 0,
    orientation: ClapMediaOrientation.SQUARE
  })

  useEffect(() => {
    const compute = async () => {
      const newDimension = await getImageDimension(src)
      setDimension(newDimension)
    }
    compute()
  }, [src])

  return dimension
}