process.title = 'dioe-public-api'

import fs from 'fs'
import dotenv from 'dotenv'

if (
  process.env.NODE_ENV !== 'production'
  && process.env.NODE_ENV !== 'staging'
  && fs.existsSync('./env-dev.env')
) {
  const envs = dotenv.parse(fs.readFileSync('./env-dev.env'))
  for (let k in envs) {
    process.env[k] = envs[k]
  }
}

import bodyParser from 'body-parser'
import express from 'express'
import methodOverride from 'method-override'
import { RegisterRoutes } from './routes'
import compression from 'compression'
import cors from 'cors'
import cookieSession from 'cookie-session'
import _ from 'lodash'

import './controller/tagController'

declare function require(path: string): any
const tsoaConfig = require('./../tsoa.json')

// allow unhandled rejections
// to bubble up
process.on('unhandledRejection', (error: Error) => {
  console.error('UNHANDLED REJECTION', error)
})

// initialize express server
const app = express()

// gzip
app.use(compression())

// file upload

app.use(cookieSession({
  keys : [ 'happiness is a virtue, not a reward, and my horse is in a stable. Its colour is black. Maybe white. We dont really know' ],
  maxAge : 1000 * 60 * 60 * 24 * 60, // 60 days.
  name : 'session'
}))

// accessing the api from
// different origins
app.use(cors({
  credentials : true,
  origin: [
    'http://localhost:8080',
    'https://localhost:8080',
  ]
}))

// attach rawBody to request
app.use(tsoaConfig.routes.basePath + '/webhook/payment', bodyParser.raw({type: '*/*'}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(methodOverride())

const basePath = tsoaConfig.routes.basePath

// Swagger Spec JSON
app.use(basePath + '/swagger.json', async (_req, res) => {
  res.sendFile(`${ __dirname }/swagger.json`)
})

RegisterRoutes(app)

// start the server
app.listen(process.env.NODE_PORT, () => {
  console.log(`Started server on port ${process.env.NODE_PORT}`)
})


