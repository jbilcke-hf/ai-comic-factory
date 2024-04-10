"use server"

import { ComponentProps } from "react"
import Head from "next/head"
import Script from "next/script"

import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import Main from "./main"

// import { Maintenance } from "./interface/maintenance"

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 

export default async function IndexPage() {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=5.0, minimum-scale=0.86" />
      </Head>
      <main className={cn(
        `light fixed inset-0 w-screen h-screen flex flex-col items-center`,
         `bg-zinc-50 text-stone-900 overflow-y-scroll`,

         // important: in "print" mode we need to allow going out of the screen
         `inset-auto print:h-auto print:w-auto print:overflow-visible print:relative print:flex-none`
        )}>
        <TooltipProvider delayDuration={100}>
          
          <Main />

         {/*

         to display a maintenance page, hide <Main /> and uncomment this unstead:
         
              <Maintenance />

         */}

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