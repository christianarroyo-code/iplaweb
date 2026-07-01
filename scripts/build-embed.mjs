import * as esbuild from "esbuild"

const buildId = new Date().toISOString()

await esbuild.build({
  entryPoints: ["src/embed/globe-embed.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2018",
  jsx: "automatic",
  loader: { ".css": "css" },
  outfile: "dist-embed/globe-embed.js",
  banner: { js: `/* ipla-globe-embed build ${buildId} */` },
})

console.log(`Build ID: ${buildId}`)

console.log("Built dist-embed/globe-embed.js and dist-embed/globe-embed.css")
