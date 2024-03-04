"use client"

import dynamic from "next/dynamic";

export const BottomBar = dynamic(() => import("./bottom-bar"), {
  // Make sure we turn SSR off
  ssr: false,
});
