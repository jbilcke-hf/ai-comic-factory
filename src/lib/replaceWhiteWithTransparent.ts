export function replaceWhiteWithTransparent(imageBase64: string): Promise<string> {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
              reject('Unable to get canvas 2D context');
              return;
          }

          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
              if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                  data[i + 3] = 0;
              }
          }

          ctx.putImageData(imageData, 0, 0);

          resolve(canvas.toDataURL());
      };

      img.onerror = (err) => {
          reject(err);
      };

      img.src = imageBase64;
  });
}