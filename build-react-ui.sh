#! /usr/bin/env bash

rm -rf ./build
curl -L https://github.com/kobesani/react-phonebook/releases/download/v0.1.5/react-github-actions-release-build.zip -o main.zip
unzip ./main.zip
rm -rf ./main.zip
mv ./react-github-actions-build ./build

