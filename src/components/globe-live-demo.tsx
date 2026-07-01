"use client"

import { GlobeLive } from "@/components/ui/cobe-globe-live"

const iplaOffices = [
  { id: "castellon", location: [39.9439, -0.0629] as [number, number], label: "IPLA Castellón (Sede Central)" },
  { id: "canarias", location: [28.42, -16.285] as [number, number], label: "IPLA Canarias" },
  { id: "chile", location: [-34.4421, -70.9441] as [number, number], label: "IPLA Chile" },
]

export default function GlobeLiveDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white p-8 overflow-hidden">
      <div className="w-full max-w-lg">
        <GlobeLive markers={iplaOffices} />
      </div>
    </div>
  )
}
