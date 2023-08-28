"use server"

import { RenderRequest, RenderedScene } from "@/types"

// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.RENDERING_ENGINE_API

const cacheDurationInSec = 30 * 60 // 30 minutes

export async function newRender({
  prompt,
  // negativePrompt,
  width,
  height
}: {
  prompt: string
  // negativePrompt: string[]
  width: number
  height: number
}) {
  console.log(`newRender(${prompt})`)
  if (!prompt) {
    console.error(`cannot call the rendering API without a prompt, aborting..`)
    throw new Error(`cannot call the rendering API without a prompt, aborting..`)
  }

  let defaulResult: RenderedScene = {
    renderId: "",
    status: "error",
    assetUrl: "",
    alt: prompt || "",
    maskUrl: "",
    error: "failed to fetch the data",
    segments: []
  }


  try {
    console.log(`calling POST ${apiUrl}/render with prompt: ${prompt}`)

    const res = await fetch(`${apiUrl}/render`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        prompt,
        // negativePrompt, unused for now
        nbFrames: 1,
        nbSteps: 25, // 20 = fast, 30 = better, 50 = best
        actionnables: [],
        segmentation: "disabled", // one day we will remove this param, to make it automatic
        width,
        height,

        // no need to upscale right now as we generate tiny panels
        // maybe later we can provide an "export" button to PDF
        upscalingFactor: 2,

        // analyzing doesn't work yet, it seems..
        analyze: false, // analyze: true,

        cache: "ignore"
      } as Partial<RenderRequest>),
      cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
    })

    // console.log("res:", res)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const response = (await res.json()) as RenderedScene

    return response
  } catch (err) {
    console.error(err)
    return defaulResult
  }
}

export async function getRender(renderId: string) {
  if (!renderId) {
    console.error(`cannot call the rendering API without a renderId, aborting..`)
    throw new Error(`cannot call the rendering API without a renderId, aborting..`)
  }

  let defaulResult: RenderedScene = {
    renderId: "",
    status: "error",
    assetUrl: "",
    alt: "",
    maskUrl: "",
    error: "failed to fetch the data",
    segments: []
  }

  try {
    // console.log(`calling GET ${apiUrl}/render with renderId: ${renderId}`)
    const res = await fetch(`${apiUrl}/render/${renderId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
    })

    // console.log("res:", res)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const response = (await res.json()) as RenderedScene
    // console.log("response:", response)
    return response
  } catch (err) {
    console.error(err)
    // Gorgon.clear(cacheKey)
    return defaulResult
  }

  // }, cacheDurationInSec * 1000)
}
