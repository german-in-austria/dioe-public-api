import { TaggedQuery } from '@pgtyped/query'
import { Pool, types, Client } from 'pg'

// set type parser for numeric types since pg connect would parse numeric (float) as string
types.setTypeParser(1700, 'text', parseFloat)

const slowDuration = process.env.PG_SLOW_DURATION || 250 // milliseconds
console.log(`slow query duration: ${slowDuration}ms`)

const pool = new Pool({
  database: process.env.PG_DATABASE,
  host:     process.env.PG_HOST,
  port:     Number(process.env.PG_PORT),
  user:     process.env.PG_USER,
  password: process.env.PG_PASSWORD
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
