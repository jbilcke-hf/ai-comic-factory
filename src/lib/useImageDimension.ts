import { useEffect, useState } from "react"

import { ImageDimension, getImageDimension } from "./getImageDimension"

export function useImageDimension(src: string) {
  const [dimension, setDimension] = useState<ImageDimension>({
    width: 0,
    height: 0,
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