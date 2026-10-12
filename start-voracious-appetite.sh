#!/bin/bash
# Starts recipes-service and the voracious-appetite-app dev server in the
# background, with the app pointed at the local service.
# Stop both with ./stop-voracious-appetite.sh

appDir=$(cd "$(dirname "$0")" && pwd)
serviceDir=${RECIPES_SERVICE_DIR:-$appDir/../recipes-service}
servicePort=${RECIPES_SERVICE_PORT:-3000}
appPort=5175
runDir=$appDir/.run

mkdir -p "$runDir"

isRunning() {
  local pidFile=$runDir/$1.pid
  [ -f "$pidFile" ] && kill -0 "$(head -1 "$pidFile")" 2>/dev/null
}

# Saves the process's pid, and its Windows pid when running under Git Bash
savePid() {
  local pid=$1
  local pidFile=$runDir/$2.pid
  echo "$pid" > "$pidFile"
  if [ -f "/proc/$pid/winpid" ]; then
    cat "/proc/$pid/winpid" >> "$pidFile"
  fi
}

# Waits up to 60 seconds for the url to answer with a non-empty body other
# than [], failing early if the process dies
waitForUrl() {
  local name=$1
  local url=$2
  local body
  for _ in $(seq 1 60); do
    body=$(curl -s "$url")
    if [ -n "$body" ] && [ "$body" != "[]" ]; then
      return 0
    fi
    if ! isRunning "$name"; then
      echo "FAILED: $name exited. Last lines of $runDir/$name.log:"
      tail -20 "$runDir/$name.log"
      rm -f "$runDir/$name.pid"
      return 1
    fi
    sleep 1
  done
  echo "FAILED: $name did not answer at $url within 60 seconds. See $runDir/$name.log"
  return 1
}

installIfNeeded() {
  if [ ! -d "$1/node_modules" ]; then
    echo "Installing dependencies in $1"
    (cd "$1" && npm ci) || exit 1
  fi
}

if [ ! -d "$serviceDir" ]; then
  echo "recipes-service not found at $serviceDir (set RECIPES_SERVICE_DIR to override)"
  exit 1
fi

if isRunning recipes-service; then
  echo "recipes-service is already running"
else
  installIfNeeded "$serviceDir"
  echo "Starting recipes-service on port $servicePort"
  (cd "$serviceDir" && PORT=$servicePort exec node ./bin/server) > "$runDir/recipes-service.log" 2>&1 &
  savePid $! recipes-service
  # The service listens before it has loaded the recipes from GitHub, and
  # exits if that load fails, so wait for recipes rather than the port
  waitForUrl recipes-service "http://localhost:$servicePort/api/recipes-service/recipes" || exit 1
fi

if isRunning voracious-appetite-app; then
  echo "voracious-appetite-app is already running"
else
  installIfNeeded "$appDir"
  echo "Starting voracious-appetite-app on port $appPort"
  (cd "$appDir" \
    && VITE_RECIPE_SERVICE_V0_BASE_URL=http://localhost:$servicePort/api/recipes-service \
       exec node ./node_modules/vite/bin/vite.js --port "$appPort" --strictPort) \
    > "$runDir/voracious-appetite-app.log" 2>&1 &
  savePid $! voracious-appetite-app
  waitForUrl voracious-appetite-app "http://localhost:$appPort/apps/voracious-appetite/" || exit 1
fi

echo
echo "App:     http://localhost:$appPort/apps/voracious-appetite/"
echo "Service: http://localhost:$servicePort/api/recipes-service/recipes"
echo "Logs:    $runDir"
