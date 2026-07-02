"use client"

import { GlobeLive } from "@/components/ui/globe-live"

export default function GlobeLiveDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white p-8 overflow-hidden">
      <div className="w-full max-w-4xl">
        <GlobeLive />
      </div>
    </div>
  )
}
