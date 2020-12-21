import util from 'util'
import colors from 'colors/safe'

if (process.env.NODE_ENV === 'development') {
  require('source-map-support').install()
}
const log = console.log

const clog = function(...args: any[]){
  if (process.env.NODE_ENV === 'development') {
    let obj: any = {}
    // show line numbers during development
    Error.captureStackTrace(obj, clog)
    const lineNumber = obj.stack.split('\n')[1] // .match(/\(\/.{1,}\)/)
    log.apply(console, args.map( a => util.inspect(a, { depth: 4 })).concat('\n' + colors.dim(lineNumber)))
  }
}
if (process.env.NODE_ENV === 'development') {
  console.log = clog
  console.error = clog
  console.info = clog
  console.warn = clog
}
