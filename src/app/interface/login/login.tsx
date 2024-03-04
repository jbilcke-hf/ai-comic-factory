"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useOAuth } from "@/lib/useOAuth"

function Login() {
  const { login } = useOAuth({ debug: false })
  return <Button onClick={login}>Sign-in with Hugging Face</Button>
}

export default Login