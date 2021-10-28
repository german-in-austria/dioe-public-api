/** Types generated for queries found in "src/dao/phaen.ts" */

/** 'SelectPhaenBer' parameters type */
export type ISelectPhaenBerParams = void;

/** 'SelectPhaenBer' return type */
export interface ISelectPhaenBerResult {
  id: number;
  bezPhaenber: string;
}

/** 'SelectPhaenBer' query type */
export interface ISelectPhaenBerQuery {
  params: ISelectPhaenBerParams;
  result: ISelectPhaenBerResult;
}

/** 'SelectPhaen' parameters type */
export type ISelectPhaenParams = void;

/** 'SelectPhaen' return type */
export interface ISelectPhaenResult {
  id: number;
  bezPhaenomen: string;
  beschrPhaenomen: string | null;
  bezPhaenber: string;
}

/** 'SelectPhaen' query type */
export interface ISelectPhaenQuery {
  params: ISelectPhaenParams;
  result: ISelectPhaenResult;
}

/** 'SelectSinglePhaen' parameters type */
export interface ISelectSinglePhaenParams {
  berId: number | null | void;
}

/** 'SelectSinglePhaen' return type */
export interface ISelectSinglePhaenResult {
  id: number;
  bezPhaenomen: string;
  beschrPhaenomen: string | null;
  bezPhaenber: string;
}

/** 'SelectSinglePhaen' query type */
export interface ISelectSinglePhaenQuery {
  params: ISelectSinglePhaenParams;
  result: ISelectSinglePhaenResult;
}

