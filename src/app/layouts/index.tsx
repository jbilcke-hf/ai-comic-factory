"use client"

import { Panel } from "@/app/interface/panel"
import { pick } from "@/lib/pick"
import { Grid } from "@/app/interface/grid"

export function Layout0() {
  return (
    <Grid className="grid-cols-2 grid-rows-2">
      <div className="bg-stone-100 col-span-1 row-span-1">
        <Panel
          panel={0}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100  col-span-1 row-span-1">
        <Panel
          panel={1}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-gray-100  col-span-1 row-span-1">
        <Panel
          panel={2}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 col-span-1 row-span-1">
        <Panel
          panel={3}
          width={1024}
          height={1024}
        />
      </div>
    </Grid>
  )
}

export function Layout1() {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-stone-100">
        <Panel
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          panel={2}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout2_todo() {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-gray-100 row-span-3 col-span-1">
        <Panel
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          panel={1}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          panel={2}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-1 col-span-1">
        <Panel
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout3_todo() {
  return (
    <Grid className="grid-cols-5 grid-rows-2">
      <div className="bg-zinc-100 col-span-3">
        <Panel
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 col-span-2 row-span-2">
        <Panel
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 gap-2">
        <div className="bg-stone-100">
          <Panel
            panel={2}
            width={768}
            height={758}
          />
        </div>
        <div className="bg-slate-100">
          <Panel
            panel={3}
            width={768}
            height={758}
          />
        </div>
      </div>
    </Grid>
  )
}

export function Layout4_todo() {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-slate-100 row-span-2">
        <Panel
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-gray-100 row-span-1 col-span-1">
        <Panel
          panel={1}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          panel={2}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          panel={3}
          width={768}
          height={1024}
        />
      </div>
    </Grid>
  )
}


export function Layout2() {
  return (
    <Grid className="grid-cols-3 grid-rows-2">
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-stone-100 row-span-2 col-span-1">
        <Panel
          panel={2}
          width={512}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 row-span-1 col-span-2">
        <Panel
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout3() {
  return (
    <Grid className="grid-cols-3 grid-rows-2">
      <div className="bg-zinc-100 col-span-2 row-span-1">
        <Panel
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-stone-100 row-span-1 col-span-1">
        <Panel
          panel={2}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 row-span-1 col-span-2">
        <Panel
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

// export const layouts = { Layout1, Layout2_todo, Layout3_todo, Layout4_todo, Layout2, Layout3 }
export const allLayouts = {
  random: <></>,
  Layout0,
  Layout1,
  Layout2,
  Layout3 
}

export const allLayoutLabels = {
  random: "Random layout",
  Layout0: "Layout 0",
  Layout1: "Layout 1",
  Layout2: "Layout 2",
  Layout3: "Layout 3",
}

export type LayoutName = keyof typeof allLayouts 

export const defaultLayout: LayoutName = "random"

export type LayoutCategory = "square" | "fluid"

export const nonRandomLayouts = Object.keys(allLayouts).filter(layout => layout !== "random")

export const getRandomLayoutName = (): LayoutName => {
  return pick(nonRandomLayouts) as LayoutName
}

export function getRandomLayoutNames(): LayoutName[] {
  return nonRandomLayouts.sort(() => Math.random() - 0.5) as LayoutName[]
}

