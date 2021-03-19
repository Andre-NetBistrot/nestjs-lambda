#!/bin/bash

yarn run build

mv ./dist/ ./distribution

node get-dist-package.js

mv ./dist-package.json ./distribution/package.json

cd distribution/

yarn install

rm package.json

rm yarn.lock

rm -rf ./node_modules/bcrypt/

rm -rf ./node_modules/aws-sdk/

cp -R ../bcrypt-linux/ ./node_modules/bcrypt/

cp ../.env.production ./.env

zip -r -X "../distribution.zip" .

cd ..
