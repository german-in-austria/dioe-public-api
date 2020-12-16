import * as express from 'express'
// import {ApiError} from './error/api-error'
import _ from 'lodash'

export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === 'session' && scopes) {
    // if (error) {
    //   throw new ApiError()
    // }
    return Promise.resolve()
  } else if (securityName === 'api_key') {
    const key = request.headers['x-api-key']
    return Promise.resolve()
  }
}
