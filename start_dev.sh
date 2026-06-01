#!/bin/bash

root="$(dirname "$0")"

open_url() {
  case "$(uname -s)" in
    Linux*)  xdg-open "$1" ;;
    Darwin*) open "$1" ;;
    MINGW*|MSYS*|CYGWIN*) explorer.exe "$1" ;;
  esac
}

wait_for() {
  local url="$1"
  local max_attempts="${2:-60}"

  for ((i=1; i<=max_attempts; i++)); do
    if curl -s -o /dev/null --max-time 2 "$url" 2>/dev/null; then
      return 0
    fi
    sleep 2
  done

  return 1
}

wait_and_open() {
  wait_for "$1" && open_url "$1"
}

cd "$root/shared" && npm install && npm run dev &
wait_for "http://localhost:4000"

cd "$root/home" && npm run dev &
cd "$root/about" && npm run dev &
cd "$root/users" && npm run dev &
cd "$root/not-found" && npm run dev &
cd "$root/product" && npm run dev &
cd "$root/context" && npm run dev &
cd "$root/container" && npm run dev &

wait_and_open "http://localhost:4000" &
wait_and_open "http://localhost:3000" &
wait_and_open "http://localhost:3010" &
wait_and_open "http://localhost:3020" &
wait_and_open "http://localhost:3030" &
wait_and_open "http://localhost:3040" &
wait_and_open "http://localhost:3050" &
wait_and_open "http://localhost:3060" &

wait
