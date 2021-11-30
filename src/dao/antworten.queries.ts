/** Types generated for queries found in "src/dao/antworten.ts" */

/** 'SelectAntworten' parameters type */
export interface ISelectAntwortenParams {
  tagID: readonly (number | null | void)[];
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
  gruppeBez: string | null;
  teamBez: string | null;
}

/** 'SelectAntworten' query type */
export interface ISelectAntwortenQuery {
  params: ISelectAntwortenParams;
  result: ISelectAntwortenResult;
}

/** 'SelectSatz' parameters type */
export interface ISelectSatzParams {
  str: string | null | void;
}

/** 'SelectSatz' return type */
export interface ISelectSatzResult {
  id: number;
  transkript: string | null;
  ipa: string | null;
}

/** 'SelectSatz' query type */
export interface ISelectSatzQuery {
  params: ISelectSatzParams;
  result: ISelectSatzResult;
}

/** 'SelectAntwortFromAufgabe' parameters type */
export interface ISelectAntwortFromAufgabeParams {
  satzid: number | null | void;
  aufgabeid: number | null | void;
}

/** 'SelectAntwortFromAufgabe' return type */
export interface ISelectAntwortFromAufgabeResult {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
  osmid: string | null;
  lat: string | null;
  lon: string | null;
  tagName: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  satzId: number | null;
  aufgabeId: number;
}

/** 'SelectAntwortFromAufgabe' query type */
export interface ISelectAntwortFromAufgabeQuery {
  params: ISelectAntwortFromAufgabeParams;
  result: ISelectAntwortFromAufgabeResult;
}

