"use server"

import { v4 as uuidv4 } from "uuid"
import Replicate from "replicate"

import { RenderRequest, RenderedScene, RenderingEngine } from "@/types"
import { generateSeed } from "@/lib/generateSeed"
import { sleep } from "@/lib/sleep"

const renderingEngine = `${process.env.RENDERING_ENGINE || ""}` as RenderingEngine

const videochainApiUrl = `${process.env.RENDERING_VIDEOCHAIN_API_URL || "" }`

const huggingFaceToken = `${process.env.HF_API_TOKEN || ""}`
const huggingFaceInferenceEndpointUrl = `${process.env.RENDERING_HF_INFERENCE_ENDPOINT_URL || ""}`
const huggingFaceInferenceApiModel = `${process.env.RENDERING_HF_INFERENCE_API_MODEL || ""}`

const replicateToken = `${process.env.RENDERING_REPLICATE_API_TOKEN || ""}`
const replicateModel = `${process.env.RENDERING_REPLICATE_API_MODEL || ""}`
const replicateModelVersion = `${process.env.RENDERING_REPLICATE_API_MODEL_VERSION || ""}`

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
  // console.log(`newRender(${prompt})`)
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
    if (renderingEngine === "REPLICATE") {
      if (!replicateToken) {
        throw new Error(`you need to configure your REPLICATE_API_TOKEN in order to use the REPLICATE rendering engine`)
      }
      if (!replicateModel) {
        throw new Error(`you need to configure your REPLICATE_API_MODEL in order to use the REPLICATE rendering engine`)
      }
      if (!replicateModelVersion) {
        throw new Error(`you need to configure your REPLICATE_API_MODEL_VERSION in order to use the REPLICATE rendering engine`)
      }
      const replicate = new Replicate({ auth: replicateToken })

      // console.log("Calling replicate..")
      const seed = generateSeed()
      const prediction = await replicate.predictions.create({
        version: replicateModelVersion,
        input: { prompt, seed }
      })
      
      // console.log("prediction:", prediction)

      // no need to reply straight away: good things take time
      // also our friends at Replicate won't like it if we spam them with requests
      await sleep(4000)

      return {
        renderId: prediction.id,
        status: "pending",
        assetUrl: "", 
        alt: prompt,
        error: prediction.error,
        maskUrl: "",
        segments: []
      } as RenderedScene
    } if (renderingEngine === "INFERENCE_ENDPOINT" || renderingEngine === "INFERENCE_API") {
      if (!huggingFaceToken) {
        throw new Error(`you need to configure your HF_API_TOKEN in order to use the ${renderingEngine} rendering engine`)
      }
      if (renderingEngine === "INFERENCE_ENDPOINT" && !huggingFaceInferenceEndpointUrl) {
        throw new Error(`you need to configure your RENDERING_HF_INFERENCE_ENDPOINT_URL in order to use the INFERENCE_ENDPOINT rendering engine`)
      }
      if (renderingEngine === "INFERENCE_API" && !huggingFaceInferenceApiModel) {
        throw new Error(`you need to configure your RENDERING_HF_INFERENCE_API_MODEL in order to use the INFERENCE_API rendering engine`)
      }

      const seed = generateSeed()

      const url = renderingEngine === "INFERENCE_ENDPOINT"
        ? huggingFaceInferenceEndpointUrl
        : `https://api-inference.huggingface.co/models/${huggingFaceInferenceApiModel}`

      const res = await fetch(url, {
        method: "POST",
        headers: {
          // Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${huggingFaceToken}`,
        },
        body: JSON.stringify({
          inputs: [
            "beautiful",
            "intricate details",
            prompt,
            "award winning",
            "high resolution"
          ].join(", "),
          parameters: {
            num_inference_steps: 25,
            guidance_scale: 8,
            width,
            height,

          }
        }),
        cache: "no-store",
        // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
        // next: { revalidate: 1 }
      })
  
  
      // Recommendation: handle errors
      if (res.status !== 200) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
  
      // the result is a JSON-encoded string
      const response = await res.json() as string
      const assetUrl = `data:image/png;base64,${response}`

      return {
        renderId: uuidv4(),
        status: "completed",
        assetUrl, 
        alt: prompt,
        error: "",
        maskUrl: "",
        segments: []
      } as RenderedScene
    } else {
      // console.log(`calling POST ${apiUrl}/render with prompt: ${prompt}`)
      const res = await fetch(`${videochainApiUrl}/render`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VIDEOCHAIN_API_TOKEN}`,
        },
        body: JSON.stringify({
          prompt,
          // negativePrompt, unused for now
          nbFrames: 1,
          nbSteps: 25, // 20 = fast, 30 = better, 50 = best
          actionnables: [], // ["text block"],
          segmentation: "disabled", // "firstframe", // one day we will remove this param, to make it automatic
          width,
          height,

          // no need to upscale right now as we generate tiny panels
          // maybe later we can provide an "export" button to PDF
          // unfortunately there are too many requests for upscaling,
          // the server is always down
          upscalingFactor: 1, // 2,

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
    }
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
    status: "pending",
    assetUrl: "",
    alt: "",
    maskUrl: "",
    error: "failed to fetch the data",
    segments: []
  }

  try {
    if (renderingEngine === "REPLICATE") {
      if (!replicateToken) {
        throw new Error(`you need to configure your REPLICATE_API_TOKEN in order to use the REPLICATE rendering engine`)
      }
      if (!replicateModel) {
        throw new Error(`you need to configure your REPLICATE_API_MODEL in order to use the REPLICATE rendering engine`)
      }

      // const replicate = new Replicate({ auth: replicateToken })

      // console.log("Calling replicate..")
      // const prediction = await replicate.predictions.get(renderId)
      // console.log("Prediction:", prediction)

       // console.log(`calling GET https://api.replicate.com/v1/predictions/${renderId}`)
       const res = await fetch(`https://api.replicate.com/v1/predictions/${renderId}`, {
        method: "GET",
        headers: {
          // Accept: "application/json",
          // "Content-Type": "application/json",
          Authorization: `Token ${replicateToken}`,
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
      
      const response = (await res.json()) as any
      // console.log("response:", response)

      return  {
        renderId,
        status: response?.error ? "error" : response?.status === "succeeded" ?  "completed" : "pending",
        assetUrl: `${response?.output || ""}`,
        alt: `${response?.input?.prompt || ""}`,
        error: `${response?.error || ""}`,
        maskUrl: "",
        segments: []
      } as RenderedScene
    } else {
      // console.log(`calling GET ${apiUrl}/render with renderId: ${renderId}`)
      const res = await fetch(`${videochainApiUrl}/render/${renderId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VIDEOCHAIN_API_TOKEN}`,
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
    }
  } catch (err) {
    console.error(err)
    defaulResult.status = "error"
    defaulResult.error = `${err}`
    // Gorgon.clear(cacheKey)
    return defaulResult
  }

  // }, cacheDurationInSec * 1000)
}

export async function upscaleImage(image: string): Promise<{
  assetUrl: string
  error: string
}> {
  if (!image) {
    console.error(`cannot call the rendering API without an image, aborting..`)
    throw new Error(`cannot call the rendering API without an image, aborting..`)
  }

  let defaulResult = {
    assetUrl: "",
    error: "failed to fetch the data",
  }

  try {
    // console.log(`calling GET ${apiUrl}/render with renderId: ${renderId}`)
    const res = await fetch(`${videochainApiUrl}/upscale`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VIDEOCHAIN_API_TOKEN}`,
      },
      cache: 'no-store',
      body: JSON.stringify({ image, factor: 3 })
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
    
    const response = (await res.json()) as {
      assetUrl: string
      error: string
    }
    // console.log("response:", response)
    return response
  } catch (err) {
    console.error(err)
    // Gorgon.clear(cacheKey)
    return defaulResult
  }

  // }, cacheDurationInSec * 1000)
}
