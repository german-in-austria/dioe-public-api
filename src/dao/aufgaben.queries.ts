/** Types generated for queries found in "src/dao/aufgaben.ts" */

/** 'SelectAufgabenSet' parameters type */
export interface ISelectAufgabenSetParams {
  phaenID: readonly (number | null | void)[];
}

/** 'SelectAufgabenSet' return type */
export interface ISelectAufgabenSetResult {
  id: number;
  kuerzel: string;
  nameAset: string | null;
  fokus: string | null;
  kommentar: string | null;
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
  id: number;
  beschreibungAufgabe: string | null;
  aufgabenstellung: string | null;
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
  id: number;
  variante: number;
  beschreibungAufgabe: string | null;
  beschreibungAufgabe: string | null;
  aufgabenstellung: string | null;
  kuerzel: string;
  nameAset: string | null;
  id: number;
  bezPhaenomen: string;
  id: number;
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
  aufId: number;
  beschreibung: string | null;
  aufgabenstellung: string | null;
  kontext: string | null;
  artBezeichnung: string;
  asetName: string | null;
  asetFokus: string | null;
}

/** 'SelectAllAufgaben' query type */
export interface ISelectAllAufgabenQuery {
  params: ISelectAllAufgabenParams;
  result: ISelectAllAufgabenResult;
}

/** 'SelectOrtAufgabe' parameters type */
export interface ISelectOrtAufgabeParams {
  aufgID: readonly (number | null | void)[];
}

/** 'SelectOrtAufgabe' return type */
export interface ISelectOrtAufgabeResult {
  numAufg: string | null;
  id: number;
  aufgabenstellung: string | null;
  ortNamelang: string;
  lat: string | null;
  lon: string | null;
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
  teamId: number;
  team: string | null;
}

/** 'SelectAllTeams' query type */
export interface ISelectAllTeamsQuery {
  params: ISelectAllTeamsParams;
  result: ISelectAllTeamsResult;
}

/** 'SelectAufgabeAudioByOrt' parameters type */
export interface ISelectAufgabeAudioByOrtParams {
  aufIDs: readonly (number | null | void)[];
  osmId: string | null | void;
}

/** 'SelectAufgabeAudioByOrt' return type */
export interface ISelectAufgabeAudioByOrtResult {
  id: number;
  aufgabe: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  startAufgabe: string;
  stopAufgabe: string;
  gruppeBez: string | null;
  teamBez: string | null;
}

/** 'SelectAufgabeAudioByOrt' query type */
export interface ISelectAufgabeAudioByOrtQuery {
  params: ISelectAufgabeAudioByOrtParams;
  result: ISelectAufgabeAudioByOrtResult;
}

