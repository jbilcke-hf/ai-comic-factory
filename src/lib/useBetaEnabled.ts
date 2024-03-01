"use client"

import { useSearchParams } from "next/navigation"

export function useBetaEnabled(): boolean {
  const searchParams = useSearchParams()
  const isBetaEnabled = searchParams.get("beta") === "true"
  return isBetaEnabled
}