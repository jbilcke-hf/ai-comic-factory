import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SectionTitle({ className, children }: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn(
      `flex flex-col items-center justify-center`,
      `mt-6 pt-4 pb-1 w-full`,
      `border-t border-t-stone-400`,
      `text-xl font-semibold text-zinc-900`,
      className
    )}>
    {children}
    </div>
  )
}
