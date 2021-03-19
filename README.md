# nestjs-lambda
Nestjs setup for local development and easy deploy to AWS lambda

After a little while using nest and deploying to the AWS lambda I have developed a few scripts In order to make easy to write and test code locally and send it to a preconfigured Lambda.

This repository contains a full nest installation, a few shell scripts and a small nodejs code. Please note that in the src folder there are main.ts file that comes with nest and also a index.ts that will be deployed in the lambda function. I did not write the last one it comes from here:

<a href="https://blog.theodo.com/2019/06/deploy-a-nestjs-app-in-5-minutes-with-serverless-framework/" target="blank">Deploy a NestJS App with Serverless Framework</a>

Yes, I started trying with serverless but after a few drawbacks I decided a personal aproach. Nevertheless I kept the index.ts and their dependences.

I am using yarn. 

When you run **yarn run build** nest creates a **dist** folder intended for deployment.

When I want to deploy to lambda, first of all, I run the script

#### make-distribution.sh

This is what happen:

- the script runs **yarn run build**
- copy the **dist** folder to **distribution**
- runs **node get-dist-package.js** that make a few things:
  - gets the original **package.json**
  - removes the **devDependencies** information
  - saves a **dist-package.json** file
- move the **dist-package.json** to **distribution** folder as **package.json**
- goes inseide the **distribution** folder
- runs **yarn install** to gather all the dependencies in this new folder
- remove **package.json** and **yarn.lock** files that are not necessary in the Lambda environment
- remove the **bcrypt** module that works in my machine (macos) but will not work in the Linux environment of the Lambda
- remove the **aws-sdk** module that is preconfigured in Lambda
- copy the **bcrypt-linux** module as **bcrypt** inside the new **node-modules** folder
- copy the **.env.production** as **.env**
- make a zip from the **distribution** folder

The resulting **distribution.zip** is ready to be deployed in the aws Lambda with two main advantages

- I have two diferents **.env** files one for local and another for production. In this example 
- it helps to manage different OS modules from local to production environment.



