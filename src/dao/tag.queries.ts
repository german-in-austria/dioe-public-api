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

/** 'SelectTagById' parameters type */
export interface ISelectTagByIdParams {
  tagId: number | null | void;
}

/** 'SelectTagById' return type */
export interface ISelectTagByIdResult {
  phenomenId: number | null;
  tagAbbrev: string;
  tagComment: string | null;
  tagGene: number | null;
  tagId: number;
  tagName: string | null;
  tagOrder: number | null;
}

/** 'SelectTagById' query type */
export interface ISelectTagByIdQuery {
  params: ISelectTagByIdParams;
  result: ISelectTagByIdResult;
}

/** 'SelectTags' parameters type */
export type ISelectTagsParams = void;

/** 'SelectTags' return type */
export interface ISelectTagsResult {
  childrenIds: numberArray | null;
  parentIds: numberArray | null;
  phenomenId: number | null;
  phenomenName: string;
  tagAbbrev: string;
  tagComment: string | null;
  tagEbeneId: number;
  tagEbeneName: string;
  tagGene: number | null;
  tagId: number;
  tagName: string | null;
  tagOrder: number | null;
}

/** 'SelectTags' query type */
export interface ISelectTagsQuery {
  params: ISelectTagsParams;
  result: ISelectTagsResult;
}

/** 'SelectSingleGen' parameters type */
export interface ISelectSingleGenParams {
  gen: number | null | void;
}

/** 'SelectSingleGen' return type */
export interface ISelectSingleGenResult {
  phenomenId: number | null;
  tagAbbrev: string;
  tagComment: string | null;
  tagGene: number | null;
  tagId: number;
  tagName: string | null;
  tagOrder: number | null;
}

/** 'SelectSingleGen' query type */
export interface ISelectSingleGenQuery {
  params: ISelectSingleGenParams;
  result: ISelectSingleGenResult;
}

/** 'SelectOrtToken' parameters type */
export interface ISelectOrtTokenParams {
  aus: string | null | void;
  beruf: number | null | void;
  erhArt: readonly (number | null | void)[];
  firstTagId: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  lemmaTokenC: string | null | void;
  lemmaTokenCI: string | null | void;
  project_id: number | null | void;
  tagId: readonly (number | null | void)[];
  tagLen: string | null | void;
  textOrtho: string | null | void;
  textTag: string | null | void;
}

/** 'SelectOrtToken' return type */
export interface ISelectOrtTokenResult {
  lat: string | null;
  lon: string | null;
  numTag: string | null;
  ortNamelang: string;
  osmId: string | null;
  tagName: string | null;
}

/** 'SelectOrtToken' query type */
export interface ISelectOrtTokenQuery {
  params: ISelectOrtTokenParams;
  result: ISelectOrtTokenResult;
}

/** 'SelectOrtTokenSingle' parameters type */
export interface ISelectOrtTokenSingleParams {
  aus: string | null | void;
  beruf: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  project_id: number | null | void;
  textTagC: string | null | void;
  textTagCI: string | null | void;
  tokenLemmaC: string | null | void;
  tokenLemmaCI: string | null | void;
}

/** 'SelectOrtTokenSingle' return type */
export interface ISelectOrtTokenSingleResult {
  lat: string | null;
  lon: string | null;
  numTag: string | null;
  ortNamelang: string;
  osmId: string | null;
}

/** 'SelectOrtTokenSingle' query type */
export interface ISelectOrtTokenSingleQuery {
  params: ISelectOrtTokenSingleParams;
  result: ISelectOrtTokenSingleResult;
}

/** 'SelectOrtTags' parameters type */
export interface ISelectOrtTagsParams {
  aus: string | null | void;
  beruf: number | null | void;
  erhArt: readonly (number | null | void)[];
  gender: boolean | null | void;
  gender_sel: number | null | void;
  phaen: readonly (number | null | void)[];
  phaen_first: number | null | void;
  project_id: number | null | void;
  tagId: readonly (number | null | void)[];
  tagId_first: number | null | void;
}

/** 'SelectOrtTags' return type */
export interface ISelectOrtTagsResult {
  lat: string | null;
  lon: string | null;
  numTag: string | null;
  ortNamelang: string;
  osmId: string | null;
  tagName: string | null;
}

/** 'SelectOrtTags' query type */
export interface ISelectOrtTagsQuery {
  params: ISelectOrtTagsParams;
  result: ISelectOrtTagsResult;
}

/** 'SelectOrtTagGroup' parameters type */
export interface ISelectOrtTagGroupParams {
  aus: string | null | void;
  beruf: number | null | void;
  erhArt: readonly (number | null | void)[];
  firstTag: number | null | void;
  gender: boolean | null | void;
  gender_sel: number | null | void;
  phaen: readonly (number | null | void)[];
  phaen_first: number | null | void;
  project_id: number | null | void;
  tagGroupLength: string | null | void;
  tagId: readonly (number | null | void)[];
}

/** 'SelectOrtTagGroup' return type */
export interface ISelectOrtTagGroupResult {
  lat: string | null;
  lon: string | null;
  numTag: string | null;
  ortNamelang: string;
  osmId: string | null;
  tagName: string | null;
}

/** 'SelectOrtTagGroup' query type */
export interface ISelectOrtTagGroupQuery {
  params: ISelectOrtTagGroupParams;
  result: ISelectOrtTagGroupResult;
}

/** 'GetPresetOrtTag' parameters type */
export interface IGetPresetOrtTagParams {
  tagIDs: readonly (number | null | void)[];
}

/** 'GetPresetOrtTag' return type */
export interface IGetPresetOrtTagResult {
  lat: string | null;
  lon: string | null;
  numTag: string | null;
  ortNamelang: string;
  osmId: string | null;
  presetId: number;
  presetName: string;
}

/** 'GetPresetOrtTag' query type */
export interface IGetPresetOrtTagQuery {
  params: IGetPresetOrtTagParams;
  result: IGetPresetOrtTagResult;
}

/** 'GetPresetTags' parameters type */
export type IGetPresetTagsParams = void;

/** 'GetPresetTags' return type */
export interface IGetPresetTagsResult {
  bezeichnung: string;
  id: number;
  kommentar: string | null;
}

/** 'GetPresetTags' query type */
export interface IGetPresetTagsQuery {
  params: IGetPresetTagsParams;
  result: IGetPresetTagsResult;
}

/** 'GetTagsByPreset' parameters type */
export interface IGetTagsByPresetParams {
  tagIDs: readonly (number | null | void)[];
}

/** 'GetTagsByPreset' return type */
export interface IGetTagsByPresetResult {
  bezeichnung: string;
  generation: number | null;
  presetId: number;
  tag: string;
  tagId: number;
  tagLang: string | null;
}

/** 'GetTagsByPreset' query type */
export interface IGetTagsByPresetQuery {
  params: IGetTagsByPresetParams;
  result: IGetTagsByPresetResult;
}

