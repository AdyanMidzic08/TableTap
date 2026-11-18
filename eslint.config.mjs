import { createRequire } from "node:module";
import { join } from "node:path";

// client/ and server/ each install their own ESLint plugins, so load them from the folder ESLint runs in
const require = createRequire(join(process.cwd(), "package.json"));
const { name } = require("./package.json");
const prettier = require("eslint-config-prettier");

const ignores = {
  ignores: [
    "**/node_modules/**",
    "client/.next/**",
    "client/out/**",
    "client/build/**",
    "client/next-env.d.ts",
    "server/dist/**",
  ],
};

function client() {
  const next = [
    ...require("eslint-config-next/core-web-vitals"),
    ...require("eslint-config-next/typescript"),
  ].filter((config) => config.files || config.rules || config.plugins);
  return next.map((config) => ({
    ...config,
    files: (config.files ?? ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"]).map((p) => `client/${p}`),
  }));
}

function server() {
  const js = require("@eslint/js");
  const tseslint = require("typescript-eslint");
  return [js.configs.recommended, ...tseslint.configs.recommended].map((config) => ({
    ...config,
    files: ["server/**/*.{js,mjs,cjs,ts,mts,cts}"],
  }));
}

export default [ignores, ...(name === "client" ? client() : server()), prettier];
