---
title: AI Comic Factory
emoji: 👩‍🎨
colorFrom: red
colorTo: yellow
sdk: docker
pinned: true
app_port: 3000
disable_embedding: true
short_description: Create your own AI comic with a single prompt
hf_oauth: true
hf_oauth_expiration_minutes: 43200
hf_oauth_scopes: [inference-api]
---

# AI Comic Factory

*(note: the website "aicomicfactory.com" is not affiliated with the AI Comic Factory project, nor it is created or maintained by the AI Comic Factory team. If you see their website has an issue, please contact them directly)*

## Running the project at home

First, I would like to highlight that everything is open-source (see [here](https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/tree/main), [here](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API/tree/main), [here](https://huggingface.co/spaces/hysts/SD-XL/tree/main), [here](https://github.com/huggingface/text-generation-inference)).

However the project isn't a monolithic Space that can be duplicated and ran immediately:
it requires various components to run for the frontend, backend, LLM, SDXL etc.

If you try to duplicate the project, open the `.env` you will see it requires some variables.

Provider config:
- `LLM_ENGINE`: can be one of: "INFERENCE_API", "INFERENCE_ENDPOINT", "OPENAI", or "GROQ"
- `RENDERING_ENGINE`: can be one of: "INFERENCE_API", "INFERENCE_ENDPOINT", "REPLICATE", "VIDEOCHAIN", "OPENAI" for now, unless you code your custom solution

Auth config:
- `AUTH_HF_API_TOKEN`:  if you decide to use Hugging Face for the LLM engine (inference api model or a custom inference endpoint)
- `AUTH_OPENAI_API_KEY`: to use OpenAI for the LLM engine
- `AUTH_GROQ_API_KEY`: to use Groq for the LLM engine
- `AUTH_VIDEOCHAIN_API_TOKEN`: secret token to access the VideoChain API server
- `AUTH_REPLICATE_API_TOKEN`: in case you want to use Replicate.com

Rendering config:
- `RENDERING_HF_INFERENCE_ENDPOINT_URL`: necessary if you decide to use a custom inference endpoint
- `RENDERING_REPLICATE_API_MODEL_VERSION`: url to the VideoChain API server
- `RENDERING_HF_INFERENCE_ENDPOINT_URL`: optional, default to nothing
- `RENDERING_HF_INFERENCE_API_BASE_MODEL`: optional, defaults to "stabilityai/stable-diffusion-xl-base-1.0"
- `RENDERING_HF_INFERENCE_API_REFINER_MODEL`: optional, defaults to "stabilityai/stable-diffusion-xl-refiner-1.0"
- `RENDERING_REPLICATE_API_MODEL`: optional, defaults to "stabilityai/sdxl"
- `RENDERING_REPLICATE_API_MODEL_VERSION`: optional, in case you want to change the version

Language model config (depending on the LLM engine you decide to use):
- `LLM_HF_INFERENCE_ENDPOINT_URL`: "<use your own>"
- `LLM_HF_INFERENCE_API_MODEL`: "HuggingFaceH4/zephyr-7b-beta"
- `LLM_OPENAI_API_BASE_URL`: "https://api.openai.com/v1"
- `LLM_OPENAI_API_MODEL`: "gpt-4"
- `LLM_GROQ_API_MODEL`: "mixtral-8x7b-32768"

In addition, there are some community sharing variables that you can just ignore.
Those variables are not required to run the AI Comic Factory on your own website or computer
(they are meant to create a connection with the Hugging Face community,
and thus only make sense for official Hugging Face apps):
- `NEXT_PUBLIC_ENABLE_COMMUNITY_SHARING`: you don't need this
- `COMMUNITY_API_URL`: you don't need this
- `COMMUNITY_API_TOKEN`: you don't need this
- `COMMUNITY_API_ID`: you don't need this

Please read the `.env` default config file for more informations.
To customise a variable locally, you should create a `.env.local`
(do not commit this file as it will contain your secrets).

-> If you intend to run it with local, cloud-hosted and/or proprietary models **you are going to need to code 👨‍💻**.

## The LLM API (Large Language Model)

Currently the AI Comic Factory uses [zephyr-7b-beta](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta) through an [Inference Endpoint](https://huggingface.co/docs/inference-endpoints/index).

You have three options:

### Option 1: Use an Inference API model

This is a new option added recently, where you can use one of the models from the Hugging Face Hub. By default we suggest to use [zephyr-7b-beta](https://huggingface.co/HuggingFaceH4/zephyr-7b-beta) as it will provide better results than the 7b model.

To activate it, create a `.env.local` configuration file:

```bash
LLM_ENGINE="INFERENCE_API"

HF_API_TOKEN="Your Hugging Face token"

# "HuggingFaceH4/zephyr-7b-beta" is used by default, but you can change this
# note: You should use a model able to generate JSON responses,
# so it is storngly suggested to use at least the 34b model
HF_INFERENCE_API_MODEL="HuggingFaceH4/zephyr-7b-beta"
```

### Option 2: Use an Inference Endpoint URL

If you would like to run the AI Comic Factory on a private LLM running on the Hugging Face Inference Endpoint service, create a `.env.local` configuration file:

```bash
LLM_ENGINE="INFERENCE_ENDPOINT"

HF_API_TOKEN="Your Hugging Face token"

HF_INFERENCE_ENDPOINT_URL="path to your inference endpoint url"
```

To run this kind of LLM locally, you can use [TGI](https://github.com/huggingface/text-generation-inference) (Please read [this post](https://github.com/huggingface/text-generation-inference/issues/726) for more information about the licensing).

### Option 3: Use an OpenAI API Key

This is a new option added recently, where you can use OpenAI API with an OpenAI API Key.

To activate it, create a `.env.local` configuration file:

```bash
LLM_ENGINE="OPENAI"

# default openai api base url is: https://api.openai.com/v1
LLM_OPENAI_API_BASE_URL="A custom OpenAI API Base URL if you have some special privileges"

LLM_OPENAI_API_MODEL="gpt-3.5-turbo"

AUTH_OPENAI_API_KEY="Yourown OpenAI API Key"
```
### Option 4: (new, experimental) use Groq

```bash
LLM_ENGINE="GROQ"

LLM_GROQ_API_MODEL="mixtral-8x7b-32768"

AUTH_GROQ_API_KEY="Your own GROQ API Key"
```

### Option 5: Fork and modify the code to use a different LLM system

Another option could be to disable the LLM completely and replace it with another LLM protocol and/or provider (eg. Claude, Replicate), or a human-generated story instead (by returning mock or static data).

### Notes

It is possible that I modify the AI Comic Factory to make it easier in the future (eg. add support for Claude or Replicate)

## The Rendering API

This API is used to generate the panel images. This is an API I created for my various projects at Hugging Face.

I haven't written documentation for it yet, but basically it is "just a wrapper ™" around other existing APIs:

- The [hysts/SD-XL](https://huggingface.co/spaces/hysts/SD-XL?duplicate=true) Space by [@hysts](https://huggingface.co/hysts)
- And other APIs for making videos, adding audio etc.. but you won't need them for the AI Comic Factory

### Option 1: Deploy VideoChain yourself

You will have to [clone](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API?duplicate=true) the [source-code](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API/tree/main)

Unfortunately, I haven't had the time to write the documentation for VideoChain yet.
(When I do I will update this document to point to the VideoChain's README)


### Option 2: Use Replicate

To use Replicate, create a `.env.local` configuration file:

```bash
RENDERING_ENGINE="REPLICATE"

RENDERING_REPLICATE_API_MODEL="stabilityai/sdxl"

RENDERING_REPLICATE_API_MODEL_VERSION="da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf"

AUTH_REPLICATE_API_TOKEN="Your Replicate token"
```

### Option 3: Use another SDXL API

If you fork the project you will be able to modify the code to use the Stable Diffusion technology of your choice (local, open-source, proprietary, your custom HF Space etc).

It would even be something else, such as Dall-E.
