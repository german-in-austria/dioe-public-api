///<reference path="../external.d.ts" />

import { sql } from '@pgtyped/query'
import { numberArray } from 'src/dao/tag.queries'
import query from '../dao/connect/pg'
import { ISelectSentencesQuery, IWriteTokenPosQuery, ISelectTranscriptsQuery } from './tag-pos-spacy.queries'
import fetch from 'node-fetch'
import _ from 'lodash'

process.title = 'dioe-spacy-tagger'
const spacyEndpoint = 'https://spacy.dioe.at'

interface WritableToken {
  id: string
  spacy_pos: string
  spacy_tag: string
  spacy_lemma: string
  spacy_dep: string
  spacy_entity_type: string
}

function replaceAllSpecialChars(s: string): string {
  return s
    .replace(/\*/, '')
    .replace(/\_/, '')
    .replace(/\//, '')
    .replace(/\(/, '')
    .replace(/\)/, '')
    .replace(/\[/, '')
    .replace(/\]\S/, '')
    .replace(/"/, '')
}

function cleanUpSentence(s: { sentence: string, ids: numberArray|null }): { sentence: string, ids: number[]|null } {
  const tokens = s.sentence.split(' ')
  const deletedIndexes: number[] = []
  const cleanTokens = tokens
    .filter((t, i) => {
      if (
        // pause "((0,6s))"
        /\(\(\d,?\d?s\)\)/.test(t)
        // stuff like "((lachen))"
        || /\(\([a-zA-ZÜüÄäÖöß']+\)\)/.test(t)
        // interrupted tokens (we don’t want to tag
        // them, so we don’t confuse spacy)
        || /([a-zA-ZÜüÄäÖöß']+\/$)|(\/[a-zA-ZÜüÄäÖöß']+$)/.test(t)
      ) {
        deletedIndexes.push(i)
        return false
      } else {
        return true
      }
    })
    .map((t, i, l) => {
      if (
        // it’s the beginning of a fragment ("word=")
        /[a-zA-ZÜüÄäÖöß]+=/.test(t) &&
        // if there’s a token and an id at the next position
        s.ids![i + 1] !== undefined && l[i + 1] !== undefined
      ) {
        // store the next token here
        const nextToken = l[i + 1]
        // set the next token up to be replaced
        l[i + 1] = '*'
        return replaceAllSpecialChars(
          // append the next token to the current one.
          t.replace('=', nextToken)
        )
      }
      return replaceAllSpecialChars(t)
    })
  const filteredIds = s.ids!.filter((v, i) => !deletedIndexes.includes(i) )
  return {
    sentence: cleanTokens.join(' '),
    ids: s.ids !== null ? filteredIds : null
  }
}

async function getSentences(transcriptId: number): Promise<Array<{ sentence: string|null, ids: numberArray|null }>> {
  // TODO: fixed order and offset.
  const selectSentences = sql<ISelectSentencesQuery>`
    SELECT tokenids, sentorth
    FROM mat_adhocsentences
    WHERE transid = $transcriptId`
  const x = await query(selectSentences, { transcriptId })
  console.log('got', x.length, 'sentences')
  return x.map(r => ({ sentence: r.sentorth, ids: r.tokenids }))
}

async function getTranscripts(): Promise<number[]> {
  const selectTranscripts = sql<ISelectTranscriptsQuery>`
    SELECT id
    FROM transcript
    ORDER BY id
  `
  return (await query(selectTranscripts)).map(t => t.id)
}

async function writeTokens(tokens: WritableToken[]) {
  console.log('writing', tokens.length, 'tokens')
  const writeTokenPos = sql<IWriteTokenPosQuery>`
    UPDATE token
    SET
      sppos = vals.sppos,
      sptag = vals.sptag,
      splemma = vals.splemma,
      spdep = vals.spdep,
      spenttype = vals.spenttype
    FROM (
      VALUES $$tokens(id, spacy_pos, spacy_tag, spacy_lemma, spacy_dep, spacy_entity_type)
    ) as vals (id, sppos, sptag, splemma, spdep, spenttype)
    WHERE token.id = vals.id::INTEGER
  `
  // console.log(tokens)
  return query(writeTokenPos, { tokens })
}

async function runTaggerAndUpdate(transcriptId: number): Promise<any> {
  const ss = await getSentences(transcriptId)
  const ssWithTags = []
  // tag the sentences
  for (let s of ss) {
    if (s.sentence !== null && s.ids !== null) {
      const sentence = cleanUpSentence(s as any)
      const r = await fetch(spacyEndpoint, {
        method: 'POST',
        body: sentence.sentence,
      })
      ssWithTags.push({...sentence, tags: await r.json()})
    }
  }
  console.log(ss)
  // convert sentences to tokens with tags
  const tokens = ssWithTags.reduce((m, e, i, l) => {
    // only if every token in the sentence has a tag
    if (e.ids?.length === e.tags.length) {
      e.ids?.forEach((id, i) => {
        m.push({
          id,
          ...e.tags[i]
        })
      })
    } else {
      console.log('the lengths didn’t match', e)
    }
    return m
  }, [] as WritableToken[])
  // write ’em
  const chunks = _.chunk(tokens, 3000)
  for (const chunk of chunks) {
    console.log('writing chunk for', transcriptId)
    await writeTokens(chunk)
  }
  return true
}

(async () => {
  const transcriptIds = await getTranscripts() // this can also be set manually, like, [1, 5, 19]
  for (const id of transcriptIds) {
    await runTaggerAndUpdate(id)
  }
})();
