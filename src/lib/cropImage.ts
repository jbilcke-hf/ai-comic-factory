async function cropImage(inputImage: string): Promise<{ croppedImage: string; x: number; y: number; width: number; height: number }> {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = inputImage;
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            reject("Context is null");
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(0, 0, img.width, img.height);
          const data = imageData.data;
          let minX = img.width, minY = img.height, maxX = 0, maxY = 0;

          for (let y = 0; y < img.height; y++) {
              for (let x = 0; x < img.width; x++) {
                  const i = (y * 4) * img.width + x * 4;
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  if (avg < 255) {
                      minX = Math.min(minX, x);
                      minY = Math.min(minY, y);
                      maxX = Math.max(maxX, x);
                      maxY = Math.max(maxY, y);
                  }
              }
          }

          const width = maxX - minX;
          const height = maxY - minY;
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = width;
          croppedCanvas.height = height;
          const croppedCtx = croppedCanvas.getContext('2d');
          if (!croppedCtx) {
            reject("croppedCtx is null");
            return;
          }
          croppedCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);
          resolve({
              croppedImage: croppedCanvas.toDataURL(),
              x: minX,
              y: minY,
              width,
              height
          });
      };
      img.onerror = reject;
  });
}