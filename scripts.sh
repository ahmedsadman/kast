#!/bin/bash
set -e

dev_start() {
    docker compose -p kast-dev up --build -d
}

dev_stop() {
    docker compose -p kast-dev down
}

dev_restart() {
  dev_stop
  dev_start
}

main() {
    # Check if a function name was provided as an argument
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <function_name>"
        exit 1
    fi

    # Check if the provided function exists
    if [ "$(type -t "$1")" = 'function' ]; then
        # Execute the provided function
        "$@"
    else
        echo "Function $1 doesn't exist."
        exit 1
    fi
}

main "$@"
