"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface LiveMarker {
  id: string
  location: [number, number]
  label?: string
}

interface GlobeLiveProps {
  markers?: LiveMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: LiveMarker[] = [
  { id: "sf", location: [37.78, -122.44], label: "San Francisco" },
  { id: "london", location: [51.51, -0.13], label: "London" },
  { id: "tokyo", location: [35.68, 139.65], label: "Tokyo" },
  { id: "paris", location: [48.86, 2.35], label: "Paris" },
  { id: "sydney", location: [-33.87, 151.21], label: "Sydney" },
  { id: "nyc", location: [40.71, -74.01], label: "New York" },
]

export function GlobeLive({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width, height: width,
      phi: 0, theta: 0.2, dark: 0, diffuse: 1.5,
      mapSamples: 16000, mapBrightness: 10,
      baseColor: [0.95, 0.95, 0.95],
      markerColor: [0.667, 0.094, 0.173],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0.01,
      markers: markers.map((m) => ({ location: m.location, size: 0.02, id: m.id })),
      arcs: [], arcColor: [0.9, 0.3, 0.3],
      arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
    })
    function animate() {
      if (!isPausedRef.current) phi += speed
      globe!.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      })
      animationId = requestAnimationFrame(animate)
    }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {markers.filter((m) => m.label).map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.6rem",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.4s, filter 0.4s",
          }}
        >
          <span style={{
            width: 8, height: 8, background: "#AA182C", borderRadius: "50%",
            boxShadow: "0 0 8px #AA182C",
            animation: "marker-pulse 1.5s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 600,
            color: "#ffffff",
          }}>{m.label}</span>
        </div>
      ))}
    </div>
  )
}
