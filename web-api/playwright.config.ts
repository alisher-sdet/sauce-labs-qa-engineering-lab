import { defineConfig } from "@playwright/test";
import { readFileSync } from "node:fs";

const envFile = ".env.local";
const loadLocalEnv = process.env.LOAD_LOCAL_ENV !== "false";

if (loadLocalEnv) {
  try {
    const envContent = readFileSync(envFile, "utf8");
    const match = envContent.match(/^REQRES_API_KEY=(.*)$/m);

    if (match?.[1].trim()) {
      process.env.REQRES_API_KEY ??= match[1].trim();
    }
  } catch {
    // Local environment file is optional; CI can provide environment variables.
  }
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["junit", { outputFile: "junit-results/results.xml" }],
  ],
  use: {
    testIdAttribute: "data-test",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "web",
      testMatch: "**/*.web.spec.ts",
    },
    {
      name: "api",
      testMatch: "**/*.api.spec.ts",
    },
  ],
});
