#!/bin/sh

set -e

cd "$(dirname $( cd "$( dirname "$0" )" && pwd ) )"

docker build \
    -t windows-installer \
    -f windows/Dockerfile \
    .

CONTAINER="$(docker run -d windows-installer)"
mkdir -p dist
docker cp "${CONTAINER}":/installer/Output/setup.exe dist
docker rm "${CONTAINER}" 2>/dev/null || true
