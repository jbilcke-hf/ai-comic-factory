"use server"

import Head from "next/head"

import Main from "./main"
import { TooltipProvider } from "@/components/ui/tooltip"

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 

export default async function IndexPage({ params: { ownerId } }: { params: { ownerId: string }}) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <main className={
        `light fixed inset-0 w-screen h-screen flex flex-col items-center
         bg-zinc-50 text-stone-900 overflow-y-scroll
        `}>
        <TooltipProvider delayDuration={100}>
          <Main />
        </TooltipProvider>
      </main>
    </>
  )
}