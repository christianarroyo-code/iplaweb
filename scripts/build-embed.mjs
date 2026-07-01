import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/embed/globe-embed.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2018",
  jsx: "automatic",
  loader: { ".css": "css" },
  outfile: "dist-embed/globe-embed.js",
})

console.log("Built dist-embed/globe-embed.js and dist-embed/globe-embed.css")
