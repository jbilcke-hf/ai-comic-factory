"use server"

import { v4 as uuidv4 } from "uuid"

import { CreatePostResponse, GetAppPostsResponse, Post, PostVisibility } from "@/types"
import { filterOutBadWords } from "./censorship"

const apiUrl = `${process.env.COMMUNITY_API_URL || ""}`
const apiToken = `${process.env.COMMUNITY_API_TOKEN || ""}`
const appId = `${process.env.COMMUNITY_API_ID || ""}`

export async function postToCommunity({
  prompt,
  assetUrl,
}: {
  prompt: string
  assetUrl: string
}): Promise<Post> {

  prompt = filterOutBadWords(prompt)

  // if the community API is disabled,
  // we don't fail, we just mock
  if (!apiUrl) {
    const mockPost: Post = {
      postId: uuidv4(),
      appId: "mock",
      prompt,
      previewUrl: assetUrl,
      assetUrl,
      createdAt: new Date().toISOString(),
      visibility: "normal",
      upvotes: 0,
      downvotes: 0
    }
    return mockPost
  }

  if (!prompt) {
    console.error(`cannot call the community API without a prompt, aborting..`)
    throw new Error(`cannot call the community API without a prompt, aborting..`)
  }
  if (!assetUrl) {
    console.error(`cannot call the community API without an assetUrl, aborting..`)
    throw new Error(`cannot call the community API without an assetUrl, aborting..`)
  }

  try {
    console.log(`calling POST ${apiUrl}/posts/${appId} with prompt: ${prompt}`)

    const postId = uuidv4()

    const post: Partial<Post> = { postId, appId, prompt, assetUrl }

    console.table(post)

    const res = await fetch(`${apiUrl}/posts/${appId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(post),
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
    
    const response = (await res.json()) as CreatePostResponse
    // console.log("response:", response)
    return response.post
  } catch (err) {
    const error = `failed to post to community: ${err}`
    console.error(error)
    throw new Error(error)
  }
}

export async function getLatestPosts(visibility?: PostVisibility): Promise<Post[]> {

  let posts: Post[] = []

  // if the community API is disabled we don't fail,
  // we just mock
  if (!apiUrl) {
    return posts
  }

  try {
    // console.log(`calling GET ${apiUrl}/posts with renderId: ${renderId}`)
    const res = await fetch(`${apiUrl}/posts/${appId}/${
      visibility || "all"
    }`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
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
    
    const response = (await res.json()) as GetAppPostsResponse
    // console.log("response:", response)
    return Array.isArray(response?.posts) ? response?.posts : []
  } catch (err) {
    // const error = `failed to get posts: ${err}`
    // console.error(error)
    // throw new Error(error)
    return []
  }
}