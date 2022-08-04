/** Types generated for queries found in "src/dao/antworten.ts" */

/** 'SelectAntworten' parameters type */
export interface ISelectAntwortenParams {
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  osmId: string | null | void;
  tagID: readonly (number | null | void)[];
}

/** 'SelectAntworten' return type */
export interface ISelectAntwortenResult {
  audiofile: string | null;
  dateipfad: string | null;
  gruppeBez: string | null;
  idErhId: number | null;
  osmid: string | null;
  startAntwort: string | null;
  stopAntwort: string | null;
  tagId: number | null;
  tagName: string | null;
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
  ipa: string | null;
  transkript: string | null;
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
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  osmId: string | null | void;
  tagGroupLength: string | null | void;
  tagId: readonly (number | null | void)[];
}

/** 'GetTimeStampAntwort' return type */
export interface IGetTimeStampAntwortResult {
  audiofile: string | null;
  dateipfad: string | null;
  gruppeBez: string | null;
  idErhId: number | null;
  osmid: string | null;
  startAntwort: string | null;
  stopAntwort: string | null;
  tagId: number | null;
  tagName: string | null;
  teamBez: string | null;
}

/** 'GetTimeStampAntwort' query type */
export interface IGetTimeStampAntwortQuery {
  params: IGetTimeStampAntwortParams;
  result: IGetTimeStampAntwortResult;
}

/** 'GetStampsFromAntwort' parameters type */
export interface IGetStampsFromAntwortParams {
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  osmId: string | null | void;
  tagId: readonly (number | null | void)[];
}

/** 'GetStampsFromAntwort' return type */
export interface IGetStampsFromAntwortResult {
  audiofile: string | null;
  dateipfad: string | null;
  gruppeBez: string | null;
  osmid: string | null;
  startAntwort: string;
  stopAntwort: string;
  tagId: number;
  tagName: string | null;
  teamBez: string | null;
}

/** 'GetStampsFromAntwort' query type */
export interface IGetStampsFromAntwortQuery {
  params: IGetStampsFromAntwortParams;
  result: IGetStampsFromAntwortResult;
}

/** 'SelectAntwortenTrans' parameters type */
export interface ISelectAntwortenTransParams {
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aus: string | null | void;
  beruf: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  osmId: string | null | void;
  tagGroupLength: string | null | void;
  tagID: readonly (number | null | void)[];
}

/** 'SelectAntwortenTrans' return type */
export interface ISelectAntwortenTransResult {
  audiofile: string | null;
  dateipfad: string | null;
  gruppeBez: string | null;
  ortho: string | null;
  orthoText: string | null;
  startAntwort: string | null;
  stopAntwort: string | null;
  tagName: string | null;
  teamBez: string | null;
}

/** 'SelectAntwortenTrans' query type */
export interface ISelectAntwortenTransQuery {
  params: ISelectAntwortenTransParams;
  result: ISelectAntwortenTransResult;
}

/** 'SelectAntwortFromAufgabe' parameters type */
export interface ISelectAntwortFromAufgabeParams {
  aufgabeid: number | null | void;
  satzid: number | null | void;
}

/** 'SelectAntwortFromAufgabe' return type */
export interface ISelectAntwortFromAufgabeResult {
  audiofile: string | null;
  aufgabeId: number;
  dateipfad: string | null;
  gruppeBez: string | null;
  kommentar: string | null;
  lat: string | null;
  lon: string | null;
  osmid: string | null;
  satzId: number | null;
  startAntwort: string;
  stopAntwort: string;
  tagId: number;
  tagName: string | null;
  teamBez: string | null;
}

/** 'SelectAntwortFromAufgabe' query type */
export interface ISelectAntwortFromAufgabeQuery {
  params: ISelectAntwortFromAufgabeParams;
  result: ISelectAntwortFromAufgabeResult;
}

/** 'SelectMatchingTokens' parameters type */
export interface ISelectMatchingTokensParams {
  lemma: string | null | void;
  ortho: string | null | void;
  phon: string | null | void;
}

/** 'SelectMatchingTokens' return type */
export interface ISelectMatchingTokensResult {
  id: number;
  ortho: string | null;
  splemma: string | null;
  textInOrtho: string | null;
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
  bezeichnung: string;
  id: number;
}

/** 'SelectErhebungsarten' query type */
export interface ISelectErhebungsartenQuery {
  params: ISelectErhebungsartenParams;
  result: ISelectErhebungsartenResult;
}

/** 'SelectInfErhebungen' parameters type */
export interface ISelectInfErhebungenParams {
  erhId: number | null | void;
  osmId: string | null | void;
}

/** 'SelectInfErhebungen' return type */
export interface ISelectInfErhebungenResult {
  audiofile: string | null;
  besonderheiten: string | null;
  dateipfad: string | null;
  datum: Date;
  idErhId: number;
  idTranscriptId: number | null;
  kommentar: string | null;
  osmId: string | null;
}

/** 'SelectInfErhebungen' query type */
export interface ISelectInfErhebungenQuery {
  params: ISelectInfErhebungenParams;
  result: ISelectInfErhebungenResult;
}

