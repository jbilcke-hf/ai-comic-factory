"use server"

import { v4 as uuidv4 } from "uuid"
import Replicate from "replicate"

import { RenderRequest, RenderedScene, RenderingEngine, Settings } from "@/types"
import { generateSeed } from "@/lib/generateSeed"
import { sleep } from "@/lib/sleep"

const serverRenderingEngine = `${process.env.RENDERING_ENGINE || ""}` as RenderingEngine

// TODO: we should split Hugging Face and Replicate backends into separate files
const serverHuggingfaceApiKey = `${process.env.AUTH_HF_API_TOKEN || ""}`
const serverHuggingfaceApiUrl = `${process.env.RENDERING_HF_INFERENCE_ENDPOINT_URL || ""}`
const serverHuggingfaceInferenceApiModel = `${process.env.RENDERING_HF_INFERENCE_API_BASE_MODEL || ""}`
const serverHuggingfaceInferenceApiModelRefinerModel = `${process.env.RENDERING_HF_INFERENCE_API_REFINER_MODEL || ""}`
const serverHuggingfaceInferenceApiModelTrigger = `${process.env.RENDERING_HF_INFERENCE_API_MODEL_TRIGGER || ""}`
const serverHuggingfaceInferenceApiFileType = `${process.env.RENDERING_HF_INFERENCE_API_FILE_TYPE || ""}`

const serverReplicateApiKey = `${process.env.AUTH_REPLICATE_API_TOKEN || ""}`
const serverReplicateApiModel = `${process.env.RENDERING_REPLICATE_API_MODEL || ""}`
const serverReplicateApiModelVersion = `${process.env.RENDERING_REPLICATE_API_MODEL_VERSION || ""}`
const serverReplicateApiModelTrigger = `${process.env.RENDERING_REPLICATE_API_MODEL_TRIGGER || ""}`

const videochainToken = `${process.env.AUTH_VIDEOCHAIN_API_TOKEN || ""}`
const videochainApiUrl = `${process.env.RENDERING_VIDEOCHAIN_API_URL || ""}`

const serverOpenaiApiKey = `${process.env.AUTH_OPENAI_API_KEY || ""}`
const serverOpenaiApiBaseUrl = `${process.env.RENDERING_OPENAI_API_BASE_URL || "https://api.openai.com/v1"}`
const serverOpenaiApiModel = `${process.env.RENDERING_OPENAI_API_MODEL || "dall-e-3"}`

export async function newRender({
  prompt,
  // negativePrompt,
  nbFrames,
  width,
  height,
  withCache,
  settings,
}: {
  prompt: string
  // negativePrompt: string[]
  width: number
  height: number
  nbFrames: number
  withCache: boolean
  settings: Settings
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

  let renderingEngine = serverRenderingEngine
  let openaiApiKey = serverOpenaiApiKey
  let openaiApiModel = serverOpenaiApiModel

  let replicateApiKey = serverReplicateApiKey
  let replicateApiModel = serverReplicateApiModel
  let replicateApiModelVersion = serverReplicateApiModelVersion
  let replicateApiModelTrigger = serverReplicateApiModelTrigger

  let huggingfaceApiKey = serverHuggingfaceApiKey
  let huggingfaceInferenceApiModel = serverHuggingfaceInferenceApiModel
  let huggingfaceApiUrl = serverHuggingfaceApiUrl
  let huggingfaceInferenceApiModelRefinerModel = serverHuggingfaceInferenceApiModelRefinerModel 
  let huggingfaceInferenceApiModelTrigger = serverHuggingfaceInferenceApiModelTrigger
  let huggingfaceInferenceApiFileType = serverHuggingfaceInferenceApiFileType

  const placeholder = "<USE YOUR OWN TOKEN>"

  // console.log("settings:", JSON.stringify(settings, null, 2))

  if (
    settings.renderingModelVendor === "OPENAI" && 
    settings.openaiApiKey &&
    settings.openaiApiKey !== placeholder &&
    settings.openaiApiModel
  ) {
    console.log("using OpenAI using user credentials (hidden)")
    renderingEngine = "OPENAI"
    openaiApiKey = settings.openaiApiKey
    openaiApiModel = settings.openaiApiModel
  } if (
    settings.renderingModelVendor === "REPLICATE" &&
    settings.replicateApiKey &&
    settings.replicateApiKey !== placeholder &&
    settings.replicateApiModel &&
    settings.replicateApiModelVersion
  ) {
    console.log("using Replicate using user credentials (hidden)")
    renderingEngine = "REPLICATE"
    replicateApiKey = settings.replicateApiKey
    replicateApiModel = settings.replicateApiModel
    replicateApiModelVersion = settings.replicateApiModelVersion
    replicateApiModelTrigger = settings.replicateApiModelTrigger
  } else if (
      settings.renderingModelVendor === "HUGGINGFACE" &&
      settings.huggingfaceApiKey &&
      settings.huggingfaceApiKey !== placeholder &&
      settings.huggingfaceInferenceApiModel
    ) {
      console.log("using Hugging Face using user credentials (hidden)")
    renderingEngine = "INFERENCE_API"
    huggingfaceApiKey = settings.huggingfaceApiKey
    huggingfaceInferenceApiModel = settings.huggingfaceInferenceApiModel
    huggingfaceInferenceApiModelTrigger = settings.huggingfaceInferenceApiModelTrigger
    huggingfaceInferenceApiFileType = settings.huggingfaceInferenceApiFileType
  } 

  try {
    if (renderingEngine === "OPENAI") {

      /*
      const openai = new OpenAI({
        apiKey: openaiApiKey
      });
      */

      // When using DALL·E 3, images can have a size of 1024x1024, 1024x1792 or 1792x1024 pixels.
      // the improved resolution is nice, but the AI Comic Factory needs a special ratio
      // anyway, let's see what we can do
      
      const size =
        width > height ? '1792x1024' :
        width < height ? '1024x1792' :
        '1024x1024'

      /*
      const response = await openai.createImage({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: size as any,
        // quality: "standard",
      })
      */

      const res = await fetch(`${serverOpenaiApiBaseUrl}/images/generations`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: openaiApiModel,
          prompt,
          n: 1,
          size,
          // quality: "standard",
        }),
        cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
      })

      if (res.status !== 200) {
        throw new Error('Failed to fetch data')
      }
      
      const response = (await res.json()) as { data: { url: string }[] }

      // console.log("response:", response)
      return {
        renderId: uuidv4(),
        status: "completed",
        assetUrl: response.data[0].url || "", 
        alt: prompt,
        error: "",
        maskUrl: "",
        segments: []
      } as RenderedScene
    } else if (renderingEngine === "REPLICATE") {
      if (!replicateApiKey) {
        throw new Error(`invalid replicateApiKey, you need to configure your REPLICATE_API_TOKEN in order to use the REPLICATE rendering engine`)
      }
      if (!replicateApiModel) {
        throw new Error(`invalid replicateApiModel, you need to configure your REPLICATE_API_MODEL in order to use the REPLICATE rendering engine`)
      }
      if (!replicateApiModelVersion) {
        throw new Error(`invalid replicateApiModelVersion, you need to configure your REPLICATE_API_MODEL_VERSION in order to use the REPLICATE rendering engine`)
      }
      const replicate = new Replicate({ auth: replicateApiKey })

      const seed = generateSeed()
      const prediction = await replicate.predictions.create({
        version: replicateApiModelVersion,
        input: {
          prompt: [
            "beautiful",
            // "intricate details",
            replicateApiModelTrigger || "",
            prompt,
            "award winning",
            "high resolution"
          ].filter(x => x).join(", "),
          width,
          height,
          seed,
          ...replicateApiModelTrigger && {
            lora_scale: 0.85 // we generally want something high here
          },
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
      if (!huggingfaceApiKey) {
        throw new Error(`invalid huggingfaceApiKey, you need to configure your HF_API_TOKEN in order to use the ${renderingEngine} rendering engine`)
      }
      if (renderingEngine === "INFERENCE_ENDPOINT" && !huggingfaceApiUrl) {
        throw new Error(`invalid huggingfaceApiUrl, you need to configure your RENDERING_HF_INFERENCE_ENDPOINT_URL in order to use the INFERENCE_ENDPOINT rendering engine`)
      }
      if (renderingEngine === "INFERENCE_API" && !huggingfaceInferenceApiModel) {
        throw new Error(`invalid huggingfaceInferenceApiModel, you need to configure your RENDERING_HF_INFERENCE_API_BASE_MODEL in order to use the INFERENCE_API rendering engine`)
      }
      if (renderingEngine === "INFERENCE_API" && !huggingfaceInferenceApiModelRefinerModel) {
        throw new Error(`invalid huggingfaceInferenceApiModelRefinerModel, you need to configure your RENDERING_HF_INFERENCE_API_REFINER_MODEL in order to use the INFERENCE_API rendering engine`)
      }

      const baseModelUrl = renderingEngine === "INFERENCE_ENDPOINT"
        ? huggingfaceApiUrl
        : `https://api-inference.huggingface.co/models/${huggingfaceInferenceApiModel}`

      const positivePrompt = [
        "beautiful",
        // "intricate details",
        huggingfaceInferenceApiModelTrigger || "",
        prompt,
        "award winning",
        "high resolution"
      ].filter(x => x).join(", ")

      const res = await fetch(baseModelUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: huggingfaceInferenceApiFileType,
          Authorization: `Bearer ${huggingfaceApiKey}`,
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
          const refinerModelUrl = `https://api-inference.huggingface.co/models/${huggingfaceInferenceApiModelRefinerModel}`

          const res = await fetch(refinerModelUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${huggingfaceApiKey}`,
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

          nbFrames,

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

          // let's completely disable turbo mode, it doesn't work well for drawings and comics,
          // basically all the people I talked to said it sucked
          turbo: false, // settings.renderingUseTurbo,

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

export async function getRender(renderId: string, settings: Settings) {
  if (!renderId) {
    const error = `cannot call the rendering API without a renderId, aborting..`
    console.error(error)
    throw new Error(error)
  }


  let renderingEngine = serverRenderingEngine
  let openaiApiKey = serverOpenaiApiKey
  let openaiApiModel = serverOpenaiApiModel

  let replicateApiKey = serverReplicateApiKey
  let replicateApiModel = serverReplicateApiModel
  let replicateApiModelVersion = serverReplicateApiModelVersion
  let replicateApiModelTrigger = serverReplicateApiModelTrigger

  let huggingfaceApiKey = serverHuggingfaceApiKey
  let huggingfaceInferenceApiModel = serverHuggingfaceInferenceApiModel
  let huggingfaceInferenceApiModelTrigger = serverHuggingfaceInferenceApiModelTrigger
  let huggingfaceApiUrl = serverHuggingfaceApiUrl
  let huggingfaceInferenceApiModelRefinerModel = serverHuggingfaceInferenceApiModelRefinerModel 

  const placeholder = "<USE YOUR OWN TOKEN>"

  if (
    settings.renderingModelVendor === "OPENAI" && 
    settings.openaiApiKey &&
    settings.openaiApiKey !== placeholder &&
    settings.openaiApiModel
  ) {
    renderingEngine = "OPENAI"
    openaiApiKey = settings.openaiApiKey
    openaiApiModel = settings.openaiApiModel
  } if (
    settings.renderingModelVendor === "REPLICATE" &&
    settings.replicateApiKey &&
    settings.replicateApiKey !== placeholder &&
    settings.replicateApiModel &&
    settings.replicateApiModelVersion
  ) {
    renderingEngine = "REPLICATE"
    replicateApiKey = settings.replicateApiKey
    replicateApiModel = settings.replicateApiModel
    replicateApiModelVersion = settings.replicateApiModelVersion
    replicateApiModelTrigger = settings.replicateApiModelTrigger
  } else if (
      settings.renderingModelVendor === "HUGGINGFACE" &&
      settings.huggingfaceApiKey &&
      settings.huggingfaceApiKey !== placeholder &&
      settings.huggingfaceInferenceApiModel
    ) {
    // console.log("using Hugging Face using user credentials (hidden)")
    renderingEngine = "INFERENCE_API"
    huggingfaceApiKey = settings.huggingfaceApiKey
    huggingfaceInferenceApiModel = settings.huggingfaceInferenceApiModel
    huggingfaceInferenceApiModelTrigger = settings.huggingfaceInferenceApiModelTrigger
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
      if (!replicateApiKey) {
        throw new Error(`invalid replicateApiKey, you need to configure your AUTH_REPLICATE_API_TOKEN in order to use the REPLICATE rendering engine`)
      }

       const res = await fetch(`https://api.replicate.com/v1/predictions/${renderId}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${replicateApiKey}`,
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
