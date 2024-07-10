import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision"
import { actionman } from "../fonts";

interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Injects speech bubbles into the background of an image.
 * @param params - The parameters for injecting speech bubbles.
 * @returns A Promise that resolves to a base64-encoded string of the modified image.
 */
export async function injectSpeechBubbleInTheBackground(params: {
  inputImageInBase64: string;
  text?: string;
  shape?: "oval" | "rectangular" | "cloud" | "thought";
  line?: "handdrawn" | "straight" | "bubble" | "chaotic";
  font?: string;
  debug?: boolean;
}): Promise<string> {
  const {
    inputImageInBase64,
    text,
    shape = "oval",
    line = "handdrawn",
    font = actionman.style.fontFamily,
    debug = false,
  } = params;

  if (!text) {
    return inputImageInBase64;
  }

  const image = await loadImage(inputImageInBase64);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);

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
  let characterBoundingBox: BoundingBox | null = null;

  if (segmentationResult.categoryMask) {
    const mask = segmentationResult.categoryMask.getAsUint8Array();
    characterBoundingBox = findCharacterBoundingBox(mask, image.width, image.height);

    if (debug) {
      drawSegmentationMask(ctx, mask, image.width, image.height);
    }
  }

  const bubbles = splitTextIntoBubbles(text);
  const bubbleLocations = calculateBubbleLocations(bubbles.length, image.width, image.height, characterBoundingBox);

  bubbles.forEach((bubbleText, index) => {
    const bubbleLocation = bubbleLocations[index];
    drawSpeechBubble(ctx, bubbleLocation, bubbleText, shape, line, font, characterBoundingBox, image.width, image.height);
  });

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

function findCharacterBoundingBox(mask: Uint8Array, width: number, height: number): BoundingBox {
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

function analyzeSegmentationMask(mask: Uint8Array, width: number, height: number): string[] {
  const categories = new Set<number>();
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] > 0) {
      categories.add(mask[i]);
    }
  }
  return Array.from(categories).map(c => `unknown-${c}`);
}

function splitTextIntoBubbles(text: string): string[] {
  // Define a regular expression pattern
  const pattern = /(?:[A-Z][a-z]*\.\s*)*(?:[^.!?\s]+[^.!?]*[.!?]+)|\S+/g;
  
  const matches = text.match(pattern) || [text];
  return matches.map(sentence => sentence.trim());
}

function calculateBubbleLocations(
  bubbleCount: number, 
  imageWidth: number, 
  imageHeight: number, 
  characterBoundingBox: BoundingBox | null
): { x: number, y: number }[] {
  const locations: { x: number, y: number }[] = [];
  const padding = 50;
  const availableWidth = imageWidth - padding * 2;
  const availableHeight = imageHeight - padding * 2;
  const maxAttempts = 50;
  
  for (let i = 0; i < bubbleCount; i++) {
    let x, y;
    let attempts = 0;
    do {
      x = Math.random() * availableWidth + padding;
      y = (i / bubbleCount) * availableHeight + padding;
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.warn(`Could not find non-overlapping position for bubble ${i} after ${maxAttempts} attempts.`);
        break;
      }
    } while (characterBoundingBox && isOverlapping({ x, y }, characterBoundingBox));
    
    locations.push({ x, y });
  }
  
  return locations;
}

function isOverlapping(point: { x: number, y: number }, box: BoundingBox): boolean {
  return point.x >= box.left && point.x <= box.left + box.width &&
         point.y >= box.top && point.y <= box.top + box.height;
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
  characterBoundingBox: BoundingBox | null,
  imageWidth: number,
  imageHeight: number
) {
  const bubbleWidth = Math.min(300, imageWidth * 0.4);
  const bubbleHeight = Math.min(150, imageHeight * 0.3);
  const padding = 24;
  
  const fontSize = 20;
  ctx.font = `${fontSize}px ${font}`;
  
  const wrappedText = wrapText(ctx, text, bubbleWidth - padding * 2, fontSize);
  const textDimensions = measureTextDimensions(ctx, wrappedText, fontSize);
  
  const finalWidth = Math.max(bubbleWidth, textDimensions.width + padding * 2);
  const finalHeight = Math.max(bubbleHeight, textDimensions.height + padding * 2);
  
  const bubbleLocation = {
    x: Math.max(finalWidth / 2 + padding, Math.min(imageWidth - finalWidth / 2 - padding, location.x)),
    y: Math.max(finalHeight / 2 + padding, Math.min(imageHeight - finalHeight / 2 - padding, location.y))
  };

  ctx.fillStyle = 'white';

  // let's disable the border for now
  ctx.strokeStyle = 'white'; // 'black'; 
  ctx.lineWidth = 2;

  let tailTarget = null;
  if (characterBoundingBox) {
    tailTarget = {
      x: characterBoundingBox.left + characterBoundingBox.width / 2,
      y: characterBoundingBox.top + characterBoundingBox.height * 0.2
    };
  }

  ctx.beginPath();
  drawBubbleShape(ctx, shape, bubbleLocation, finalWidth, finalHeight, tailTarget);
  ctx.fill();
  ctx.stroke();

  if (tailTarget) {
    drawTail(ctx, bubbleLocation, finalWidth, finalHeight, tailTarget, shape);
  }

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
  tailTarget: { x: number, y: number } | null
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
  bubbleWidth: number,
  bubbleHeight: number,
  tailTarget: { x: number, y: number },
  shape: string
) {
  // Calculate new maximum length for tail
  const bubbleCenterX = bubbleLocation.x;
  const bubbleCenterY = bubbleLocation.y;
  const maxTailLength = Math.max(bubbleHeight, bubbleWidth) * 0.6;

  const tailBaseWidth = 30; // 50% larger than before
  const tailHeight = 30;

  // Calculate the length from bubble center to tail target
  const deltaX = tailTarget.x - bubbleCenterX;
  const deltaY = tailTarget.y - bubbleCenterY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Normalize the length if it exceeds the max tail length
  const limitedDistance = Math.min(distance, maxTailLength);
  const tailEndX = bubbleCenterX + (deltaX / distance) * limitedDistance;
  const tailEndY = bubbleCenterY + (deltaY / distance) * limitedDistance;

  ctx.beginPath();
  ctx.moveTo(bubbleCenterX, bubbleCenterY);

  const controlPoint1 = {
    x: bubbleCenterX + deltaX / 3,
    y: bubbleCenterY + deltaY / 3
  };

  const controlPoint2 = {
    x: bubbleCenterX + (deltaX * 2) / 3,
    y: bubbleCenterY + (deltaY * 2) / 3
  };

  ctx.bezierCurveTo(
    controlPoint1.x, controlPoint1.y,
    controlPoint2.x, controlPoint2.y,
    tailEndX, tailEndY
  );

  // Mirror to create the width at base
  const mirroredControlPoint1 = {
    x: controlPoint1.x + tailBaseWidth / 3,
    y: controlPoint1.y
  };
  
  const mirroredControlPoint2 = {
    x: controlPoint2.x + (tailBaseWidth * 2) / 3,
    y: controlPoint2.y
  };

  ctx.bezierCurveTo(
    mirroredControlPoint2.x, mirroredControlPoint2.y,
    mirroredControlPoint1.x, mirroredControlPoint1.y,
    bubbleCenterX + tailBaseWidth, bubbleCenterY
  );

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, lineHeight: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth) {
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

function measureTextDimensions(ctx: CanvasRenderingContext2D, lines: string[], lineHeight: number): { width: number, height: number } {
  let maxWidth = 0;
  const height = lineHeight * lines.length;

  for (const line of lines) {
    const metrics = ctx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  }

  return { width: maxWidth, height };
}

function drawFormattedText(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, maxWidth: number, lineHeight: number) {
  const totalHeight = lineHeight * lines.length;
  let startY = y - totalHeight / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineY = startY + i * lineHeight;
    ctx.fillText(line, x, lineY, maxWidth);
  }
}