#! /usr/bin/env bash

echo "FRONTEND_TAG=${FRONTEND_TAG} set via build command"
rm -rf ./build
curl -L https://github.com/kobesani/react-phonebook/releases/download/${FRONTEND_TAG}/react-github-actions-release-build.zip -o main.zip
unzip ./main.zip
rm -rf ./main.zip
mv ./react-github-actions-build ./build

