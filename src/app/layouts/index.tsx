import { Panel } from "@/app/interface/panel"
import { pick } from "@/lib/pick"
import { useStore } from "@/app/store"

export function Layout1() {
  return (
    <div
      // the "fixed" width ensure our comic keeps a consistent ratio
      className="grid grid-cols-2 grid-rows-3 gap-4 w-[1160px] h-screen">
      <div className="bg-stone-100">
        <Panel
          panel={0}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={1}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          panel={2}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          panel={3}
          width={1024}
          height={512}
        />
      </div>
    </div>
  )
}

export function Layout2() {
  return (
    <div
      // the "fixed" width ensure our comic keeps a consistent ratio
      className="grid grid-cols-2 grid-rows-3 gap-4 w-[1160px] h-screen">
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          panel={0}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          panel={1}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          panel={2}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={3}
          width={1024}
          height={1024}
        />
      </div>
    </div>
  )
}

export function Layout3() {
  return (
    <div
      // the "fixed" width ensure our comic keeps a consistent ratio
      className="grid grid-cols-2 grid-rows-3 gap-4 w-[1160px] h-screen">
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={0}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          panel={1}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          panel={2}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          panel={3}
          width={1024}
          height={1024}
        />
      </div>
    </div>
  )
}

export function Layout4() {
  return (
    <div
      // the "fixed" width ensure our comic keeps a consistent ratio
      className="grid grid-cols-2 grid-rows-3 gap-4 w-[1160px] h-screen">
      <div className="bg-slate-100">
        <Panel
          panel={0}
          width={1024}
          height={512}
        />
      </div>
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          panel={1}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={2}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          panel={3}
          width={1024}
          height={512}
        />
      </div>
    </div>
  )
}

export const layouts = { Layout1, Layout2, Layout3, Layout4 }

export type LayoutName = keyof typeof layouts 

export function getRandomLayoutName(): LayoutName {
  return pick(Object.keys(layouts) as LayoutName[]) as LayoutName
}

