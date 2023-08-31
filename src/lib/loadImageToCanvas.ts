export async function loadImageToCanvas(imageBase64: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    // create a new image object
    let img = new Image();
    // specify a function to run when the image is fully loaded
    img.onload = () => {
      // create a canvas element
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      // get the context of the canvas
      let ctx = canvas.getContext('2d');
      if (ctx) {
        // draw the image into the canvas
        ctx.drawImage(img, 0, 0);
        // resolve the promise with the canvas
        resolve(canvas);
      } else {
        reject('Error creating the context of canvas');
      }
    };
    // specify a function to run when the image could not be loaded
    img.onerror = () => {
      reject('Image could not be loaded');
    };
    img.src = imageBase64; // must be a data;image/.... prefixed URL string
  });
}