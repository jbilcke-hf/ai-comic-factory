import { ReactNode } from "react"

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-xl font-semibold text-zinc-700">{children}</label>
  )
}