#! /usr/bin/env bash

# npm install
# # git clone git@github.com:kobesani/react-phonebook.git
# # echo "cloned react-phonebook repo"
curl -L https://github.com/kobesani/react-phonebook/archive/refs/heads/main.zip -o main.zip
unzip ./main.zip
rm -rf ./main.zip
cd ./react-phonebook-main
echo "Current working dir ${PWD}"
# # install react dependencies
# npm install .
# # # execute production build and copy to build-test in backend
# npm run build .
# cp -r ./build ../build
cd ../
ls -lha
echo "removing react-phonebook-main folder"
rm -rf "./react-phonebook-main"
