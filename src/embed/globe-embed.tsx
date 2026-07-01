import { createRoot } from "react-dom/client"
import { GlobeLive } from "../components/ui/globe-live"
import "./globe-embed.css"

function mount() {
  const el = document.getElementById("ipla-globe")
  if (!el) return
  createRoot(el).render(<GlobeLive />)
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount)
} else {
  mount()
}
