import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 0 : 0,
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
