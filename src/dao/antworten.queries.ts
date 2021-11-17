/** Types generated for queries found in "src/dao/antworten.ts" */

/** 'SelectAntworten' parameters type */
export interface ISelectAntwortenParams {
  tagID: Array<number | null | void>;
  osmId: string | null | void;
}

/** 'SelectAntworten' return type */
export interface ISelectAntwortenResult {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
  osmid: string | null;
  tagName: string | null;
  ortho: string | null;
  orthoText: string | null;
  startTime: string | null;
  endTime: string | null;
}

/** 'SelectAntworten' query type */
export interface ISelectAntwortenQuery {
  params: ISelectAntwortenParams;
  result: ISelectAntwortenResult;
}

