#!/bin/sh

set -e

cd "$(dirname $( cd "$( dirname "$0" )" && pwd ) )"

docker build \
    -t windows-installer \
    -f windows/Dockerfile \
    --build-arg DOCKER_VERSION="17.06.0-ce-rc2" \
    --build-arg VBOX_VERSION="5.1.22" \
    --build-arg VBOX_REV="115126" \
    --build-arg NWJS_VERSION="0.23.3" \
    .

CONTAINER="$(docker run -d windows-installer)"
mkdir -p dist
docker cp "${CONTAINER}":/installer/Output/setup.exe dist
docker rm "${CONTAINER}" 2>/dev/null || true
