"use client"

import { useEffect, useRef } from "react"
import type { GlobeInstance } from "globe.gl"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import worldTopology from "world-atlas/countries-110m.json"

interface OfficeMarker {
  id: string
  location: [number, number]
  label: string
}

interface GlobeLiveProps {
  offices?: OfficeMarker[]
  highlightedCountries?: string[]
  countryColor?: string
  baseColor?: string
  className?: string
}

const defaultOffices: OfficeMarker[] = [
  { id: "castellon", location: [39.9439, -0.0629], label: "IPLA Castellón (Sede Central)" },
  { id: "canarias", location: [28.42, -16.285], label: "IPLA Canarias" },
  { id: "chile", location: [-34.4421, -70.9441], label: "IPLA Chile" },
]

const defaultHighlightedCountries = [
  "United States of America", "Mexico", "Peru", "Chile", "Spain", "Portugal",
  "France", "United Kingdom", "Ireland", "Belgium", "Netherlands", "Germany",
  "Finland", "Turkey", "Australia",
]

const PULSE_STYLE_ID = "ipla-globe-marker-pulse"

function ensurePulseKeyframes() {
  if (document.getElementById(PULSE_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = PULSE_STYLE_ID
  style.textContent = `
    @keyframes ipla-marker-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `
  document.head.appendChild(style)
}

function buildOfficeBadge(office: OfficeMarker, color: string) {
  ensurePulseKeyframes()
  // three-globe manages position/transform/display on the element it
  // receives directly, so the actual visual styling lives on a child
  // it never touches.
  const wrapper = document.createElement("div")
  wrapper.style.pointerEvents = "none"

  const badge = document.createElement("div")
  badge.style.cssText = `
    transform: translate(-50%, -130%);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.6rem;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    white-space: nowrap;
  `
  const dot = document.createElement("span")
  dot.style.cssText = `
    width: 8px;
    height: 8px;
    background: ${color};
    border-radius: 50%;
    box-shadow: 0 0 8px ${color};
    animation: ipla-marker-pulse 1.5s ease-in-out infinite;
    flex-shrink: 0;
  `
  const text = document.createElement("span")
  text.style.cssText = `
    font-family: system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    color: #ffffff;
  `
  text.textContent = office.label
  badge.appendChild(dot)
  badge.appendChild(text)
  wrapper.appendChild(badge)
  return wrapper
}

export function GlobeLive({
  offices = defaultOffices,
  highlightedCountries = defaultHighlightedCountries,
  countryColor = "#AA182C",
  baseColor = "#e7e7e7",
  className = "",
}: GlobeLiveProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    let world: GlobeInstance | undefined
    let ro: ResizeObserver | undefined
    let cancelled = false

    import("globe.gl").then(({ default: Globe }) => {
      if (cancelled) return
      const highlightSet = new Set(highlightedCountries)
      const topology = worldTopology as unknown as Topology
      const countries = feature(
        topology,
        topology.objects.countries as GeometryCollection
      ).features

      world = new Globe(el)
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(false)
        .polygonsData(countries)
        .polygonCapColor((d) =>
          highlightSet.has((d as GeoJSON.Feature).properties?.name)
            ? countryColor
            : baseColor
        )
        .polygonSideColor(() => "rgba(0, 0, 0, 0.05)")
        .polygonStrokeColor(() => "#ffffff")
        .polygonAltitude(0.006)
        .polygonsTransitionDuration(0)
        .pointsData(offices)
        .pointLat((d) => (d as OfficeMarker).location[0])
        .pointLng((d) => (d as OfficeMarker).location[1])
        .pointColor(() => countryColor)
        .pointAltitude(0.012)
        .pointRadius(0.35)
        .htmlElementsData(offices)
        .htmlLat((d) => (d as OfficeMarker).location[0])
        .htmlLng((d) => (d as OfficeMarker).location[1])
        .htmlAltitude(0.02)
        .htmlElement((d) => buildOfficeBadge(d as OfficeMarker, countryColor))

      const globeMaterial = world.globeMaterial() as { color?: { set: (c: string) => void } }
      globeMaterial.color?.set("#ffffff")

      world.controls().autoRotate = true
      world.controls().autoRotateSpeed = 0.6
      world.controls().enableZoom = false

      const resize = () => {
        const size = el.offsetWidth
        if (size > 0) world?.width(size).height(size)
      }
      resize()
      ro = new ResizeObserver(resize)
      ro.observe(el)
    })

    return () => {
      cancelled = true
      ro?.disconnect()
      world?._destructor()
    }
  }, [offices, highlightedCountries, countryColor, baseColor])

  return <div ref={containerRef} className={`relative aspect-square select-none ${className}`} />
}
