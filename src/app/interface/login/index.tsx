"use client"

import dynamic from "next/dynamic";

export const Login = dynamic(() => import("./login"), {
  // Make sure we turn SSR off
  ssr: false,
});
