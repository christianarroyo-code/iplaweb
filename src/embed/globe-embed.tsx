import { createRoot } from "react-dom/client"
import { GlobeLive } from "../components/ui/cobe-globe-live"
import "./globe-embed.css"

const iplaOffices = [
  { id: "castellon", location: [39.9439, -0.0629] as [number, number], label: "IPLA Castellón (Sede Central)" },
  { id: "canarias", location: [28.42, -16.285] as [number, number], label: "IPLA Canarias" },
  { id: "chile", location: [-34.4421, -70.9441] as [number, number], label: "IPLA Chile" },
]

function mount() {
  const el = document.getElementById("ipla-globe")
  if (!el) return
  createRoot(el).render(<GlobeLive markers={iplaOffices} />)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount)
} else {
  mount()
}
