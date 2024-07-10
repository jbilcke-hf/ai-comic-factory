import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision"

export async function injectSpeechBubbleInTheBackground(params: {
  inputImageInBase64: string;
  text?: string;
  shape?: "oval" | "rectangular" |  "cloud" | "thought";
  line?: "handdrawn" | "straight" | "bubble" | "chaotic";
  font?: string;
  debug?: boolean;
}): Promise<string> {
  const {
    inputImageInBase64,
    text,
    shape = "oval",
    line = "handdrawn",
    font = "Arial",
    debug = false,
  } = params;

  // If no text is provided, return the original image
  if (!text) {
    return inputImageInBase64;
  }

  // Load the image
  const image = await loadImage(inputImageInBase64);

  // Set up canvas
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);

  // Set up MediaPipe Image Segmenter
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  const imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite",
      delegate: "GPU"
    },
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });

  const segmentationResult = imageSegmenter.segment(image);
  let characterBoundingBox: { top: number, left: number, width: number, height: number } | null = null;

  if (segmentationResult.categoryMask) {
    const mask = segmentationResult.categoryMask.getAsUint8Array();
    const detectedItems = analyzeSegmentationMask(mask, image.width, image.height);
    console.log("Detected items:", detectedItems);

    if (detectedItems.length > 0) {
      characterBoundingBox = findCharacterBoundingBox(mask, image.width, image.height);
    }

    if (debug) {
      drawSegmentationMask(ctx, mask, image.width, image.height);
    }
  }

  const bubbleLocation = characterBoundingBox 
    ? { x: characterBoundingBox.left + characterBoundingBox.width / 2, y: characterBoundingBox.top }
    : { x: image.width / 2, y: image.height / 2 };

  drawSpeechBubble(ctx, bubbleLocation, text, shape, line, font, !!characterBoundingBox, image.width, image.height, characterBoundingBox);

  return canvas.toDataURL('image/png');
}
function loadImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}



function analyzeSegmentationMask(mask: Uint8Array, width: number, height: number): string[] {
  const categories = new Set<number>();
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] > 0) {
      categories.add(mask[i]);
    }
  }
  return Array.from(categories).map(c => `unknown-${c}`);
}

function findMainCharacterLocation(mask: Uint8Array, width: number, height: number): { x: number, y: number } {
  let sumX = 0, sumY = 0, count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (mask[index] > 0) {
        sumX += x;
        sumY += y;
        count++;
      }
    }
  }
  return count > 0 ? { x: sumX / count, y: sumY / count } : { x: width / 2, y: height / 2 };
}


function drawSegmentationMask(ctx: CanvasRenderingContext2D, mask: Uint8Array, width: number, height: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < mask.length; i++) {
    const category = mask[i];
    if (category > 0) {
      // Use a different color for each category
      const color = getCategoryColor(category);
      data[i * 4] = color[0];
      data[i * 4 + 1] = color[1];
      data[i * 4 + 2] = color[2];
      data[i * 4 + 3] = 128; // 50% opacity
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function getCategoryColor(category: number): [number, number, number] {
  // Generate a pseudo-random color based on the category
  const hue = (category * 137) % 360;
  return hslToRgb(hue / 360, 1, 0.5);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  location: { x: number, y: number },
  text: string,
  shape: "oval" | "rectangular" | "cloud" | "thought",
  line: "handdrawn" | "straight" | "bubble" | "chaotic",
  font: string,
  characterDetected: boolean,
  imageWidth: number,
  imageHeight: number,
  characterBoundingBox: { top: number, left: number, width: number, height: number } | null
) {
  const bubbleWidth = Math.min(300, imageWidth * 0.4);
  const bubbleHeight = Math.min(150, imageHeight * 0.3);
  const padding = 20;
  
  const fontSize = Math.max(15, Math.min(30, 500 / text.length)); // Increased font size by 25%
  ctx.font = `${fontSize}px ${font}`;
  
  const wrappedText = wrapText(ctx, text, bubbleWidth - padding * 2);
  const textDimensions = measureTextDimensions(ctx, wrappedText);
  
  const finalWidth = Math.max(bubbleWidth, textDimensions.width + padding * 2);
  const finalHeight = Math.max(bubbleHeight, textDimensions.height + padding * 2);
  
  const bubbleLocation = {
    x: Math.max(finalWidth / 2, Math.min(imageWidth - finalWidth / 2, location.x)),
    y: Math.max(finalHeight / 2, Math.min(imageHeight - finalHeight / 2, location.y - finalHeight))
  };

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  ctx.beginPath();
  drawBubbleShape(ctx, shape, bubbleLocation, finalWidth, finalHeight, location);
  ctx.fill();
  ctx.stroke();

  applyLineStyle(ctx, line);
  
  const tailTarget = characterBoundingBox 
    ? { x: characterBoundingBox.left + characterBoundingBox.width / 2, y: characterBoundingBox.top + characterBoundingBox.height * 0.2 }
    : location;
  
  drawTail(ctx, bubbleLocation, finalWidth, finalHeight, tailTarget, shape);

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawFormattedText(ctx, wrappedText, bubbleLocation.x, bubbleLocation.y, finalWidth - padding * 2, fontSize);
}

function drawBubbleShape(
  ctx: CanvasRenderingContext2D,
  shape: "oval" | "rectangular" | "cloud" | "thought",
  bubbleLocation: { x: number, y: number },
  width: number,
  height: number,
  tailTarget: { x: number, y: number }
) {
  switch (shape) {
    case "oval":
      drawOvalBubble(ctx, bubbleLocation, width, height);
      break;
    case "rectangular":
      drawRectangularBubble(ctx, bubbleLocation, width, height);
      break;
    case "cloud":
      drawCloudBubble(ctx, bubbleLocation, width, height);
      break;
    case "thought":
      drawThoughtBubble(ctx, bubbleLocation, width, height);
      break;
  }
}

function drawOvalBubble(ctx: CanvasRenderingContext2D, location: { x: number, y: number }, width: number, height: number) {
  ctx.beginPath();
  ctx.ellipse(location.x, location.y, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
}

function drawRectangularBubble(ctx: CanvasRenderingContext2D, location: { x: number, y: number }, width: number, height: number) {
  const radius = 20;
  ctx.beginPath();
  ctx.moveTo(location.x - width / 2 + radius, location.y - height / 2);
  ctx.lineTo(location.x + width / 2 - radius, location.y - height / 2);
  ctx.quadraticCurveTo(location.x + width / 2, location.y - height / 2, location.x + width / 2, location.y - height / 2 + radius);
  ctx.lineTo(location.x + width / 2, location.y + height / 2 - radius);
  ctx.quadraticCurveTo(location.x + width / 2, location.y + height / 2, location.x + width / 2 - radius, location.y + height / 2);
  ctx.lineTo(location.x - width / 2 + radius, location.y + height / 2);
  ctx.quadraticCurveTo(location.x - width / 2, location.y + height / 2, location.x - width / 2, location.y + height / 2 - radius);
  ctx.lineTo(location.x - width / 2, location.y - height / 2 + radius);
  ctx.quadraticCurveTo(location.x - width / 2, location.y - height / 2, location.x - width / 2 + radius, location.y - height / 2);
  ctx.closePath();
}

function drawCloudBubble(ctx: CanvasRenderingContext2D, location: { x: number, y: number }, width: number, height: number) {
  const numBumps = Math.floor(width / 40);
  const bumpRadius = width / (numBumps * 2);

  ctx.beginPath();
  ctx.moveTo(location.x - width / 2 + bumpRadius, location.y);

  // Top
  for (let i = 0; i < numBumps; i++) {
    const x = location.x - width / 2 + (i * 2 + 1) * bumpRadius;
    const y = location.y - height / 2;
    ctx.quadraticCurveTo(x, y - bumpRadius / 2, x + bumpRadius, y);
  }

  // Right
  for (let i = 0; i < numBumps / 2; i++) {
    const x = location.x + width / 2;
    const y = location.y - height / 2 + (i * 2 + 1) * bumpRadius * 2;
    ctx.quadraticCurveTo(x + bumpRadius / 2, y, x, y + bumpRadius * 2);
  }

  // Bottom
  for (let i = numBumps; i > 0; i--) {
    const x = location.x - width / 2 + (i * 2 - 1) * bumpRadius;
    const y = location.y + height / 2;
    ctx.quadraticCurveTo(x, y + bumpRadius / 2, x - bumpRadius, y);
  }

  // Left
  for (let i = numBumps / 2; i > 0; i--) {
    const x = location.x - width / 2;
    const y = location.y - height / 2 + (i * 2 - 1) * bumpRadius * 2;
    ctx.quadraticCurveTo(x - bumpRadius / 2, y, x, y - bumpRadius * 2);
  }
  ctx.closePath();
}

function drawThoughtBubble(ctx: CanvasRenderingContext2D, location: { x: number, y: number }, width: number, height: number) {
  drawCloudBubble(ctx, location, width, height);
  // The tail for thought bubbles is handled in the drawTail function
}

function drawTail(
  ctx: CanvasRenderingContext2D,
  bubbleLocation: { x: number, y: number },
  width: number,
  height: number,
  tailTarget: { x: number, y: number },
  shape: string
) {
  const tailLength = Math.min(50, height / 2);
  const startX = bubbleLocation.x + (tailTarget.x > bubbleLocation.x ? width / 4 : -width / 4);
  const startY = bubbleLocation.y + height / 2;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  
  if (shape === "thought") {
    const bubbleCount = 3;
    for (let i = 0; i < bubbleCount; i++) {
      const t = (i + 1) / (bubbleCount + 1);
      const x = startX + (tailTarget.x - startX) * t;
      const y = startY + (tailTarget.y - startY) * t;
      const radius = 5 * (1 - t);
      ctx.lineTo(x - radius, y);
      ctx.arc(x, y, radius, 0, Math.PI * 2);
    }
  } else {
    const controlX = (startX + tailTarget.x) / 2;
    const controlY = (startY + tailTarget.y + 20) / 2;
    ctx.quadraticCurveTo(controlX, controlY, tailTarget.x, tailTarget.y);
    ctx.quadraticCurveTo(controlX, controlY, startX + (tailTarget.x > bubbleLocation.x ? -10 : 10), startY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function findCharacterBoundingBox(mask: Uint8Array, width: number, height: number): { top: number, left: number, width: number, height: number } {
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (mask[index] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return {
    top: minY,
    left: minX,
    width: maxX - minX,
    height: maxY - minY
  };
}

function applyLineStyle(ctx: CanvasRenderingContext2D, style: string) {
  switch (style) {
    case "handdrawn":
      ctx.setLineDash([5, 5]);
      break;
    case "straight":
      ctx.setLineDash([]);
      break;
    case "bubble":
      ctx.setLineDash([0, 10]);
      ctx.lineCap = "round";
      break;
    case "chaotic":
      ctx.setLineDash([10, 5, 2, 5]);
      break;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth || word.endsWith('.') || word.endsWith(',')) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}


function measureTextDimensions(ctx: CanvasRenderingContext2D, lines: string[]): { width: number, height: number } {
  let maxWidth = 0;
  const lineHeight = ctx.measureText('M').width * 1.2;
  const height = lineHeight * lines.length;

  for (const line of lines) {
    const metrics = ctx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  }

  return { width: maxWidth, height };
}

function drawFormattedText(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, maxWidth: number, fontSize: number) {
  const lineHeight = fontSize * 1.2;
  const totalHeight = lineHeight * lines.length;
  let startY = y - totalHeight / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineY = startY + i * lineHeight;
    const maxLineWidth = Math.min(maxWidth, maxWidth * (1 - Math.abs(i - (lines.length - 1) / 2) / lines.length));
    ctx.fillText(line, x, lineY, maxLineWidth);
  }
}