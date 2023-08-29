export function replaceNonWhiteWithTransparent(imageBase64: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject('Unable to get canvas context');
                return;
            }

            const ratio = window.devicePixelRatio || 1;
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            ctx.scale(ratio, ratio);

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;
            console.log("ok")

            for (let i = 0; i < data.length; i += 4) {
                if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
                    // Change white (also shades of grays) pixels to black
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                } else {
                    // Change all other pixels to transparent
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