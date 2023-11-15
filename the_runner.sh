#!/bin/bash

if [ "$#" -ne 1 ] || ( [ "$1" != "del" ] && [ "$1" != "up" ] ); then
    echo "Usage: $0 [del|up]"
    exit 1
fi

cleanup() {
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune --all --force --volumes
    docker volume prune --force
}

# Function to build Docker containers and clean npm caches
build() {
    rm -rf ./frontend/node_modules
    rm -rf ./backend/node_modules

    # mkdir -p ~/Desktop/TranscendenceDB

    (cd ./frontend && npm cache clean --force --silent;) && (cd ./backend &&  npm cache clean --force --silent;)

    docker-compose up --build
}

# Execute the chosen command
case "$1" in
    "del")
        cleanup
        ;;
    "up")
        build
        ;;
    *)
        echo "Invalid command. Use 'del' to destroy everything and 'up' to build and run the project."
        exit 1
        ;;
esac

exit 0