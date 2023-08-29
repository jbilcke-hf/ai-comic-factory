import { loadImage } from "./loadImage"
import { writeIntoBubble } from "./writeIntoBubble"

export async function writeIntoBubbles(image: string, texts: string[]): Promise<string> {
  const loadImg = await loadImage(image);
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  canvas.width = loadImg.width;
  canvas.height = loadImg.height;
  context?.drawImage(loadImg, 0, 0, loadImg.width, loadImg.height);
  
  const untouchedImageData = context?.getImageData(0, 0, loadImg.width, loadImg.height);
  if (!untouchedImageData) {
    throw new Error("untouchedImageData is invalid")
  }
  const colorSet = new Set<string>(); // This is the unique color container
  
  for(let i = 0; i < untouchedImageData?.data.length; i += 4){
    const r = untouchedImageData?.data[i];
    const g = untouchedImageData?.data[i+1];
    const b = untouchedImageData?.data[i+2];
    const colorString = `rgb(${r},${g},${b})`;
    
    if(!colorSet.has(colorString)){
      colorSet.add(colorString);
      var newCanvas = document.createElement('canvas');
      newCanvas.width = loadImg.width;
      newCanvas.height = loadImg.height;
      
      var newContext = newCanvas.getContext('2d');
      newContext?.drawImage(loadImg, 0, 0, loadImg.width, loadImg.height);
      var newImageData = newContext?.getImageData(0, 0, loadImg.width, loadImg.height);
      if (!newImageData) {
        throw new Error("newImageData is invalid")
      }

      for(let j = 0; j < newImageData?.data.length; j += 4){
        const _r = newImageData?.data[j];
        const _g = newImageData?.data[j+1];
        const _b = newImageData?.data[j+2];
        const _colorString = `rgb(${_r},${_g},${_b})`;
        
        if(_colorString !== colorString){
          newImageData?.data.set([0,0,0,0], j);
        }
      }

      newContext?.putImageData(newImageData as ImageData, 0, 0);

      let imageBase64 = newCanvas.toDataURL();

      if(texts.length > 0){
        let text = texts.shift() as string;
        if (imageBase64 != '') {
          const processedBase64 = await writeIntoBubble(imageBase64, text);
          const newImg = await loadImage(processedBase64);
          context?.drawImage(newImg, 0, 0, loadImg.width, loadImg.height);
        }
      }
    }
  }
  return canvas.toDataURL();
}