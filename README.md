# Sauce Labs QA Engineering Lab

A practical QA automation lab with three independent test domains:

- Web UI: SauceDemo + Playwright + TypeScript
- API: httpbin + Playwright APIRequestContext; ReqRes explored separately
- Mobile: My Demo App Android + Appium + Python + Pytest

## Principles

- Keep Web, API, and Mobile test domains independent.
- Start with small, executable smoke tests.
- Pin tool versions and commit lockfiles.
- Prefer deterministic local checks in blocking CI.
- Do not introduce abstractions before they solve a demonstrated problem.

## Project status

### Implemented

- Web UI smoke test: SauceDemo login and inventory page.
- API smoke test: local httpbin query-parameter response.
- Mobile smoke test: My Demo App login screen visibility.
- Dependency lockfiles for Node.js and Python.

### Next

- Add CI workflows.
- Add a reproducible mobile test setup for CI.
- Document local setup and execution commands.

## Local execution

### Web and API

From the `web-api` directory:

```bash
npm ci
npm run typecheck
npm test
```

The API tests require the local httpbin service:

```bash
docker compose up -d
npm test
docker compose down
```

### Mobile

From the `mobile` directory, with an Android emulator running and Appium Server available:

```bash
uv run pytest -v
```
