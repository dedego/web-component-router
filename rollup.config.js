import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";

module.exports = {
  input: "src/index.js",
  output: [
    {
      file: pkg["main"],
      format: "umd",
      sourcemap: true,
      exports: "named",
      name: "wcr"
    },
    {
      file: pkg["module"],
      format: "esm",
      sourcemap: true,
      exports: "named",
      name: "wcr"
    }
  ],
  plugins: [
      terser()
  ]
};