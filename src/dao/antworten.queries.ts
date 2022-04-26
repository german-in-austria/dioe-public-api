/** Types generated for queries found in "src/dao/antworten.ts" */

/** 'SelectAntworten' parameters type */
export interface ISelectAntwortenParams {
  tagID: readonly (number | null | void)[];
  osmId: string | null | void;
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
}

/** 'SelectAntworten' return type */
export interface ISelectAntwortenResult {
  startAntwort: string | null;
  stopAntwort: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number | null;
  osmid: string | null;
  tagName: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  idErhId: number | null;
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

/** 'CheckIfRep' parameters type */
export interface ICheckIfRepParams {
  tagId: readonly (number | null | void)[];
}

/** 'CheckIfRep' return type */
export interface ICheckIfRepResult {
  id: number;
}

/** 'CheckIfRep' query type */
export interface ICheckIfRepQuery {
  params: ICheckIfRepParams;
  result: ICheckIfRepResult;
}

/** 'CheckIfAufgabe' parameters type */
export interface ICheckIfAufgabeParams {
  tagId: readonly (number | null | void)[];
}

/** 'CheckIfAufgabe' return type */
export interface ICheckIfAufgabeResult {
  id: number;
}

/** 'CheckIfAufgabe' query type */
export interface ICheckIfAufgabeQuery {
  params: ICheckIfAufgabeParams;
  result: ICheckIfAufgabeResult;
}

/** 'GetTimeStampAntwort' parameters type */
export interface IGetTimeStampAntwortParams {
  tagId: readonly (number | null | void)[];
  osmId: string | null | void;
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
}

/** 'GetTimeStampAntwort' return type */
export interface IGetTimeStampAntwortResult {
  startAntwort: string | null;
  stopAntwort: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number | null;
  osmid: string | null;
  tagName: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  idErhId: number | null;
}

/** 'GetTimeStampAntwort' query type */
export interface IGetTimeStampAntwortQuery {
  params: IGetTimeStampAntwortParams;
  result: IGetTimeStampAntwortResult;
}

/** 'GetStampsFromAntwort' parameters type */
export interface IGetStampsFromAntwortParams {
  tagId: readonly (number | null | void)[];
  osmId: string | null | void;
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
}

/** 'GetStampsFromAntwort' return type */
export interface IGetStampsFromAntwortResult {
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

/** 'GetStampsFromAntwort' query type */
export interface IGetStampsFromAntwortQuery {
  params: IGetStampsFromAntwortParams;
  result: IGetStampsFromAntwortResult;
}

/** 'SelectAntwortenTrans' parameters type */
export interface ISelectAntwortenTransParams {
  tagID: readonly (number | null | void)[];
  osmId: string | null | void;
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
}

/** 'SelectAntwortenTrans' return type */
export interface ISelectAntwortenTransResult {
  startAntwort: string | null;
  stopAntwort: string | null;
  tagName: string | null;
  ortho: string | null;
  dateipfad: string | null;
  audiofile: string | null;
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

/** 'SelectMatchingTokens' parameters type */
export interface ISelectMatchingTokensParams {
  ortho: string | null | void;
  phon: string | null | void;
  lemma: string | null | void;
}

/** 'SelectMatchingTokens' return type */
export interface ISelectMatchingTokensResult {
  id: number;
  ortho: string | null;
  textInOrtho: string | null;
  splemma: string | null;
}

/** 'SelectMatchingTokens' query type */
export interface ISelectMatchingTokensQuery {
  params: ISelectMatchingTokensParams;
  result: ISelectMatchingTokensResult;
}

/** 'SelectErhebungsarten' parameters type */
export type ISelectErhebungsartenParams = void;

/** 'SelectErhebungsarten' return type */
export interface ISelectErhebungsartenResult {
  id: number;
  bezeichnung: string;
}

/** 'SelectErhebungsarten' query type */
export interface ISelectErhebungsartenQuery {
  params: ISelectErhebungsartenParams;
  result: ISelectErhebungsartenResult;
}

