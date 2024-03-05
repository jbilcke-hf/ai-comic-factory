"use client"

import { Panel } from "@/app/interface/panel"
import { pick } from "@/lib/pick"
import { Grid } from "@/app/interface/grid"
import { LayoutProps } from "@/types"

export function Layout0({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-2 grid-rows-2">
      <div className="bg-stone-100 col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100  col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-gray-100  col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={1024}
        />
      </div>
    </Grid>
  )
}

export function Layout1({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-stone-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-gray-100 row-span-2 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout2_todo({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-gray-100 row-span-3 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-1 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout3_todo({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-5 grid-rows-2">
      <div className="bg-zinc-100 col-span-3">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 col-span-2 row-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="col-span-3 grid grid-cols-2 gap-2">
        <div className="bg-stone-100">
          <Panel
            page={page}
            nbPanels={nbPanels}
            panel={2}
            width={768}
            height={758}
          />
        </div>
        <div className="bg-slate-100">
          <Panel
            page={page}
            nbPanels={nbPanels}
            panel={3}
            width={768}
            height={758}
          />
        </div>
      </div>
    </Grid>
  )
}

export function Layout4_todo({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-2 grid-rows-3">
      <div className="bg-slate-100 row-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-gray-100 row-span-1 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 row-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={768}
          height={1024}
        />
      </div>
    </Grid>
  )
}


export function Layout2({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-3 grid-rows-2">
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-stone-100 row-span-2 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={512}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 row-span-1 col-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

export function Layout3({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-3 grid-rows-2">
      <div className="bg-zinc-100 col-span-2 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-zinc-100 col-span-1 row-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-stone-100 row-span-1 col-span-1">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 row-span-1 col-span-2">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={768}
        />
      </div>
    </Grid>
  )
}

// squares + vertical
export function Layout4({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-8 grid-rows-8">
      <div className="bg-zinc-100 col-start-1 col-end-7 row-start-1 row-end-3">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={512}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100 col-start-3 col-end-9 row-start-3 row-end-4">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={1024}
          height={768}
        />
      </div>
      <div className="bg-stone-100 col-start-2 col-end-8 row-start-4 row-end-6">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={768}
          height={1024}
        />
      </div>
      <div className="bg-slate-100 col-start-1 col-end-9 row-start-6 row-end-8">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={512}
        />
      </div>
    </Grid>
  )
}

// squares + horizontal
export function Layout5({ page, nbPanels }: LayoutProps) {
  return (
    <Grid className="grid-cols-4 grid-rows-4">
      <div className="bg-zinc-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={0}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-zinc-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={1}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-stone-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={2}
          width={1024}
          height={1024}
        />
      </div>
      <div className="bg-slate-100">
        <Panel
          page={page}
          nbPanels={nbPanels}
          panel={3}
          width={1024}
          height={1024}
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
  Layout3,
  Layout4
}

export const allLayoutLabels = {
  random: "Random layout",
  Layout0: "Grid 0",
  Layout1: "Grid 1",
  Layout2: "Grid 2",
  Layout3: "Grid 3",
  // Layout4: "Blocks 1",
}

// note for reference: A4 (297mm x 210mm)
export const allLayoutAspectRatios = {
  Layout0: "aspect-[250/297]",
  Layout1: "aspect-[250/297]",
  Layout2: "aspect-[250/297]",
  Layout3: "aspect-[250/297]",
  // Layout4: "aspect-[1/3]",
}

export type LayoutName = keyof typeof allLayouts 

export const defaultLayout: LayoutName = "Layout1"

export type LayoutCategory = "square" | "fluid"

export const nonRandomLayouts = Object.keys(allLayouts).filter(layout => layout !== "random")

export const getRandomLayoutName = (): LayoutName => {
  return pick(nonRandomLayouts) as LayoutName
}

export function getRandomLayoutNames(): LayoutName[] {
  return nonRandomLayouts.sort(() => Math.random() - 0.5) as LayoutName[]
}
