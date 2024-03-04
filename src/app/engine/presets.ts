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

// ATTENTION!! negative prompts are not supported by the VideoChain API yet

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
    label: "Japanese",
    family: "asian",
    color: "grayscale",
    font: "actionman",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `grayscale`,
      `detailed drawing`,
      `japanese manga`,
      prompt,
      // "single panel",
      // "manga",
      //  "japanese",
      // "intricate",
      // "detailed",
      // "drawing"
    ],
    negativePrompt: () => [
      "franco-belgian comic",
      "color album",
      "color",
      "american comic",
      "photo",
      "painting",
      "3D render"
    ],
  },
  nihonga: {
    id: "nihonga",
    label: "Nihonga",
    family: "asian",
    color: "color",
    font: "actionman",
    llmPrompt: "japanese manga",
    imagePrompt: (prompt: string) => [
      `japanese nihonga painting about ${prompt}`,
      "Nihonga",
      "ancient japanese painting",
      "intricate",
      "detailed",
      "detailed painting"
      // "drawing"
    ],
    negativePrompt: () => [
      "franco-belgian comic",
      "color album",
      "color",
      "manga",
      "comic",
      "american comic",
      "photo",
      "painting",
      "3D render"
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
      "comic album",
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
      "digital color comicbook style",
      `modern american comic`,
      prompt,
      "detailed drawing"
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

  
  flying_saucer: {
    id: "flying_saucer",
    label: "Flying saucer",
    family: "european",
    color: "color",
    font: "actionman",
    llmPrompt: "new pulp science fiction",
    imagePrompt: (prompt: string) => [
      `vintage science fiction`,
      // "40s",
      "color pulp comic panel",
      "1940",
      `${prompt}`,
      "detailed drawing"
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

export const defaultPreset: PresetName = "american_comic_50"

export const nonRandomPresets = Object.keys(presets).filter(p => p !== "random")

export const getPreset = (preset?: PresetName): Preset => presets[preset || defaultPreset] || presets[defaultPreset]

export const getRandomPreset = (): Preset => {
  const presetName = pick(Object.keys(presets).filter(preset => preset !== "random")) as PresetName
  return getPreset(presetName)
}