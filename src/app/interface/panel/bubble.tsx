import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Bubble({
  children,
  className
}: {
  children?: ReactNode
  className?: string
}) {

  if (!children) {
    return null
  }

  return (
    <div>
      <div className={cn(
        `relative w-[300px] p-6 rounded-[40px]`,
        `bg-white`,
        `text-lg leading-6 text-center text-zinc-800`,

        // BEFORE ELEMENT
        `before:content-[""] before:w-0 before:h-0 before:absolute`,
        `before:border-l-[24px] before:border-l-white`,
        `before:border-r-[12px] before:border-r-transparent`,
        `before:border-t-[12px] before:border-t-white`,
        `before:border-b-[20px] before:border-b-transparent`,
        `before:border-solid before:left-8 before:-bottom-6`,
        // `before:border-radius`,
        `shadow-lg`,
        className
      )}>
        <div
          className={cn(
            ``
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}