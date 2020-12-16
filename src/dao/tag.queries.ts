/** Types generated for queries found in "src/dao/tag.ts" */
export type numberArray = (number)[];

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
  childIds: numberArray | null;
}

/** 'SelectTags' query type */
export interface ISelectTagsQuery {
  params: ISelectTagsParams;
  result: ISelectTagsResult;
}

