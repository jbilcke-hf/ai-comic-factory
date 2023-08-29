/*
I have a PNG image which contains a colored shape (roughly in the shape of a speech bubble), surrounded by white

Please write a TypeScript function (it should work in the browser) to:

1. replace all the white pixels with a transparent PNG pixel
2.  replace all the colored pixels with a white pixel
3. write some input text into the colored shape
4. Make sure line returns are handled
5. It should have some padding (eg. 20px)
6. use Comic Sans MS

You can use the canvas for your operation. The signature should be something like:

- Please adjust the font size, based on the available number of pixels inside the bubble, taking some margin into account. 
- The text should not be below 8px
- If there is not enough room to display it without going outside the shape, then crop the text.
- in other words, NEVER write outside the shape!

The function should be something like:

writeIntoBubble(image: string, text: string): Promise<string>
*/

export async function writeIntoBubble(image: string, text: string): Promise<string> {
  const padding = 20;  // Pixels
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const physicalWidth = img.width;
      const physicalHeight = img.height;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Unable to get canvas context');
        return;
      }
      canvas.width = physicalWidth;
      canvas.height = physicalHeight;
      ctx.drawImage(img, 0, 0, physicalWidth, physicalHeight);

      const imageData = ctx.getImageData(0, 0, physicalWidth, physicalHeight);
      const data = imageData.data;

      let minX = physicalWidth, minY = physicalHeight, maxX = 0, maxY = 0;

      for (let y = 0; y < physicalHeight; y++) {
        for (let x = 0; x < physicalWidth; x++) {
          const i = (y * physicalWidth + x) * 4;
          if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            data[i] = data[i + 1] = data[i + 2] = 255;
            data[i + 3] = 255;
          } else {
            data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset transforms to handle padding correctly

      const textX = minX + padding;
      const textY = minY  + padding;
      const textWidth = (maxX - minX) - 2 * padding;
      const textHeight = (maxY - minY) - 2 * padding;

      ctx.restore();

      ctx.rect(textX, textY, textWidth, textHeight);
      ctx.clip();  // Clip outside of the region

      let fontSize = 20;  // Start with a large size
      let lines = [];
      do {
        ctx.font = `${fontSize}px Comic Sans MS`;
        lines = wrapText(ctx, text, textWidth);
        fontSize -= 2;  // Reduce size and try again if text doesn't fit
      } while(lines.length > textHeight / fontSize && fontSize > 8);
      ctx.font = `${fontSize}px Comic Sans MS`;

      lines.forEach((line, i) => ctx.fillText(line, textX, textY + padding + i * fontSize));

      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = image;
  });
}

// Function to wrap text into lines that fit inside a specified width
function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  return lines;
}