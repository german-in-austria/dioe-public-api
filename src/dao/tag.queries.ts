/** Types generated for queries found in "src/dao/tag.ts" */
export type numberArray = (number)[];

/** 'SelectTagsLayers' parameters type */
export type ISelectTagsLayersParams = void;

/** 'SelectTagsLayers' return type */
export interface ISelectTagsLayersResult {
  id: number;
  name: string;
}

/** 'SelectTagsLayers' query type */
export interface ISelectTagsLayersQuery {
  params: ISelectTagsLayersParams;
  result: ISelectTagsLayersResult;
}

/** 'SelectTags' parameters type */
export type ISelectTagsParams = void;

/** 'SelectTags' return type */
export interface ISelectTagsResult {
  tagId: number;
  tagAbbrev: string;
  tagName: string | null;
  tagComment: string | null;
  tagOrder: number | null;
  phenomenId: number | null;
  phenomenName: string;
  tagEbeneName: string;
  tagEbeneId: number;
  childrenIds: numberArray | null;
  parentIds: numberArray | null;
}

/** 'SelectTags' query type */
export interface ISelectTagsQuery {
  params: ISelectTagsParams;
  result: ISelectTagsResult;
}

/** 'SelectOrtTags' parameters type */
export interface ISelectOrtTagsParams {
  tagId: number | null | void;
}

/** 'SelectOrtTags' return type */
export interface ISelectOrtTagsResult {
  numTag: string | null;
  tagName: string;
  tagLang: string | null;
  osmId: string | null;
  ortNamelang: string;
  lat: string | null;
  lon: string | null;
}

/** 'SelectOrtTags' query type */
export interface ISelectOrtTagsQuery {
  params: ISelectOrtTagsParams;
  result: ISelectOrtTagsResult;
}

