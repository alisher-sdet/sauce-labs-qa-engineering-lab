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
│   ├── development-workflow.md
│   ├── git-commands.md
│   ├── mobile-commands.md
│   └── playwright-commands.md
├── mobile/
│   ├── screens/
│   │   └── products_screen.py
│   ├── scripts/
│   │   └── ci-android-smoke.sh
│   ├── tests/
│   │   ├── conftest.py
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

## Mobile UI test design

The Mobile domain uses the **Screen Object pattern**, a mobile-oriented variant of the Page Object pattern.

- `mobile/tests/` contains test scenarios and assertions.
- `mobile/screens/` encapsulates screen-specific locators, UI interactions, scrolling, and product data collection.
- `ProductsScreen` represents the Products screen and provides methods for retrieving product names and prices, interacting with sorting controls, and collecting catalog data.
- Tests use `ProductsScreen` for screen interactions and keep assertions about application behavior in the test scenarios.

The Screen Object separates UI interaction details from test intent. Assertions that verify application behavior remain in the tests.

New abstractions should be introduced only when justified by actual code and demonstrated maintenance or reuse needs.

## Web UI test design

The Web UI domain uses Playwright with TypeScript and the Page Object pattern.

- `web-api/tests/web/` contains test scenarios and assertions.
- `web-api/pages/` encapsulates page-specific locators and UI interactions.
- `LoginPage` handles login form interactions.
- `InventoryPage` handles product sorting, product data retrieval, adding products to the cart, and opening the cart.
- `CartPage` handles cart item operations and checkout navigation.
- `CheckoutPage` handles customer information entry and checkout navigation.
- `web-api/tests/web/helpers/auth.ts` provides reusable standard-user login setup.
- `web-api/tests/web/helpers/cart.ts` provides reusable setup for adding a backpack and opening the cart.

Tests retain assertions about application behavior. Page Objects encapsulate UI interaction details and do not own test scenario expectations.

The sorting tests verify ordering by product name and price. A separate test verifies that sorting preserves the product set.

New abstractions should be introduced only when justified by demonstrated reuse or maintenance needs.

## CI boundaries

- Web and API checks are defined in `.github/workflows/web-api-ci.yml`.
- Web/API CI installs dependencies, runs TypeScript typecheck, ESLint, and Prettier checks, starts the local httpbin service, and executes Web/API tests.
- Mobile Android checks are defined in `.github/workflows/mobile-android-ci.yml`.
- Mobile CI provisions an Android emulator, verifies the downloaded My Demo App APK checksum, and invokes `mobile/scripts/ci-android-smoke.sh`.
- The mobile smoke-test script installs locked Python dependencies, waits for the emulator and Appium readiness, runs Pytest, and attempts to stop the Appium process it started when the script exits.
- CI workflows are maintained separately to keep the test domains independent.

## Documentation

- `README.md` provides the project overview, status, and local execution instructions.
- `docs/git-commands.md` documents the Git and GitHub workflow.
- `docs/development-workflow.md` documents the step-by-step development, validation, commit, and publishing process.
- `docs/mobile-commands.md` documents Android Emulator, ADB, Appium, and Pytest commands.
- `docs/playwright-commands.md` documents Playwright and TypeScript commands.

## Initial engineering rules

- Keep each domain's dependencies and test execution separate.
- Use lockfiles for reproducible dependency installation.
- Keep secrets out of source control.
- Begin with small, executable smoke tests before expanding coverage.
- Keep test scenarios and assertions separate from screen-specific UI interaction details.
- Prefer deterministic local checks for blocking CI.
- Add architecture rules and abstractions only when justified by actual code and demonstrated needs.
