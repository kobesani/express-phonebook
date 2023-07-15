#! /usr/bin/env bash

# git clone git@github.com:kobesani/react-phonebook.git
# echo "cloned react-phonebook repo"
curl -L https://github.com/kobesani/react-phonebook/archive/refs/heads/main.zip -o main.zip
unzip ./main.zip
cd ./react-phonebook-main
# # install react dependencies
npm install
# # execute production build and copy to build-test in backend
npm run build
cp -r ./build ../build-test
