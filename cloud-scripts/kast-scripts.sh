#!/bin/sh

up() {
    cd nginx-letsencrypt
    docker compose -f docker-compose.yml -f kast-docker-compose.yml up -d --build
    cd ..
}

down() {
    cd nginx-letsencrypt
    docker compose -f docker-compose.yml -f kast-docker-compose.yml down
    cd ..
}

restart() {
    cd nginx-letsencrypt
    docker compose -f docker-compose.yml -f kast-docker-compose.yml restart
    cd ..
}

deploy_server() {
    cd nginx-letsencrypt
    docker compose -f docker-compose.yml -f kast-docker-compose.yml stop kast_server
    docker pull ahmedsadman/kast-server:latest
    docker compose -f docker-compose.yml -f kast-docker-compose.yml up -d kast_server
    cd ..
}

main() {
    # Check if a function name was provided as an argument
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <function_name>"
        exit 1
    fi

    # Check if the provided function exists using command -v
    if [ "$(command -v "$1")" = "$1" ]; then
        # Execute the provided function
        "$@"
    else
        echo "Function $1 doesn't exist."
        exit 1
    fi
}

main "$@"
