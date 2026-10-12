#!/bin/bash
# Stops the processes started by ./start-voracious-appetite.sh

runDir=$(cd "$(dirname "$0")" && pwd)/.run

stopProcess() {
  local name=$1
  local pidFile=$runDir/$name.pid

  if [ ! -f "$pidFile" ]; then
    echo "$name is not running"
    return
  fi

  local pid winPid
  pid=$(sed -n 1p "$pidFile")
  winPid=$(sed -n 2p "$pidFile")

  if ! kill -0 "$pid" 2>/dev/null; then
    echo "$name is not running"
  elif [ -n "$winPid" ]; then
    # Git Bash: kill the whole Windows process tree
    echo "Stopping $name"
    taskkill //PID "$winPid" //T //F > /dev/null
  else
    echo "Stopping $name"
    kill "$pid"
  fi

  rm -f "$pidFile"
}

stopProcess voracious-appetite-app
stopProcess recipes-service
