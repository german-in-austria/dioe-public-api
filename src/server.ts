///<reference path="external.d.ts" />

process.title = 'dioe-public-api';
const defaultPort = 3000;

import fs from 'fs';
import dotenv from 'dotenv';

// this is to allow cross platform env vars in dev mode;
// not used in production
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'staging' &&
  fs.existsSync('./env-dev.env')
) {
  const envs = dotenv.parse(fs.readFileSync('./env-dev.env'));
  for (let k in envs) {
    process.env[k] = envs[k];
  }
}

import './lib/log';
import errorHandler from './error/error-handler';
import bodyParser from 'body-parser';
import express from 'express';
import methodOverride from 'method-override';
import { RegisterRoutes } from './routes';
import compression from 'compression';
import cors from 'cors';
import cookieSession from 'cookie-session';
import _ from 'lodash';

// import all controllers here
import './controller/tagController';
import './controller/phaenController';
import './controller/aufgabenController';
import './controller/antwortenController';
import './controller/socialController';

const tsoaConfig = require('./../tsoa.json');

const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./docs/swagger.json');

// allow unhandled rejections
// to bubble up
process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION', error);
});

// initialize express server
const app = express();
// gzip
app.use(compression());

// file upload
app.use(
  cookieSession({
    keys: [
      'happiness is a virtue, not a reward, and my horse is in a stable. Its colour is black. Maybe white. We dont really know',
    ],
    maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days.
    name: 'session',
  })
);

// accessing the api from
// different origins
app.use(
  cors({
    credentials: true,
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.trim()
          .split(',')
          .map((t) => t.trim())
      : [],
  })
);

console.log('Using ALLOWED_ORIGINS: ', process.env.ALLOWED_ORIGINS);

// attach rawBody to request
app.use(
  tsoaConfig.routes.basePath + '/webhook/payment',
  bodyParser.raw({ type: '*/*' })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());

const basePath = tsoaConfig.routes.basePath;

console.log(basePath + '/docs/swagger.json');
// serve the Swagger spec JSON
app.use(basePath + '/docs/swagger.json', async (_req, res) => {
  console.log(`${__dirname}/docs/swagger.json`);
  res.sendFile(`${__dirname}/docs/swagger.json`);
});

app.use(basePath + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

RegisterRoutes(app);

app.use(errorHandler);

// start the server
const server = app.listen(process.env.NODE_PORT || defaultPort, () => {
  console.log(`Started server on port ${process.env.NODE_PORT || defaultPort}`);
});

export default server;
