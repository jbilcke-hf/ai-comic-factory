"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useOAuth } from "@/lib/useOAuth"

export function Login() {
  const { canLogin, login, isLoggedIn, oauthResult } = useOAuth({ debug: true })
  
  useEffect(() => {
    if (!oauthResult) {
      return
    }

    const { userInfo } = oauthResult

    // TODO use the Inference API

    if (userInfo.isPro) {
      // TODO we could do something with the fact the user is PRO versus other types of users
    }
  }, [canLogin, isLoggedIn, oauthResult])

  if (isLoggedIn || canLogin) {
   return <Button onClick={login}>Sign-in with Hugging Face</Button>
  } else {
    return null
  }
}