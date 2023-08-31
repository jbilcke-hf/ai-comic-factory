"use client"

import { createWorker } from "tesseract.js"
import { loadImageToCanvas } from "./loadImageToCanvas";

export async function replaceTextInSpeechBubbles(image: string, customText: string) {
  console.log('creating OCR worker to find bubbles inside', image);

  const worker = await createWorker({
    logger: (info) => {
      console.log(info)
    },
  });

  const canvas = await loadImageToCanvas(image)
 
  const ctx = canvas.getContext('2d')!;

  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data } = await worker.recognize(canvas);
    const lines = data.lines || [];

    // Draw the lines on the image
    ctx.fillStyle = "white";

    lines.forEach((line) => {
      ctx.fillRect(line.bbox.x0, line.bbox.y0, line.bbox.x1 - line.bbox.x0, line.bbox.y1 - line.bbox.y0);
      
      const bubbleWidth = line.bbox.x1 - line.bbox.x0;
      const bubbleHeight = line.bbox.y1 - line.bbox.y0;
      let fontSize = 18;
      ctx.font = `${fontSize}px Arial`;

      /*
      while (
        ctx.measureText(customText).width > bubbleWidth || fontSize * 1.2 // line height
         > bubbleHeight) {
        fontSize -= 1;
        ctx.font = `${fontSize}px Arial`;
      }
      
      const lines = wrapText(ctx, customText, line.bbox.x0, line.bbox.y0, bubbleWidth, fontSize);
      
      ctx.fillStyle = "black";
      lines.forEach((text, i) => {
        ctx.fillText(text, line.bbox.x0, line.bbox.y0 + (i * fontSize * 1.2));
      });
      */
    })

    await worker.terminate();

    // Convert the Canvas to image data
    const imgAsDataURL = canvas.toDataURL('image/png');

    if (typeof window !== "undefined") {
      const foo = (window as any)
      if (!foo.debugJujul) {
        foo.debugJujul = []
      }
      foo.debugJujul.push({
        lines
      })
    }
    console.log("lines:", lines)

    return imgAsDataURL;

  } catch (err) {
    console.error(err);
  }
  return "";
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  const lines = [];

  for(let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    }
    else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}