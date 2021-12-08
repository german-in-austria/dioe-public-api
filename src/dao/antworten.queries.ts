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
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
  osmid: string | null;
  tagName: string | null;
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

/** 'CheckIfTrans' parameters type */
export interface ICheckIfTransParams {
  tagId: readonly (number | null | void)[];
}

/** 'CheckIfTrans' return type */
export interface ICheckIfTransResult {
  id: number;
}

/** 'CheckIfTrans' query type */
export interface ICheckIfTransQuery {
  params: ICheckIfTransParams;
  result: ICheckIfTransResult;
}

/** 'SelectAntwortenTrans' parameters type */
export interface ISelectAntwortenTransParams {
  tagID: readonly (number | null | void)[];
  osmId: string | null | void;
}

/** 'SelectAntwortenTrans' return type */
export interface ISelectAntwortenTransResult {
  startAntwort: string | null;
  stopAntwort: string | null;
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

/** 'SelectAntwortenTrans' query type */
export interface ISelectAntwortenTransQuery {
  params: ISelectAntwortenTransParams;
  result: ISelectAntwortenTransResult;
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

