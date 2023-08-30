import { useEffect, useRef, useState } from "react"

import { ProgressBar } from "./progress-bar"
import { cn } from "@/lib/utils"

export function Progress({
  isLoading,
  resetKey = "", // when this key change, this will re-spawn the progress bar
  className = "",
}: {
  isLoading: boolean
  resetKey?: string
  className?: string
}) {
  const timeoutRef = useRef<any>()
  const [progressPercent, setProcessPercent] = useState(0)
  const progressRef = useRef(0)
  const isLoadingRef = useRef(isLoading)

  const updateProgressBar = () => {
    const duration = 1000 // 1 sec
    const frequency = 200 // 200ms
    const nbUpdatesPerSec = duration / frequency // 5x per second

    // normally it takes 45, and we will try to go below,
    // but to be safe let's set the counter a 1 min
    const nbSeconds = 80 // 1 min
    const amountInPercent =  100 / (nbUpdatesPerSec * nbSeconds) // 0.333

    progressRef.current = Math.min(100, progressRef.current + amountInPercent)
    setProcessPercent(progressRef.current)
  }

  useEffect(() => {
    clearInterval(timeoutRef.current)
    isLoadingRef.current = isLoading
    progressRef.current = 0
    setProcessPercent(0)
    if (isLoading) {
      timeoutRef.current = setInterval(updateProgressBar, 200)
    }
  }, [isLoading, resetKey])

  return (
    <div className={cn(
      `flex w-10 h-10`,
      `animation-all duration-300 text-md`,
      isLoading
        ? `scale-100 opacity-100`
        : `scale-0 opacity-0`,
      className
    )}>
      <ProgressBar progressPercentage={progressPercent} />
    </div>
  )
}