"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_serverless_express_1 = require("aws-serverless-express");
const middleware_1 = require("aws-serverless-express/middleware");
const platform_express_1 = require("@nestjs/platform-express");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express = require('express');
console.log('index');
const binaryMimeTypes = [];
let cachedServer;
process.on('unhandledRejection', (reason) => {
    console.error(reason);
});
process.on('uncaughtException', (reason) => {
    console.error(reason);
});
async function bootstrapServer() {
    if (!cachedServer) {
        try {
            const expressApp = express();
            const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), { logger: ['error', 'warn'] });
            nestApp.use(middleware_1.eventContext());
            nestApp.use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', process.env.SITE_URL);
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
                next();
            });
            await nestApp.init();
            cachedServer = aws_serverless_express_1.createServer(expressApp, undefined, binaryMimeTypes);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    return cachedServer;
}
exports.handler = async (event, context) => {
    cachedServer = await bootstrapServer();
    return aws_serverless_express_1.proxy(cachedServer, event, context, 'PROMISE').promise;
};
//# sourceMappingURL=index.js.map