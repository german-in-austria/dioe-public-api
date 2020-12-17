import { TaggedQuery } from '@pgtyped/query'
import pg, { Pool, types } from 'pg'
import { db } from '../../../pgconfig.json'
import pgCamelCase from 'pg-camelcase'
pgCamelCase.inject(pg)
// set type parser for numeric types since pg connect would parse numeric (float) as string
types.setTypeParser(1700, 'text', parseFloat)

const slowDuration = process.env.PG_SLOW_DURATION || 250 // milliseconds
console.log(`slow query duration: ${slowDuration}ms`)

const pool = new Pool({
  database: db.dbName,
  host:     db.host,
  port:     db.port,
  user:     db.user,
  password: db.password
})

export default async function<T extends { params: any, result: any }>(q: TaggedQuery<T>, params?: T['params']) {
  const start = Date.now()
  const response = q.run(params || void(0), pool)
  const duration = Date.now() - start
  if (duration >= slowDuration) {
    console.log(`executed a slow (>= ${slowDuration}ms) query.`, {
      query : q,
      duration: duration,
      rows: (await response).length
    })
  }
  return response
}
