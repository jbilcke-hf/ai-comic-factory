"use client"

import { useEffect, useState, useTransition } from "react"

import { getDynamicConfig } from "@/app/queries/getDynamicConfig"
import { DynamicConfig } from "@/types"

import { getDefaultDynamicConfig } from "./getDefaultDynamicConfig"

export function useDynamicConfig(): {
  config: DynamicConfig;
  isConfigReady: boolean;
} {
  const [_isPending, startTransition] = useTransition()
  const [config, setConfig] = useState<DynamicConfig>(getDefaultDynamicConfig())
  const [isConfigReady, setConfigReady] = useState(false)

  useEffect(() => {
    startTransition(async () => {
      if (isConfigReady) { return }
      const newConfig = await getDynamicConfig()
      setConfig(newConfig)
      setConfigReady(true)
    })
  }, [isConfigReady])

  return {
    config,
    isConfigReady
  }
}
