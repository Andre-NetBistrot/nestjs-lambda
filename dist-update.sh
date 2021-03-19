#!/bin/bash

yarn run build

cd distribution/

cp -R ../dist/ .

cp ../.env.production ./.env

zip -r -X "../distribution.zip" .

cd ..
