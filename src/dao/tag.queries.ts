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
  tagId: number;
  tagAbbrev: string;
  tagGene: number | null;
  tagName: string | null;
  tagComment: string | null;
  tagOrder: number | null;
  phenomenId: number | null;
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
  tagId: number;
  tagAbbrev: string;
  tagGene: number | null;
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

/** 'SelectSingleGen' parameters type */
export interface ISelectSingleGenParams {
  gen: number | null | void;
}

/** 'SelectSingleGen' return type */
export interface ISelectSingleGenResult {
  tagId: number;
  tagAbbrev: string;
  tagGene: number | null;
  tagName: string | null;
  tagComment: string | null;
  tagOrder: number | null;
  phenomenId: number | null;
}

/** 'SelectSingleGen' query type */
export interface ISelectSingleGenQuery {
  params: ISelectSingleGenParams;
  result: ISelectSingleGenResult;
}

/** 'SelectOrtTags' parameters type */
export interface ISelectOrtTagsParams {
  tagId: readonly (number | null | void)[];
  erhArt: readonly (number | null | void)[];
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
  project_id: number | null | void;
}

/** 'SelectOrtTags' return type */
export interface ISelectOrtTagsResult {
  numTag: string | null;
  tagName: string;
  tagLang: string | null;
  tagId: number;
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

/** 'SelectOrtTagGroup' parameters type */
export interface ISelectOrtTagGroupParams {
  tagId: readonly (number | null | void)[];
  erhArt: readonly (number | null | void)[];
  aus: string | null | void;
  beruf: number | null | void;
  gender_sel: number | null | void;
  gender: boolean | null | void;
  tagGroupLength: string | null | void;
  project_id: number | null | void;
}

/** 'SelectOrtTagGroup' return type */
export interface ISelectOrtTagGroupResult {
  numTag: string | null;
  tagName: string;
  tagLang: string | null;
  tagId: number;
  osmId: string | null;
  ortNamelang: string;
  lat: string | null;
  lon: string | null;
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
  numTag: string | null;
  presetId: number;
  presetName: string;
  osmId: string | null;
  ortNamelang: string;
  lat: string | null;
  lon: string | null;
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
  id: number;
  bezeichnung: string;
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
  presetId: number;
  bezeichnung: string;
  tagId: number;
  tag: string;
  tagLang: string | null;
  generation: number | null;
}

/** 'GetTagsByPreset' query type */
export interface IGetTagsByPresetQuery {
  params: IGetTagsByPresetParams;
  result: IGetTagsByPresetResult;
}

