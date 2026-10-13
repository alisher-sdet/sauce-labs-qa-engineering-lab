
#!/usr/bin/env bash
set -eu

cd "${GITHUB_WORKSPACE:-$(git rev-parse --show-toplevel)}/mobile"

echo "Working directory: $(pwd)"
echo "Python project:"
ls -la pyproject.toml uv.lock

uv sync --locked


echo "Waiting for Android emulator..."

for attempt in $(seq 1 60); do
  DEVICE_STATE="$(adb -s emulator-5554 get-state 2>/dev/null || true)"

  if [ "$DEVICE_STATE" = "device" ]; then
    echo "Android emulator is ready"
    break
  fi

  echo "Attempt $attempt/60: emulator state is '$DEVICE_STATE'"
  sleep 5
done

DEVICE_STATE="$(adb -s emulator-5554 get-state 2>/dev/null || true)"

if [ "$DEVICE_STATE" != "device" ]; then
  echo "Android emulator did not become ready"
  adb devices -l
  exit 1
fi

adb -s emulator-5554 install /tmp/mda-2.3.0-27.apk


appium --address 127.0.0.1 --port 4723 \
  > /tmp/appium.log 2>&1 &

APPIUM_PID=$!

cleanup() {
  if kill -0 "$APPIUM_PID" 2>/dev/null; then
    kill "$APPIUM_PID" 2>/dev/null || true
    wait "$APPIUM_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT

for attempt in $(seq 1 30); do
  if curl --fail --silent \
    http://127.0.0.1:4723/status > /dev/null; then
    echo "Appium is ready"
    break
  fi

  if ! kill -0 "$APPIUM_PID" 2>/dev/null; then
    echo "Appium process exited unexpectedly"
    cat /tmp/appium.log
    exit 1
  fi

  sleep 2
done

curl --fail --silent \
  http://127.0.0.1:4723/status > /dev/null || {
    echo "Appium did not become ready in time"
    cat /tmp/appium.log
    exit 1
  }

export APPIUM_URL=http://127.0.0.1:4723
export ANDROID_UDID=emulator-5554

mkdir -p junit-results
uv run pytest -v --junitxml=junit-results/results.xml
