# Architecture

## Scope

This repository contains three independent automation domains.

1. Web UI: SauceDemo, automated with Playwright and TypeScript.
2. API: local httpbin checks with Playwright APIRequestContext; ReqRes is a separate external practice target.
3. Mobile: My Demo App Android, automated with Appium, Python, Pytest, and UIAutomator2.

These targets are independent. The repository does not claim an end-to-end integration between them.

## Repository structure

```text
.
├── .github/
│   └── workflows/
│       ├── mobile-android-ci.yml
│       └── web-api-ci.yml
├── docs/
│   ├── git-commands.md
│   ├── mobile-commands.md
│   └── playwright-commands.md
├── mobile/
│   ├── scripts/
│   │   └── ci-android-smoke.sh
│   ├── tests/
│   │   └── test_products_screen.py
│   ├── pyproject.toml
│   └── uv.lock
├── web-api/
│   ├── tests/
│   │   ├── api/
│   │   └── web/
│   ├── compose.yaml
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts
│   └── tsconfig.json
├── ARCHITECTURE.md
└── README.md
```

The Web/API and Mobile domains have separate dependency management and test execution.

## CI boundaries

- Web and API checks are defined in `.github/workflows/web-api-ci.yml`.
- Web/API CI installs dependencies, runs TypeScript typecheck, starts the local httpbin service, and executes Web/API tests.
- Mobile Android checks are defined in `.github/workflows/mobile-android-ci.yml`.
- Mobile CI provisions an Android emulator, verifies the downloaded My Demo App APK checksum, and invokes `mobile/scripts/ci-android-smoke.sh`.
- The mobile smoke-test script installs locked Python dependencies, waits for the emulator and Appium readiness, runs Pytest, and attempts to stop the Appium process it started when the script exits.
- CI workflows are maintained separately to keep the test domains independent.

## Documentation

- `README.md` provides the project overview, status, and local execution instructions.
- `docs/git-commands.md` documents the Git and GitHub workflow.
- `docs/mobile-commands.md` documents Android Emulator, ADB, Appium, and Pytest commands.
- `docs/playwright-commands.md` documents Playwright and TypeScript commands.

## Initial engineering rules

- Keep each domain's dependencies and test execution separate.
- Use lockfiles for reproducible dependency installation.
- Keep secrets out of source control.
- Begin with one smoke test per domain before expanding coverage.
- Prefer deterministic local checks for blocking CI.
- Add architecture rules and abstractions only when justified by actual code.
