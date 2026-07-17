import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignoredPaths = {
  ignores: [
    ".next/**",
    ".open-next/**",
    ".sites-bundle/**",
    "node_modules/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    ".tools/**",
    "dist/**",
    "release/**",
  ],
};

const eslintConfig = [
  ignoredPaths,
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ignoredPaths.ignores,
  },
];

export default eslintConfig;
