// queries from TS source and generated types go here:

import { QuickInfo } from "typescript"

type literalQueries = [
  {
    q: `select * from test`
  }
]

type test = `here’s a test`
type yo = `hey`
type allQueries = `${ test | yo }`

interface queries {
  'select * from test': Array<{ test: string }>
  'select hello from test': Array<{ test: number }>
  // [query: string]: Array<unknown>
}

interface QueryStringArray extends TemplateStringsArray {
  readonly raw: readonly (keyof queries)[]
}

function myTest(s: allQueries) {
  return s
}

const z = myTest`yo`

// placeholder
function sql<Q extends keyof queries>({ raw: [ q ] }: { raw: ReadonlyArray<Q> }) {
  
  // return {
  //   run: () => query(q)
  // }
}

// run the query here (stub)
async function runQuery(q: string): Promise<unknown> {
  return []
}

// query wrapper with type lookup mechanism
async function query<Q extends keyof queries>(query: Q) {
  const res = await runQuery(String(query))
  return res as queries[Q]
}

(async () => {
  // call and get inferred types
  const numberArray = (await sql`select hello from test`) // => {test: number}[]
  const stringArray = (await sql`select * from test`) // => {test: string}[]
})()
