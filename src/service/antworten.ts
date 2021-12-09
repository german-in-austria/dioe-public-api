import antwortenDao from "../dao/antworten";
import tagService from "../service/tag";
import _ from "lodash";

import { ISelectOrtTagsResult } from "src/dao/tag.queries";

import {
  ISelectAntwortenResult,
  ISelectSatzResult,
  ISelectAntwortFromAufgabeResult,
  ICheckIfTransResult,
  ISelectAntwortenTransResult,
  ISelectMatchingTokensResult,
} from "../dao/antworten.queries";

export interface Antwort {
  startAntwort: string;
  stopAntwort: string;
  tagId: number;
  tagName: string | null;
}

export interface AntwortAufgabe extends Antwort {
  satzId: number | null;
  aufgabeId: number;
}

export interface AntwortToken extends Antwort {
  ortho: string | null;
  orthoText: string | null;
}

export interface AntwortTokenStamp {
  dateipfad: string | null;
  audiofile: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  data: (Antwort | AntwortToken)[];
}

export interface AntwortTimestamp {
  dateipfad: string | null;
  audiofile: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  data: Antwort[];
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
  ): Promise<AntwortTokenStamp[]> {
    const transCheck: ICheckIfTransResult[] = await antwortenDao.checkIfTrans(
      tagIDs
    );
    let antIDs = [] as number[];
    let transIDs = [] as number[];
    tagIDs.forEach((el) => {
      if (transCheck.some((tag) => tag.id === el)) {
        transIDs.push(el);
      } else {
        antIDs.push(el);
      }
    });
    let resTrans: ISelectAntwortenTransResult[] = [];
    let resAnt: ISelectAntwortenResult[] = [];
    if (transIDs.length > 0) {
      resTrans = await antwortenDao.selectAntwortenTrans(
        transIDs,
        osmId.toString()
      );
    }
    if (antIDs.length > 0) {
      resAnt = await antwortenDao.selectAntwortenAudio(
        antIDs,
        osmId.toString()
      );
    }
    // Group the different time tags together into a single Array of Objects
    // const tagNum = await tagService.getTagOrte(tagIDs);

    // let mergeArr: Array<{ tagId: number; osmid: string }> = resTrans;
    let mergeArr: any = resTrans;
    mergeArr = mergeArr.concat(resAnt);
    /*
    mergeArr = [
      ...new Map(
        data.map((v) => [JSON.stringify([v["tagId"], v["osmid"]]), v])
      ).values(),
    ];
    // Merge the results and add tagNum to the result
    const merged = this.mergeTagNum(mergeArr, tagNum);
    */
    let antworten: AntwortTokenStamp[] = [];
    mergeArr.forEach((el: any) => {
      // const cont = el.content;
      let ant: Antwort | AntwortToken = {} as Antwort;
      if (el.ortho) {
        ant = {
          startAntwort: el.startAntwort,
          stopAntwort: el.stopAntwort,
          tagId: el.tagId,
          tagName: el.tagName,
          ortho: el.ortho,
          orthoText: el.orthoText,
        } as AntwortToken;
      } else {
        ant = {
          startAntwort: el.startAntwort,
          stopAntwort: el.stopAntwort,
          tagId: el.tagId,
          tagName: el.tagName,
        } as Antwort;
      }
      const newTimestamp: AntwortTokenStamp = {
        dateipfad: el.dateipfad,
        audiofile: el.audiofile,
        gruppeBez: el.gruppeBez,
        teamBez: el.teamBez,
        data: [ant],
      };
      const dataIdx = antworten.findIndex(
        (a: AntwortTokenStamp) =>
          a.dateipfad === el.dateipfad && a.audiofile === el.audiofile
      );
      if (dataIdx >= 0) {
        antworten[dataIdx].data.push(ant);
      } else {
        antworten.push(newTimestamp);
      }
    });
    return antworten;
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
      const newAntwort: AntwortAufgabe = {
        startAntwort: el.startAntwort,
        stopAntwort: el.stopAntwort,
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
  async getMatchingTokens(
    ortho: string | undefined | null,
    phon: string | undefined | null,
    lemma: string | undefined | null
  ): Promise<ISelectMatchingTokensResult[]> {
    if (ortho && ortho.length > 0) {
      ortho = `%${ortho}%`;
    } else {
      ortho = "";
    }
    if (phon && phon.length > 0) {
      phon = `%${phon}%`;
    } else {
      phon = "";
    }
    if (lemma && lemma.length > 0) {
      lemma = `%${lemma}%`;
    } else {
      lemma = "";
    }
    return antwortenDao.selectMatchingTokens(ortho, phon, lemma);
  },
  mergeTagNum(
    antworten: Array<{ tagId: number; osmid: string }>,
    tagNum: ISelectOrtTagsResult[]
  ): Array<{
    tagId: number;
    osmid: string;
    tagNum: string | null;
  }> {
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