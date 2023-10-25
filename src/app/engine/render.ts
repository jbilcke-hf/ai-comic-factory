"use server"

import { v4 as uuidv4 } from "uuid"
import Replicate from "replicate"

import { RenderRequest, RenderedScene, RenderingEngine } from "@/types"
import { generateSeed } from "@/lib/generateSeed"
import { sleep } from "@/lib/sleep"

const renderingEngine = `${process.env.RENDERING_ENGINE || ""}` as RenderingEngine

// TODO: we should split Hugging Face and Replicate backends into separate files
const huggingFaceToken = `${process.env.AUTH_HF_API_TOKEN || ""}`
const huggingFaceInferenceEndpointUrl = `${process.env.RENDERING_HF_INFERENCE_ENDPOINT_URL || ""}`
const huggingFaceInferenceApiBaseModel = `${process.env.RENDERING_HF_INFERENCE_API_BASE_MODEL || ""}`
const huggingFaceInferenceApiRefinerModel = `${process.env.RENDERING_HF_INFERENCE_API_REFINER_MODEL || ""}`

const replicateToken = `${process.env.AUTH_REPLICATE_API_TOKEN || ""}`
const replicateModel = `${process.env.RENDERING_REPLICATE_API_MODEL || ""}`
const replicateModelVersion = `${process.env.RENDERING_REPLICATE_API_MODEL_VERSION || ""}`

const videochainToken = `${process.env.AUTH_VIDEOCHAIN_API_TOKEN || ""}`
const videochainApiUrl = `${process.env.RENDERING_VIDEOCHAIN_API_URL || ""}`

export async function newRender({
  prompt,
  // negativePrompt,
  width,
  height,
  withCache
}: {
  prompt: string
  // negativePrompt: string[]
  width: number
  height: number
  withCache: boolean
}) {
  // throw new Error("Planned maintenance")

  if (!prompt) {
    const error = `cannot call the rendering API without a prompt, aborting..`
    console.error(error)
    throw new Error(error)
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

  const nbInferenceSteps = 30
  const guidanceScale = 9

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

      const seed = generateSeed()
      const prediction = await replicate.predictions.create({
        version: replicateModelVersion,
        input: {
          prompt: [
            "beautiful",
            // "intricate details",
            prompt,
            "award winning",
            "high resolution"
          ].join(", "),
          width,
          height,
          seed
        }
      })
  
      // no need to reply straight away as images take time to generate, this isn't instantaneous
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
      if (renderingEngine === "INFERENCE_API" && !huggingFaceInferenceApiBaseModel) {
        throw new Error(`you need to configure your RENDERING_HF_INFERENCE_API_BASE_MODEL in order to use the INFERENCE_API rendering engine`)
      }
      if (renderingEngine === "INFERENCE_API" && !huggingFaceInferenceApiRefinerModel) {
        throw new Error(`you need to configure your RENDERING_HF_INFERENCE_API_REFINER_MODEL in order to use the INFERENCE_API rendering engine`)
      }

      const baseModelUrl = renderingEngine === "INFERENCE_ENDPOINT"
        ? huggingFaceInferenceEndpointUrl
        : `https://api-inference.huggingface.co/models/${huggingFaceInferenceApiBaseModel}`

      const positivePrompt = [
        "beautiful",
        // "intricate details",
        prompt,
        "award winning",
        "high resolution"
      ].join(", ")

      const res = await fetch(baseModelUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${huggingFaceToken}`,
        },
        body: JSON.stringify({
          inputs: positivePrompt,
          parameters: {
            num_inference_steps: nbInferenceSteps,
            guidance_scale: guidanceScale,
            width,
            height,
          },

          // this doesn't do what you think it does
          use_cache: false, // withCache,
        }),
        cache: "no-store",
        // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
        // next: { revalidate: 1 }
      })
  
  
      // Recommendation: handle errors
      if (res.status !== 200) {
        const content = await res.text()
        console.error(content)
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }

      const blob = await res.arrayBuffer()

      const contentType = res.headers.get('content-type')

      let assetUrl = `data:${contentType};base64,${Buffer.from(blob).toString('base64')}`
      
      // note: there is no "refiner" step yet for custom inference endpoint
      // you probably don't need it anyway, as you probably want to deploy an all-in-one model instead for perf reasons
      
      if (renderingEngine === "INFERENCE_API") {
        try {
          const refinerModelUrl = `https://api-inference.huggingface.co/models/${huggingFaceInferenceApiRefinerModel}`



          const res = await fetch(refinerModelUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${huggingFaceToken}`,
            },
            body: JSON.stringify({
              inputs: Buffer.from(blob).toString('base64'),
              parameters: {
                prompt: positivePrompt,
                num_inference_steps: nbInferenceSteps,
                guidance_scale: guidanceScale,
                width,
                height,
              },

              // this doesn't do what you think it does
              use_cache: false, // withCache,
            }),
            cache: "no-store",
            // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
            // next: { revalidate: 1 }
          })
      
      
          // Recommendation: handle errors
          if (res.status !== 200) {
            const content = await res.json()
            // if (content.error.include("currently loading")) {
            // console.log("refiner isn't ready yet")
            throw new Error(content?.error || 'Failed to fetch data')
          }

          const refinedBlob = await res.arrayBuffer()

          const contentType = res.headers.get('content-type')

          assetUrl = `data:${contentType};base64,${Buffer.from(refinedBlob).toString('base64')}`
          
        } catch (err) {
          console.log(`Refiner step failed, but this is not a blocker. Error details: ${err}`)
        }
      }


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
      const res = await fetch(`${videochainApiUrl}${videochainApiUrl.endsWith("/") ? "" : "/"}render`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${videochainToken}`,
        },
        body: JSON.stringify({
          prompt,
          // negativePrompt, unused for now
          nbFrames: 1,
          nbSteps: nbInferenceSteps, // 20 = fast, 30 = better, 50 = best
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

      if (res.status !== 200) {
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
    const error = `cannot call the rendering API without a renderId, aborting..`
    console.error(error)
    throw new Error(error)
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
        throw new Error(`you need to configure your AUTH_REPLICATE_API_TOKEN in order to use the REPLICATE rendering engine`)
      }
      if (!replicateModel) {
        throw new Error(`you need to configure your RENDERING_REPLICATE_API_MODEL in order to use the REPLICATE rendering engine`)
      }

       const res = await fetch(`https://api.replicate.com/v1/predictions/${renderId}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${replicateToken}`,
        },
        cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
      })
    
      // Recommendation: handle errors
      if (res.status !== 200) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      
      const response = (await res.json()) as any

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
      const res = await fetch(`${videochainApiUrl}/render/${renderId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${videochainToken}`,
        },
        cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
      })
      
      if (res.status !== 200) {
        throw new Error('Failed to fetch data')
      }
      
      const response = (await res.json()) as RenderedScene
      return response
    }
  } catch (err) {
    console.error(err)
    defaulResult.status = "error"
    defaulResult.error = `${err}`
    return defaulResult
  }
}

export async function upscaleImage(image: string): Promise<{
  assetUrl: string
  error: string
}> {
  if (!image) {
    const error = `cannot call the rendering API without an image, aborting..`
    console.error(error)
    throw new Error(error)
  }

  let defaulResult = {
    assetUrl: "",
    error: "failed to fetch the data",
  }

  try {
    const res = await fetch(`${videochainApiUrl}/upscale`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${videochainToken}`,
      },
      cache: 'no-store',
      body: JSON.stringify({ image, factor: 3 })
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
    })

    if (res.status !== 200) {
      throw new Error('Failed to fetch data')
    }
    
    const response = (await res.json()) as {
      assetUrl: string
      error: string
    }
    return response
  } catch (err) {
    console.error(err)
    return defaulResult
  }
}
