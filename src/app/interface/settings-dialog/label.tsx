import { ReactNode } from "react"

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-base font-semibold text-zinc-700">{children}</label>
  )
}