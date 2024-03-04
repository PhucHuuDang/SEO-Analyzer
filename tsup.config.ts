import { defineConfig } from "tsup";

// export default defineConfig({
//   entryPoints: ["src/cms-seo.ts"],
//   dts: true,
//   clean: true,
//   format: ["cjs", "esm"],
//   minify: true,
//   sourcemap: true,
//   splitting: true,
//   target: "node14",
// });
export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/cms-seo.ts"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
});
