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

    Promise.all([import("globe.gl"), import("three")]).then(([{ default: Globe }, THREE]) => {
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
        .globeMaterial(new THREE.MeshPhongMaterial({ color: "#ffffff" }))
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
        .labelsData(offices)
        .labelLat((d) => (d as OfficeMarker).location[0])
        .labelLng((d) => (d as OfficeMarker).location[1])
        .labelText((d) => (d as OfficeMarker).label)
        .labelColor(() => "#1a1a1a")
        .labelSize(1.1)
        .labelDotRadius(0.35)
        .labelAltitude(0.012)
        .labelResolution(4)

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
