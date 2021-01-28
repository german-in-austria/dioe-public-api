
const s = 'Hier ist ein (testsatz scheinbar) relativ kurz'
const tokens = s
  .split(' ')
  .reduce((m, e, i, l) => {
    const prev = i > 0 ? m[m.length - 1] : { offset: 0, end: 0 }
    const space = (i > 0 ? 1 : 0)
    m[i] = {
      word: e,
      start: prev.end + space,
      end: prev.end + space + e.length
    }
    return m
  }, [] as Array<{ word: string, start: number, end: number }>)

const matches = [...s.matchAll(/\(.+\)/g)].map(m => {
  return {
    match: m[0],
    start: (m.index || 0),
    end: (m.index || 0) + m[0].length
  }
})

console.log(tokens, matches)
