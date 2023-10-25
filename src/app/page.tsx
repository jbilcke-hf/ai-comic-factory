"use server"

import Head from "next/head"

import Main from "./main"
import { TooltipProvider } from "@/components/ui/tooltip"
import Script from "next/script"
import { cn } from "@/lib/utils"
import { fonts } from "@/lib/fonts"

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
          
          {/*<Main />*/}
          
          <div className="z-20 fixed inset-0 w-screen h-screen bg-white text-stone-800 flex flex-col items-center justify-center">
            <div className={cn(
              fonts.actionman.className,
              "text-center"
            )}>
              <p className="text-4xl">🚧 Maintenance in progress 🚧</p>
              <p className="text-3xl mt-12 mb-8">See the <a
                href="https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory/discussions/339"
                className="underline text-yellow-500"
                >announcement here</a> <img src="/quick-and-dirty-emoji.png" className="inline w-10 h-10"></img></p>
              <p className="text-2xl">This shouldn&apos;t last long, so stay tuned!</p>
            </div>
          </div>
        </TooltipProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=GTM-WH4MGSHS" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
    
            gtag('config', 'GTM-WH4MGSHS');
          `}
        </Script>
      </main>
    </>
  )
}