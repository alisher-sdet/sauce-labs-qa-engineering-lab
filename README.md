# Sauce Labs QA Engineering Lab

A practical QA automation lab with three independent test domains:

- **Web UI:** SauceDemo + Playwright + TypeScript
- **API:** httpbin + Playwright APIRequestContext; ReqRes explored separately
- **Mobile:** My Demo App Android + Appium + Python + Pytest

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
- Mobile smoke tests for My Demo App Android.
- Dependency lockfiles for Node.js and Python.
- GitHub Actions Web/API CI: installs dependencies, runs TypeScript typecheck, ESLint, and Prettier checks, starts local httpbin, and executes Web/API tests.
- GitHub Actions Mobile Android CI: prepares an Android emulator, installs My Demo App, and runs the mobile smoke tests.
- Mobile CI script: `mobile/scripts/ci-android-smoke.sh` installs locked Python dependencies, waits for the emulator and Appium, runs Pytest, and attempts to stop the Appium process it starts.
- Documentation for local test execution and Git workflow.

### API testing notes

- Local httpbin is used for deterministic API smoke tests in CI.
- ReqRes is explored separately as an external API service.
- During manual verification of `GET /api/users/2`, requests with a valid key, an invalid `x-api-key`, and no API key all returned HTTP `200`.
- This endpoint therefore does not provide a reliable negative test for API-key validation under the observed conditions.
- API-key rejection scenarios are covered by a deterministic local mock contract, not treated as proof of ReqRes authentication behavior.
- Revisit ReqRes authentication coverage if its behavior or project configuration changes.

### Next

- Continue expanding meaningful Web UI, API, and Mobile test coverage.
- Improve the reproducibility and reliability of mobile tests in CI.
- Keep documentation aligned with actual project behavior and CI configuration.

## Documentation

- [Architecture](ARCHITECTURE.md) — project architecture and design principles.
- [Git commands](docs/git-commands.md) — Git and GitHub workflow.
- [Development workflow](docs/development-workflow.md) — step-by-step process for changing, validating, committing, and publishing project updates.
- [Mobile testing commands](docs/mobile-commands.md) — Android Emulator, ADB, Appium, and Pytest.
- [Playwright commands](docs/playwright-commands.md) — Playwright, Web/API tests, and TypeScript.

## Local execution

### Web and API

From the `web-api` directory:

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
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
uv run --locked ruff check .
uv run pytest -v
```
