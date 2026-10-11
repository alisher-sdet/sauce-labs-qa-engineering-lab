# Architecture

## Scope

This repository contains three independent automation domains.

1. Web UI: SauceDemo, automated with Playwright and TypeScript.
2. API: local httpbin checks with Playwright APIRequestContext; ReqRes is a separate external practice target.
3. Mobile: My Demo App Android, automated with Appium, Python, Pytest, and UIAutomator2.

These targets are independent. The repository does not claim an end-to-end integration between them.

## Initial engineering rules

- Keep each domain's dependencies and test execution separate.
- Use lockfiles for reproducible dependency installation.
- Keep secrets out of source control.
- Begin with one smoke test per domain before expanding coverage.
- Prefer deterministic local checks for blocking CI.
- Add architecture rules and abstractions only when justified by actual code.
