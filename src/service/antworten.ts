import antwortenDao from "../dao/antworten";
import tagService from "../service/tag";
import _ from "lodash";

import { ISelectOrtTagsResult } from "src/dao/tag.queries";

import { ISelectAntwortenResult } from "src/dao/antworten.queries";

export interface AntwortenTags extends ISelectAntwortenResult {
  tagNum: string | null;
}

export default {
  async getAntwortenAudio(tagIDs: number[]): Promise<AntwortenTags[]> {
    const results = await antwortenDao.selectAntwortenAudio(tagIDs);
    const tagNum = await tagService.getTagOrte(tagIDs);
    // Combine the results and return them to the controller
    return this.mergeTagNum(results, tagNum);
  },
  mergeTagNum(
    antworten: ISelectAntwortenResult[],
    tagNum: ISelectOrtTagsResult[]
  ): AntwortenTags[] {
    return antworten.map((a) => {
      const num = tagNum.filter((e) => e.tagId === a.tagId)[0].numTag;
      return {
        ...a,
        tagNum: num,
      };
    });
  },
};
