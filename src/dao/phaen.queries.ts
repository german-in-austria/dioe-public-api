/** Types generated for queries found in "src/dao/phaen.ts" */

/** 'SelectPhaenBer' parameters type */
export type ISelectPhaenBerParams = void;

/** 'SelectPhaenBer' return type */
export interface ISelectPhaenBerResult {
  bezPhaenber: string;
  id: number;
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
  beschrPhaenomen: string | null;
  bezPhaenber: string;
  bezPhaenomen: string;
  id: number;
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
  beschrPhaenomen: string | null;
  bezPhaenber: string;
  bezPhaenomen: string;
  id: number;
}

/** 'SelectSinglePhaen' query type */
export interface ISelectSinglePhaenQuery {
  params: ISelectSinglePhaenParams;
  result: ISelectSinglePhaenResult;
}

/** 'SelectTagByPhaen' parameters type */
export interface ISelectTagByPhaenParams {
  ids: readonly (number | null | void)[];
}

/** 'SelectTagByPhaen' return type */
export interface ISelectTagByPhaenResult {
  generation: number | null;
  phaen: string;
  tagId: number;
  tagLang: string | null;
  tagName: string;
}

/** 'SelectTagByPhaen' query type */
export interface ISelectTagByPhaenQuery {
  params: ISelectTagByPhaenParams;
  result: ISelectTagByPhaenResult;
}

