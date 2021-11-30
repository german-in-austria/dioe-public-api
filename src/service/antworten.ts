import antwortenDao from "../dao/antworten";
import tagService from "../service/tag";
import _ from "lodash";

import { ISelectOrtTagsResult } from "src/dao/tag.queries";

import {
  ISelectAntwortenResult,
  ISelectSatzResult,
  ISelectAntwortFromAufgabeResult,
} from "../dao/antworten.queries";

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

export interface AntwortTimestamp {
  dateipfad: string | null;
  audiofile: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  data: Antwort[];
}

export interface Antwort {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  tagId: number;
  tagName: string | null;
  satzId: number | null;
  aufgabeId: number;
}

export interface AntwortenFromAufgabe {
  osmid: string | null;
  lat: string | null;
  lon: string | null;
  data: AntwortTimestamp[];
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
  async getAntSatz(str: string): Promise<ISelectSatzResult[]> {
    return antwortenDao.selectMatchingSatz(str);
  },
  async getAntFromAufgabe(
    satzid: number | undefined | null,
    aufgabeid: number | undefined | null
  ): Promise<AntwortenFromAufgabe[]> {
    let sid = -1;
    let aid = -1;
    if (satzid && satzid >= 0) sid = satzid;
    if (aufgabeid && aufgabeid >= 0) aid = aufgabeid;
    const res: ISelectAntwortFromAufgabeResult[] =
      await antwortenDao.selectAntwortenFromAufgaben(sid, aid);

    let antworten: AntwortenFromAufgabe[] = [];
    res.forEach((el) => {
      const newAntwort: Antwort = {
        startAntwort: el.startAntwort,
        stopAntwort: el.stopAntwort,
        kommentar: el.kommentar,
        tagId: el.tagId,
        tagName: el.tagName,
        satzId: el.satzId,
        aufgabeId: el.aufgabeId,
      };
      const newTimestamp: AntwortTimestamp = {
        dateipfad: el.dateipfad,
        audiofile: el.audiofile,
        gruppeBez: el.gruppeBez,
        teamBez: el.teamBez,
        data: [newAntwort],
      };
      const idx = antworten.findIndex(
        (a: AntwortenFromAufgabe) => a.osmid === el.osmid
      );
      if (idx >= 0) {
        // Element exists
        const dataIdx = antworten[idx].data.findIndex(
          (a: AntwortTimestamp) =>
            a.dateipfad === el.dateipfad && a.audiofile === el.audiofile
        );
        dataIdx >= 0
          ? antworten[idx].data[dataIdx].data.push(newAntwort)
          : antworten[idx].data.push(newTimestamp);
      } else {
        antworten.push({
          lat: el.lat,
          lon: el.lon,
          osmid: el.osmid,
          data: [newTimestamp],
        });
      }
    });
    return antworten;
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
