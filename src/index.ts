import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const express = require('express');
console.log('index')
// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
    // tslint:disable-next-line: no-console
    console.error(reason);
});

process.on('uncaughtException', (reason) => {
    // tslint:disable-next-line: no-console
    console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
    if (!cachedServer) {
        try {
            const expressApp = express();
            const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { logger: ['error', 'warn']});
            nestApp.use(eventContext());
            nestApp.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', process.env.SITE_URL);
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
                next();
              });
            await nestApp.init();
            cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
        } catch (error) {
            return Promise.reject(error);
        }
    }
    return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
    cachedServer = await bootstrapServer();
    return proxy(cachedServer, event, context, 'PROMISE').promise;
};
