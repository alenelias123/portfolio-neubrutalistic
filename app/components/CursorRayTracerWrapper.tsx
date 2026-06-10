"use client";

import dynamic from "next/dynamic";

const CursorRayTracer = dynamic(() => import("./CursorRayTracer"), {
  ssr: false,
});

export default function CursorRayTracerWrapper() {
  return <CursorRayTracer />;
}
