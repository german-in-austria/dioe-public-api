import antwortenDao from "../dao/antworten";
import tagService from "../service/tag";
import _ from "lodash";

import { ISelectOrtTagsResult } from "src/dao/tag.queries";

import { ISelectAntwortenResult } from "src/dao/antworten.queries";

export interface Antworten {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
  osmid: string | null;
  tagName: string | null;
  ortho: string | null;
  orthoText: string | null;
}

export interface AntwortenTags extends Antworten {
  tagNum: string | null;
}

export default {
  async getAntwortenAudio(
    tagIDs: number[],
    osmId: number
  ): Promise<AntwortenTags[]> {
    const results: ISelectAntwortenResult[] =
      await antwortenDao.selectAntwortenAudio(tagIDs, osmId.toString());
    // Group the different time tags together into a single Array of Objects
    const tagNum = await tagService.getTagOrte(tagIDs);
    // Combine the results and return them to the controller
    return this.mergeTagNum(results, tagNum);
  },
  mergeTagNum(
    antworten: ISelectAntwortenResult[],
    tagNum: ISelectOrtTagsResult[]
  ): AntwortenTags[] {
    return antworten.map((a) => {
      const num = tagNum.filter(
        (e) => e.tagId === a.tagId && e.osmId === a.osmid
      )[0].numTag;
      return {
        ...a,
        tagNum: num,
      };
    });
  },
  groupBy<TItem>(xs: TItem[], key: string): { [key: string]: TItem[] } {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  },
};
