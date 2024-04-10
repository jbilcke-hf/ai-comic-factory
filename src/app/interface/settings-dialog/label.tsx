import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Label({ className, children }: {
  className?: string
  children: ReactNode
}) {
  return (
    <label className={cn(
      `text-base font-semibold text-zinc-700`,
      className
    )}>{children}</label>
  )
}