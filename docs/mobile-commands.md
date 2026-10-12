# Mobile Testing Commands

Шпаргалка по Android Emulator, ADB, Appium и Pytest для проекта Sauce Labs QA Engineering Lab.

## 1. Android Emulator

Все команды выполняются в терминале macOS.

### Проверить доступные эмуляторы

```bash
emulator -list-avds
```

В моём окружении доступны:

- `Pixel_8`
- `Pixel_9_Pro`

### Запустить эмулятор

```bash
emulator -avd Pixel_8
```

Запускать только тогда, когда `Pixel_8` ещё не работает. Не запускай второй экземпляр с тем же AVD.

### Проверить подключённые устройства

```bash
adb devices
```

Ожидаемый пример:

```text
List of devices attached
emulator-5554    device
```

### Дождаться подключения устройства

```bash
adb wait-for-device
```

### Проверить завершение загрузки Android

```bash
adb shell getprop sys.boot_completed
```

Значение `1` означает, что Android завершил загрузку.

### Если команда `emulator` не найдена

Проверить путь к Android SDK:

```bash
echo $ANDROID_HOME
which adb
```

В моём окружении Android SDK находится в:

```text
/Users/user/Library/Android/sdk
```

Добавить каталог эмулятора в `PATH` для Zsh:

```bash
echo 'export PATH="$ANDROID_HOME/emulator:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

После этого проверить:

```bash
emulator -list-avds
```

## 2. Appium

### Проверить версию Appium

```bash
appium --version
```

### Проверить установленные драйверы

```bash
appium driver list --installed
```

### Запустить сервер Appium

В отдельном терминале:

```bash
appium --address 127.0.0.1 --port 4723
```

Оставить этот терминал открытым на время выполнения тестов.

### Проверить доступность сервера

В другом терминале:

```bash
curl http://127.0.0.1:4723/status
```

## 3. Pytest

### Перейти в каталог мобильного проекта

```bash
cd ~/Documents/myPro/sauce-labs-qa-lab/mobile
```

### Запустить все тесты

```bash
uv run pytest -v
```

### Запустить тесты одного файла

```bash
uv run pytest -v tests/test_products_screen.py
```

### Запустить все тесты класса

```bash
uv run pytest -v tests/test_products_screen.py::TestProductsScreen
```

### Запустить один конкретный тест

```bash
uv run pytest -v tests/test_products_screen.py::TestProductsScreen::test_products_screen_title_is_displayed
```

### Выбрать тесты по части имени

Запустить тесты, содержащие `list`:

```bash
uv run pytest -v tests/test_products_screen.py -k "list"
```

Исключить тесты, содержащие `list`:

```bash
uv run pytest -v tests/test_products_screen.py -k "not list"
```

### Посмотреть список тестов без выполнения

```bash
uv run pytest --collect-only -v tests/test_products_screen.py
```

## 4. Рекомендуемая последовательность запуска

1. Запустить Android-эмулятор, если он ещё не запущен.
2. Проверить устройство командой `adb devices`.
3. Убедиться, что Android загрузился: `adb shell getprop sys.boot_completed`.
4. Запустить сервер Appium в отдельном терминале.
5. Выполнить мобильные тесты из каталога `mobile`.

## 5. Как читать результат Pytest

- `PASSED` — тест прошёл.
- `FAILED` — тест завершился ошибкой.
- `deselected` — тест не выбран для текущего запуска.
- `collected 2 items` — Pytest обнаружил два теста.

## 6. Проверки перед коммитом

Из корня репозитория:

```bash
git diff --check
git status --short
```

После изменения тестов сначала выполнить соответствующие локальные проверки. Не отправлять изменения в GitHub до проверки результата.
