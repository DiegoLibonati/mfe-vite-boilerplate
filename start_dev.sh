#!/bin/bash

open_url() {
  case "$(uname -s)" in
    Linux*)  xdg-open "$1" ;;
    Darwin*) open "$1" ;;
    MINGW*|MSYS*|CYGWIN*) explorer.exe "$1" ;;
  esac
}

wait_and_open() {
  local url="$1"
  local max_attempts=60

  for ((i=1; i<=max_attempts; i++)); do
    if curl -s -o /dev/null -w '' --max-time 2 "$url" 2>/dev/null; then
      open_url "$url"
      return
    fi
    sleep 2
  done
}

cd "$(dirname "$0")/shared" && npm install && npm run dev &
cd "$(dirname "$0")/home" && npm run dev &
cd "$(dirname "$0")/about" && npm run dev &
cd "$(dirname "$0")/users" && npm run dev &
cd "$(dirname "$0")/notfound" && npm run dev &
cd "$(dirname "$0")/product" && npm run dev &
cd "$(dirname "$0")/context" && npm run dev &
cd "$(dirname "$0")/container" && npm run dev &

wait_and_open "http://localhost:3000" &
wait_and_open "http://localhost:3010" &
wait_and_open "http://localhost:3020" &
wait_and_open "http://localhost:3030" &
wait_and_open "http://localhost:3040" &
wait_and_open "http://localhost:3050" &
wait_and_open "http://localhost:3060" &
wait_and_open "http://localhost:4000" &

wait
