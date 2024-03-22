"use client"

import dynamic from "next/dynamic";

export const SignUpCTA = dynamic(() => import("./sign-up-cta"), {
  // Make sure we turn SSR off
  ssr: false,
});
