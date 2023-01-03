/** Types generated for queries found in "src/dao/aufgaben.ts" */

/** 'SelectAufgabenSet' parameters type */
export interface ISelectAufgabenSetParams {
  phaenID: readonly (number | null | void)[];
}

/** 'SelectAufgabenSet' return type */
export interface ISelectAufgabenSetResult {
  fokus: string | null;
  id: number;
  kommentar: string | null;
  kuerzel: string;
  nameAset: string | null;
}

/** 'SelectAufgabenSet' query type */
export interface ISelectAufgabenSetQuery {
  params: ISelectAufgabenSetParams;
  result: ISelectAufgabenSetResult;
}

/** 'SelectAufgaben' parameters type */
export interface ISelectAufgabenParams {
  phaenID: readonly (number | null | void)[];
}

/** 'SelectAufgaben' return type */
export interface ISelectAufgabenResult {
  aufgabenstellung: string | null;
  beschreibungAufgabe: string | null;
  id: number;
}

/** 'SelectAufgaben' query type */
export interface ISelectAufgabenQuery {
  params: ISelectAufgabenParams;
  result: ISelectAufgabenResult;
}

/** 'SelectAufgabenFromSet' parameters type */
export interface ISelectAufgabenFromSetParams {
  aufgabenSet: readonly (number | null | void)[];
}

/** 'SelectAufgabenFromSet' return type */
export interface ISelectAufgabenFromSetResult {
  aufgabenstellung: string | null;
  beschreibungAufgabe: string | null;
  bezPhaenomen: string;
  id: number;
  kuerzel: string;
  nameAset: string | null;
  phaenId: number;
  setId: number;
  variante: number;
}

/** 'SelectAufgabenFromSet' query type */
export interface ISelectAufgabenFromSetQuery {
  params: ISelectAufgabenFromSetParams;
  result: ISelectAufgabenFromSetResult;
}

/** 'SelectAllAufgaben' parameters type */
export type ISelectAllAufgabenParams = void;

/** 'SelectAllAufgaben' return type */
export interface ISelectAllAufgabenResult {
  artBezeichnung: string;
  asetFokus: string | null;
  asetName: string | null;
  aufgabenstellung: string | null;
  aufId: number;
  beschreibung: string | null;
  kontext: string | null;
}

/** 'SelectAllAufgaben' query type */
export interface ISelectAllAufgabenQuery {
  params: ISelectAllAufgabenParams;
  result: ISelectAllAufgabenResult;
}

/** 'SelectOrtAufgabe' parameters type */
export interface ISelectOrtAufgabeParams {
  asetId: readonly (number | null | void)[];
  asetSinId: number | null | void;
  aufgID: readonly (number | null | void)[];
  aufId: number | null | void;
}

/** 'SelectOrtAufgabe' return type */
export interface ISelectOrtAufgabeResult {
  aufgabenstellung: string | null;
  id: number;
  lat: string | null;
  lon: string | null;
  numAufg: string | null;
  ortNamelang: string;
  osmId: string | null;
}

/** 'SelectOrtAufgabe' query type */
export interface ISelectOrtAufgabeQuery {
  params: ISelectOrtAufgabeParams;
  result: ISelectOrtAufgabeResult;
}

/** 'SelectAllTeams' parameters type */
export type ISelectAllTeamsParams = void;

/** 'SelectAllTeams' return type */
export interface ISelectAllTeamsResult {
  team: string | null;
  teamId: number;
}

/** 'SelectAllTeams' query type */
export interface ISelectAllTeamsQuery {
  params: ISelectAllTeamsParams;
  result: ISelectAllTeamsResult;
}

/** 'SelectAufgabeAudioByOrt' parameters type */
export interface ISelectAufgabeAudioByOrtParams {
  ageLower: number | null | void;
  ageUpper: number | null | void;
  aufIDs: readonly (number | null | void)[];
  osmId: string | null | void;
}

/** 'SelectAufgabeAudioByOrt' return type */
export interface ISelectAufgabeAudioByOrtResult {
  age: number | null;
  audiofile: string | null;
  aufgabe: string | null;
  dateipfad: string | null;
  gruppeBez: string | null;
  id: number | null;
  infSigle: string | null;
  startAufgabe: string | null;
  stopAufgabe: string | null;
  teamBez: string | null;
}

/** 'SelectAufgabeAudioByOrt' query type */
export interface ISelectAufgabeAudioByOrtQuery {
  params: ISelectAufgabeAudioByOrtParams;
  result: ISelectAufgabeAudioByOrtResult;
}

