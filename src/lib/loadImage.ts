export async function loadImage(image: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = image;

  const imgOnLoad = () => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => { resolve(img) };
      img.onerror = (err) => { reject(err) };
    })
  };

  const loadImg = await imgOnLoad();
  return loadImg
}