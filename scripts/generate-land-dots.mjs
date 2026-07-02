import { writeFileSync } from "node:fs"
import { geoContains } from "d3-geo"
import { feature } from "topojson-client"
import worldLand from "world-atlas/land-110m.json" with { type: "json" }

const LAND_DOT_SAMPLES = 16000

function fibonacciSpherePoints(count) {
  const points = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * i
    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY
    const lat = (Math.asin(y) * 180) / Math.PI
    const lng = (Math.atan2(z, x) * 180) / Math.PI
    points.push([lat, lng])
  }
  return points
}

const landGeo = feature(worldLand, worldLand.objects.land)

const landDots = fibonacciSpherePoints(LAND_DOT_SAMPLES).filter(([lat, lng]) =>
  geoContains(landGeo, [lng, lat])
)

writeFileSync("src/data/land-dots.json", JSON.stringify(landDots))
console.log(`Wrote ${landDots.length} land dots to src/data/land-dots.json`)
