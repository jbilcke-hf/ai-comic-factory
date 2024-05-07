"use client"

import Image from "next/image"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LayoutName, allLayoutLabels, defaultLayout, layoutIcons } from "@/app/layouts"

export function SelectLayout({
  defaultValue = defaultLayout,
  onLayoutChange,
  disabled = false,
  layouts = [],
}: {
  defaultValue?: string | undefined
  onLayoutChange?: ((name: LayoutName) => void)
  disabled?: boolean
  layouts: string[]
}) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(name) => { onLayoutChange?.(name as LayoutName) }}
      disabled={disabled}
      >
      <SelectTrigger className="flex-grow bg-gray-100 text-gray-700 dark:bg-gray-100 dark:text-gray-700">
        <SelectValue className="text-2xs md:text-sm" placeholder="Layout" />
      </SelectTrigger>
      <SelectContent>
        {layouts.map(key =>
          <SelectItem key={key} value={key} className="w-full">
            <div className="space-x-6 flex flex-row items-center justify-between">
              <div className="flex">{
                (allLayoutLabels as any)[key]
              }</div>
           
              {(layoutIcons as any)[key]
                ? <Image
                    className="rounded-sm opacity-75"
                    src={(layoutIcons as any)[key]}
                    width={20}
                    height={18}
                    alt={key}
                /> : null}
            </div>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}