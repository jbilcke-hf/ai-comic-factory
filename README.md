---
title: AI Comic Factory
emoji: 👩‍🎨
colorFrom: red
colorTo: yellow
sdk: docker
pinned: true
app_port: 3000
---

# AI Comic Factory

## Running the project at home

First, I would like to highlight that everything is open-source (see [here](https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/tree/main), [here](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API/tree/main), [here](https://huggingface.co/spaces/hysts/SD-XL/tree/main), [here](https://github.com/huggingface/text-generation-inference)).

However the project isn't a monolithic Space that can be duplicated and ran immediately:
it requires various components to run for the frontend, backend, LLM, SDXL etc.

If you try to duplicate the project, you will see it requires some variables:

- `HF_INFERENCE_ENDPOINT_URL`: This is the endpoint to call the LLM 
- `HF_API_TOKEN`: The Hugging Face token used to call the inference endpoint (if you intent to use a LLM hosted on Hugging Face)
- `RENDERING_ENGINE_API`: This is the API that generates images
- `VC_SECRET_ACCESS_TOKEN`: Token used to call the rendering engine API (not used yet, but it's gonna be because [💸](https://en.wikipedia.org/wiki/No_such_thing_as_a_free_lunch))

This is the architecture for the current production AI Comic Factory.

-> If you intend to run it with local, cloud-hosted and/or proprietary models **you are going to need to code 👨‍💻**.

## The LLM API (Large Language Model)

Currently the AI Comic Factory uses [Llama-2 70b](https://huggingface.co/blog/llama2) through an [Inference Endpoint](https://huggingface.co/docs/inference-endpoints/index).

You have two options:

## Option 1: Fork and modify the code to use another LLM

If you fork the AI Comic Factory, you will be able to use another API and model, such as a locally-running Llama 7b.

To run the LLM locally, you can use [TGI](https://github.com/huggingface/text-generation-inference) (Please read [this post](https://github.com/huggingface/text-generation-inference/issues/726) for more information about licensing).

## Option 2: Fork and modify the code to use human content instead

Another option could be to disable the LLM completely and replace it with a human-generated story instead (by returning mock or static data).

## Notes

It is possible that I modify the AI Comic Factory to make it easier in the future (eg. add support for OpenAI or Replicate)

## The Rendering API

This API is used to generate the panel images. This is an API I created for my various projects at Hugging Face.

I haven't written documentation for it yet, but basically it is "just a wrapper ™" around other existing APIs:

- The [hysts/SD-XL](https://huggingface.co/spaces/hysts/SD-XL?duplicate=true) Space by [@hysts](https://huggingface.co/hysts)
- And other APIs for making videos, adding audio etc.. but you won't need them for the AI Comic Factory

### Option 1: Deploy VideoChain yourself

You will have to [clone](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API?duplicate=true) the [source-code](https://huggingface.co/spaces/jbilcke-hf/VideoChain-API/tree/main)

Unfortunately, I haven't had the time to write the documentation for VideoChain yet.
(When I do I will update this document to point to the VideoChain's README)

### Option 2: Use another SDXL API

If you fork the project you will be able to modify the code to use the Stable Diffusion technology of your choice (local, open-source, your custom HF Space etc)

## Notes

It is possible that I modify the AI Comic Factory to make it easier in the future (eg. add support for Replicate)
