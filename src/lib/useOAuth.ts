"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { OAuthResult, oauthHandleRedirectIfPresent, oauthLoginUrl } from "@huggingface/hub"

import { usePersistedOAuth } from "./usePersistedOAuth"
import { getValidOAuth } from "./getValidOAuth"
import { useDynamicConfig } from "./useDynamicConfig"

export function useOAuth({
  debug = false
}: {
  debug?: boolean
} = {
  debug: false
}): {
  clientId: string
  redirectUrl: string
  scopes: string
  canLogin: boolean
  login: () => Promise<void>
  isLoggedIn: boolean
  enableOAuth: boolean
  enableOAuthWall: boolean
  oauthResult?: OAuthResult
 } {
  const { config, isConfigReady } = useDynamicConfig()

  const [oauthResult, setOAuthResult] = usePersistedOAuth()

  const clientId = config.oauthClientId
  const redirectUrl = config.oauthRedirectUrl
  const scopes = config.oauthScopes
  const enableOAuth = config.enableHuggingFaceOAuth
  const enableOAuthWall = config.enableHuggingFaceOAuthWall

  const searchParams = useSearchParams()
  const code = searchParams?.get("code") || ""
  const state = searchParams?.get("state") || ""

  const hasReceivedFreshOAuth = Boolean(code && state)

  const canLogin: boolean = Boolean(isConfigReady && clientId && enableOAuth)
  const isLoggedIn = Boolean(oauthResult)

  if (debug) {
    console.log("useOAuth debug:", {
      oauthResult,
      clientId,
      redirectUrl,
      scopes,
      enableOAuth,
      enableOAuthWall,
      code,
      state,
      hasReceivedFreshOAuth,
      canLogin,
      isLoggedIn,
    })

    /*
    useOAuth debug: {
      oauthResult: '',
      clientId: '........',
      redirectUrl: 'http://localhost:3000',
      scopes: 'openid profile inference-api',
      isOAuthEnabled: true,
      code: '...........',
      state: '{"nonce":".........","redirectUri":"http://localhost:3000"}',
      hasReceivedFreshOAuth: true,
      canLogin: false,
      isLoggedIn: false
    }
    */
  }

  useEffect(() => {
    // no need to perfor the rest if the operation is there is nothing in the url
    if (hasReceivedFreshOAuth) {

      (async () => {
        const maybeValidOAuth = await oauthHandleRedirectIfPresent()

        const newOAuth = getValidOAuth(maybeValidOAuth)

        if (!newOAuth) {
          if (debug) {
            console.log("useOAuth::useEffect 1: got something in the url but no valid oauth data to show.. something went terribly wrong")
          }
        } else {
          if (debug) {
            console.log("useOAuth::useEffect 1: correctly received the new oauth result, saving it to local storage:", newOAuth)
          }
          setOAuthResult(newOAuth)

          // once set we can (brutally) reload the page
          window.location.href = `//${window.location.host}${window.location.pathname}`
        }
      })()
    }
  }, [debug, hasReceivedFreshOAuth])

  // for debugging purpose
  useEffect(() => {
    if (!debug) {
      return
    }
    console.log(`useOAuth::useEffect 2: canLogin? ${canLogin}`)
    if (!canLogin) {
      return
    }
    console.log(`useOAuth::useEffect2: isLoggedIn? ${isLoggedIn}`)
    if (!isLoggedIn) {
      return
    }
    console.log(`useOAuth::useEffect 2: oauthResult:`, oauthResult)
  }, [debug, canLogin, isLoggedIn, oauthResult])

  const login = async () => {
    window.location.href = await oauthLoginUrl({
      clientId,
      redirectUrl,
      scopes,
    })
  }

  return {
    clientId,
    redirectUrl,
    scopes,
    canLogin,
    login,
    isLoggedIn,
    enableOAuth,
    enableOAuthWall,
    oauthResult
  }
}
