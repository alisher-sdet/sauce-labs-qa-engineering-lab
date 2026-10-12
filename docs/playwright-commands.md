# Playwright and TypeScript Commands

Шпаргалка по запуску Web UI и API-тестов, проверке TypeScript и работе с Playwright в проекте Sauce Labs QA Engineering Lab.

## 1. Подготовка

Перейти в каталог Web/API-проекта:

```bash
cd ~/Documents/myPro/sauce-labs-qa-lab/web-api
```

Установить зависимости проекта:

```bash
npm ci
```

## 2. Запуск тестов

### Запустить все тесты

```bash
npm test
```

### Запустить только Web UI-тесты

```bash
npm run test:web
```

### Запустить только API-тесты

```bash
npm run test:api
```

### Посмотреть список обнаруженных тестов

```bash
npx playwright test --list
```

### Запустить тесты с открытым браузером

```bash
npx playwright test --headed
```

### Запустить тесты в интерактивном режиме

```bash
npx playwright test --ui
```

## 3. TypeScript

### Проверить типы без создания JavaScript-файлов

```bash
npm run typecheck
```

Скрипт запускает `tsc --noEmit`.

- `strict: true` — включает строгую проверку типов.
- `noEmit: true` — TypeScript проверяет код, но не создаёт выходные файлы.
- `target: ES2022` — целевая версия JavaScript.
- `module: NodeNext` и `moduleResolution: NodeNext` — правила работы с модулями Node.js.
- `include` — указывает файлы, которые TypeScript должен включить в проект: `playwright.config.ts` и `tests/**/*.ts`.

### Проверить, какие файлы входят в TypeScript-проект

```bash
npx tsc --listFilesOnly
```

## 4. HTML-отчёт Playwright

После выполнения тестов, если отчёт был создан:

```bash
npx playwright show-report
```

Команда открывает HTML-отчёт в браузере.

## 5. Проверки перед коммитом

Из каталога `web-api`:

```bash
npm run typecheck
npm test
```

Затем из корня репозитория:

```bash
git diff --check
git status --short
```

Перед отправкой изменений в GitHub необходимо проверить локальные результаты и CI.
