/** Types generated for queries found in "src/dao/aufgaben.ts" */

/** 'SelectAufgabenSet' parameters type */
export interface ISelectAufgabenSetParams {
  phaenID: number | null | void;
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
  phaenID: number | null | void;
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
  aufgabenSet: number | null | void;
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

