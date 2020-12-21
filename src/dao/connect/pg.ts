import { TaggedQuery } from '@pgtyped/query'
import pg, { Pool, types } from 'pg'
import pgCamelCase from 'pg-camelcase'

// convert all column names to camel case
pgCamelCase.inject(pg)
// set type parser for numeric types since pg connect would parse numeric (float) as string
types.setTypeParser(1700, 'text', parseFloat)

const slowDuration = process.env.PG_SLOW_DURATION || 250 // milliseconds
console.log(`slow query duration: ${slowDuration}ms`)

const pool = new Pool({
  database: process.env.PGDATABASE,
  host:     process.env.PGHOST,
  port:     process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  user:     process.env.PGUSER,
  password: process.env.PGPASSWORD
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
