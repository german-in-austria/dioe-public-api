/** Types generated for queries found in "src/scripts/tag-pos-spacy.ts" */
export type numberArray = (number)[];

/** 'SelectSentences' parameters type */
export interface ISelectSentencesParams {
  transcriptId: number | null | void;
}

/** 'SelectSentences' return type */
export interface ISelectSentencesResult {
  sentorth: string | null;
  tokenids: numberArray | null;
}

/** 'SelectSentences' query type */
export interface ISelectSentencesQuery {
  params: ISelectSentencesParams;
  result: ISelectSentencesResult;
}

/** 'SelectTranscripts' parameters type */
export type ISelectTranscriptsParams = void;

/** 'SelectTranscripts' return type */
export interface ISelectTranscriptsResult {
  id: number;
}

/** 'SelectTranscripts' query type */
export interface ISelectTranscriptsQuery {
  params: ISelectTranscriptsParams;
  result: ISelectTranscriptsResult;
}

/** 'WriteTokenPos' parameters type */
export interface IWriteTokenPosParams {
  tokens: readonly ({
    id: string | null | void,
    spacy_pos: string | null | void,
    spacy_tag: string | null | void,
    spacy_lemma: string | null | void,
    spacy_dep: string | null | void,
    spacy_entity_type: string | null | void
  })[];
}

/** 'WriteTokenPos' return type */
export type IWriteTokenPosResult = void;

/** 'WriteTokenPos' query type */
export interface IWriteTokenPosQuery {
  params: IWriteTokenPosParams;
  result: IWriteTokenPosResult;
}

