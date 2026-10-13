import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["playwright-report/**", "test-results/**", "node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
);
