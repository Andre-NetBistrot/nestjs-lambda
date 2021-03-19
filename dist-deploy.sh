#!/bin/bash

aws lambda update-function-code --function-name my-lambda-function-name --zip-file fileb://distribution.zip --profile myprofile