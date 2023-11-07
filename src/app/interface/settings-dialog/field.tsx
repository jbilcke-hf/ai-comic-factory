import { ReactNode } from "react"

export function Field({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-2">{children}</div>
  )
}