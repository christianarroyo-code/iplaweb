"use client"

import { GlobeLive } from "@/components/ui/cobe-globe-live"

const iplaOffices = [
  { id: "castellon", location: [39.9439, -0.0629] as [number, number], label: "IPLA Castellón (Sede Central)" },
  { id: "canarias", location: [28.42, -16.285] as [number, number], label: "IPLA Canarias" },
  { id: "chile", location: [-34.4421, -70.9441] as [number, number], label: "IPLA Chile" },
]

const partnerCountries = [
  { id: "us", location: [39.83, -98.58] as [number, number] },
  { id: "mx", location: [23.63, -102.55] as [number, number] },
  { id: "pe", location: [-9.19, -75.02] as [number, number] },
  { id: "pt", location: [39.4, -8.22] as [number, number] },
  { id: "fr", location: [46.23, 2.21] as [number, number] },
  { id: "gb", location: [55.38, -3.44] as [number, number] },
  { id: "ie", location: [53.41, -8.24] as [number, number] },
  { id: "be", location: [50.5, 4.47] as [number, number] },
  { id: "nl", location: [52.13, 5.29] as [number, number] },
  { id: "de", location: [51.17, 10.45] as [number, number] },
  { id: "fi", location: [61.92, 25.75] as [number, number] },
  { id: "tr", location: [38.96, 35.24] as [number, number] },
  { id: "au", location: [-25.27, 133.78] as [number, number] },
]

export default function GlobeLiveDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-white p-8 overflow-hidden">
      <div className="w-full max-w-lg">
        <GlobeLive markers={[...iplaOffices, ...partnerCountries]} />
      </div>
    </div>
  )
}
