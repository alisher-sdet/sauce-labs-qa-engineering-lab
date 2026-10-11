
#!/usr/bin/env bash
set -eu

cd "${GITHUB_WORKSPACE:-$(git rev-parse --show-toplevel)}/mobile"

echo "Working directory: $(pwd)"
echo "Python project:"
ls -la pyproject.toml uv.lock

uv sync --locked

adb install /tmp/mda-2.3.0-27.apk

appium --address 127.0.0.1 --port 4723 \
  > /tmp/appium.log 2>&1 &

APPIUM_PID=$!

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

uv run pytest -v
