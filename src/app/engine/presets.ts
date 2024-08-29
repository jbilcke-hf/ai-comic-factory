import { FontName, actionman, komika, vtc } from "@/lib/fonts"
import { pick } from "@/lib/pick"
import { NextFontWithVariable } from "next/dist/compiled/@next/font"

export type ComicFamily =
  | "american"
  | "asian"
  | "european"

export type ComicColor =
  | "color"
  | "grayscale"
  | "monochrome"

export interface Preset {
  id: string
  label: string
  family: ComicFamily
  color: ComicColor
  font: FontName
  llmPrompt: string
  imagePrompt: (prompt: string) => string[]
  negativePrompt: (prompt: string) => string[]
}

// ATTENTION!! negative prompts are not supported by all providers

export const presets: Record<string, Preset> = {
  random: {
    id: "random",
    label: "Random style",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "",
    imagePrompt: (prompt: string) => [],
    negativePrompt: () => [],
  },
  neutral: {
    id: "neutral",
    label: "Neutral (no style)",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "",
    imagePrompt: (prompt: string) => [
      prompt,
    ],
    negativePrompt: () => [ ],
  },
  /*
  video_3d_style: {
    id: "video_3d_style",
    label: "[video] 3D style",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      prompt,
    ],
    negativePrompt: () => [ ],
  },
  */
  japanese_manga: {
    id: "japanese_manga",
    label: "Manga",
    family: "asian",
    color: "grayscale",
    font: "actionman",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `Monochrome Japanese manga of ${
      prompt
      }. The drawing style is a monochrome japanese seinen manga, in black & white with rich and intricate drawing details. There is no text, no signature, no watermark.`
    ],
    negativePrompt: () => [
      "signature",
      "watermark",
      "copyright",
      "franco-belgian comic",
      "comic",
      "american comic",
      "photo",
      "3D render"
    ],
  },
  manga_dark: {
    id: "manga_dark",
    label: "Manga (dark)",
    family: "asian",
    color: "grayscale",
    font: "actionman",
    llmPrompt: "japanese horror manga",
    imagePrompt: (prompt: string) => [
      `Monochrome horror Japanese Seinen manga of ${
      prompt
      }.  The drawing style is a lowlit, dark monochrome japanese seinen manga in the style of Uzimaki, very serious and horrifying, in black & white with rich and intricate drawing details. The scene is depressing and foreboding. There is no text, no signature, no watermark.`
    ],
    negativePrompt: () => [
      "signature",
      "watermark",
      "copyright",
      "happy",
      "joyous",
      "cute",
      "franco-belgian comic",
      "comic",
      "american comic",
      "photo",
      "3D render"
    ],
  },
  /*
  doesn't work with Flux.1 schnell
  nihonga: {
    id: "nihonga",
    label: "Nihonga",
    family: "asian",
    color: "color",
    font: "actionman",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `Vintage Japanese Nihonga panel from 1895, handpainted in the style of Hishida Shunsō with faded colors, it represents a simplified ${
      prompt
      }. The scene is set in 1400 in feudal Japan, in the style of Kawai Gyokudō. Water color painting, faded colors. We see traditional japanese elements of the daily life. Asymmetric scene composition. Painted in the style of Yokoyama Taikan, Uemura Shōen, Tomioka Tessai. There is no text, no signature, no watermark.`
    ],
    negativePrompt: () => [
      "modern",
      "signature",
      "watermark",
      "copyright",
      "franco-belgian comic",
      "manga",
      "comic",
      "american comic",
      "photo",
      "3D render"
    ],
  },
  */
  anime: {
    id: "anime",
    label: "Anime",
    family: "asian",
    color: "color",
    font: "actionman",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `Japanese Ghibli Studio Anime screenshot of ${
      prompt
      }. Anime drawing, inspired by Ghibli studios. Asymmetric cinematic camera shot. The photo style is similar to the Akira movie, with rich and intricate drawing details. Scene has a negative space and asymmetrical balance. There is no text, no signature, no watermark.`
    ],
    negativePrompt: () => [
      "signature",
      "watermark",
      "copyright",
      "franco-belgian comic",
      "black & white",
      "comic",
      "american comic",
      "painting",
      "photo",
      "3D render"
    ],
  },
  cinematic: {
    id: "cinematic",
    label: "Cinematic",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "movie",
    imagePrompt: (prompt: string) => [
      `Cinematic photography shot in 4K IMAX of ${prompt}.  Asymmetric cinematic camera shot, lens distortion, hollywood cinematic style, trending on netflix, professional color grading with soft bokeh, crisp and sharp details, super realistic with rich and intricate drawing details. Scene has a negative space and asymmetrical balance. We feel something, the scene is emotional. There is no text, no signature, no watermark.`,
    ],
    negativePrompt: () => [
      "black banding",
      "manga",
      "drawing",
      "anime",
      "painting",
      "3D render",
      "CGI",
      "fake",
      "blurry",
      "cropped"
    ],
  },
  franco_belgian: {
    id: "franco_belgian",
    label: "Franco-Belgian",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "Franco-Belgian comic (a \"bande dessinée\"), in the style of Franquin, Moebius etc",
    imagePrompt: (prompt: string) => [
      "bande dessinée",
      "franco-belgian comic",
       prompt,
      "comic album in the graphic style of spirou and gaston lagaffe etc.",
      "detailed drawing"
      // "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  american_comic_90: {
    id: "american_comic_90",
    label: "American (modern)",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      `modern american comic panel about ${prompt}`,
      "color comicbook, detailed drawing with intricate details"
      //"single panel",
      // "2010s",
      // "digital print",
      // "color comicbook",
      // "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },

  /*
  american_comic_40: {
    label: "American (1940)",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      `american comic`,
      prompt,
      "single panel",
      "american comic",
      "comicbook style",
      "1940",
      "40s",
      "color comicbook",
      "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  */

  /*
  it doesn't render well on Flux

  american_comic_50: {
    id: "american_comic_50",
    label: "American (1950)",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      "1950",
      "50s",
      `vintage american color comic`,
      prompt,
      "detailed drawing"
      // "single panel",
     //  "comicbook style",
      // "color comicbook",
      // "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  */

  /*
  american_comic_60: {
    label: "American (1960)",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "american comic",
    imagePrompt: (prompt: string) => [
      `american comic`,
      prompt,
      "single panel",
      "american comic",
      "comicbook style",
      "1960",
      "60s",
      "color comicbook",
      "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "action",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  */

  
  /*
  doesn't work well with Flux

  flying_saucer: {
    id: "flying_saucer",
    label: "Flying saucer",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new pulp science fiction",
    imagePrompt: (prompt: string) => [
      `vintage pulp sci-fi coming from 1940s, scanned page with yellowing and defects`,
      `${prompt}`,
      "detailed drawing"
      // "single panel",
      // "comic album"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "modern",
      "digital",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  */
 
  humanoid: {
    id: "humanoid",
    label: "Humanoid",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "comic books by Moebius",
    imagePrompt: (prompt: string) => [
      `color comic panel`,
      "style of Moebius",
      `${prompt}`,
      "detailed drawing",
      "french comic panel",
      "franco-belgian style",
      "bande dessinée",
      "single panel",
      // "comic album"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  haddock: {
    id: "haddock",
    label: "Haddock",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "writing Tintin comic books",
    imagePrompt: (prompt: string) => [
      `color comic panel`,
      "style of Hergé",
      "tintin style",
      `${prompt}`,
      "by Hergé",
      "french comic panel",
      "franco-belgian style",
     //  "color panel",
     //  "bande dessinée",
      // "single panel",
      // "comic album"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  /*
  lurid: {
    id: "lurid",
    label: "Lurid",
    family: "american",
    color: "color",
    font: "actionman",
    llmPrompt: "1970s satirical and alternative underground comics",
    imagePrompt: (prompt: string) => [
      `satirical color comic`,
      `underground comix`,
      `1970`,
      `${prompt}`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  */
  armorican: {
    id: "armorican",
    label: "Armorican",
    family: "european",
    color: "monochrome",
    font: "actionman",
    llmPrompt: "french style comic books set in ancient Rome and Gaul",
    imagePrompt: (prompt: string) => [
      `color comic panel`,
      "romans",
      "gauls",
      "french comic panel",
      "franco-belgian style",
      `about ${prompt}`,
      "bande dessinée",
      "single panel",
      // "comical",
      // "comic album",
      // "color drawing"
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "photo",
      "painting",
      "3D render"
    ],
  },
  render: {
    id: "render",
    label: "3D Render",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `3D render animation`,
      `Pixar`,
      `cute`,
      `funny`,
      `Unreal engine`,
      `${prompt}`,
      `crisp`,
      `sharp`
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  klimt: {
    id: "klimt",
    label: "Klimt",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "Gustav Klimt art pieces.",
    imagePrompt: (prompt: string) => [
      `golden`,
      `patchwork`,
      `style of Gustav Klimt`,
      `Gustav Klimt painting`,
      `${prompt}`,
      `detailed painting`,
      `intricate details`
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  medieval: {
    id: "medieval",
    label: "Medieval",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "medieval story (write in this style)",
    imagePrompt: (prompt: string) => [
      `medieval illuminated manuscript`,
      `illuminated manuscript of`,
      `medieval`,
      // `medieval color engraving`,
      `${prompt}`,
      `intricate details`,
      // `medieval`
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  /*
  glass: {
    id: "glass",
    label: "Glass",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `stained glass`,
      `vitrail`,
      `stained glass`,
      // `medieval color engraving`,
      `${prompt}`,
      `medieval`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  */
  /*
  voynich: {
    id: "voynich",
    label: "Voynich",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `voynich`,
      `voynich page`,
      // `medieval color engraving`,
      `${prompt}`,
      `medieval`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  */
  egyptian: {
    id: "egyptian",
    label: "Egyptian",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "ancient egyptian stories.",
    imagePrompt: (prompt: string) => [
      `ancient egyptian wall painting`,
      `ancient egypt`,
      // `medieval color engraving`,
      `${prompt}`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  /*
  psx: {
    label: "PSX",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `videogame screenshot`,
      `3dfx`,
      `3D dos game`,
      `software rendering`,
      `${prompt}`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  */
 /*
  pixel: {
    label: "Pixel",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `pixelart`,
      `isometric`,
      `pixelated`,
      `low res`,
      `${prompt}`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  */
  photonovel: {
    id: "photonovel",
    label: "Vintage photonovel",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `vintage photo`,
      `1950`,
      `1960`,
      `french new wave`,
      `faded colors`,
      `color movie screencap`,
      `${prompt}`,
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
  stockphoto: {
    id: "stockphoto",
    label: "Stock photo",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new movie",
    imagePrompt: (prompt: string) => [
      `cinematic`,
      `hyperrealistic`,
      `footage`,
      `sharp 8k`,
      `analog`,
      `instagram`,
      `photoshoot`,
      `${prompt}`,
      `crisp details`
    ],
    negativePrompt: () => [
      "manga",
      "anime",
      "american comic",
      "grayscale",
      "monochrome",
      "painting"
    ],
  },
}

export type PresetName = keyof typeof presets

export const defaultPreset: PresetName = "american_comic_90"

export const nonRandomPresets = Object.keys(presets).filter(p => p !== "random")

export const getPreset = (preset?: PresetName): Preset => presets[preset || defaultPreset] || presets[defaultPreset]

export const getRandomPreset = (): Preset => {
  const presetName = pick(Object.keys(presets).filter(preset => preset !== "random")) as PresetName
  return getPreset(presetName)
}