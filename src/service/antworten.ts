import antwortenDao from '../dao/antworten';
import _, { filter, rest } from 'lodash';

import validator, { filters, tag } from '../service/validate';

import {
  ISelectSatzResult,
  ISelectAntwortFromAufgabeResult,
  ISelectAntwortenTransResult,
  ISelectMatchingTokensResult,
  ISelectErhebungsartenResult,
  ICheckIfTransResult,
  IGetTimeStampAntwortResult,
  ISelectInfErhebungenResult,
} from '../dao/antworten.queries';

export interface Antwort {
  start: any;
  stop: any;
  tagId: number | number[] | null;
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
  age: number;
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
    osmId: number,
    filters: filters
  ): Promise<AntwortTokenStamp[]> {
    const start = Date.now();
    let mergeArr: any = [];
    if (tagIDs.length === 0) {
      tagIDs = [-1];
    }
    if (
      (tagIDs[0] < 0 || filters.phaen[0] < 0) &&
      (filters.lemma.overall.length > 0 ||
        filters.text.overall.length > 0 ||
        filters.ortho.overall.length > 0)
    ) {
      const resTrans = await antwortenDao.selectAntwortenToken(
        filters.erhArt,
        filters.project,
        osmId.toString(),
        filters.ageLower,
        filters.ageUpper,
        filters.ausbildung,
        filters.beruf_id,
        filters.weiblich,
        filters.gender_sel,
        filters.text.case,
        filters.ortho.case,
        filters.textInOrtho.case,
        filters.lemma.case,
        filters.text.cI,
        filters.ortho.cI,
        filters.textInOrtho.cI,
        filters.lemma.cI
      );
      mergeArr = resTrans;
    } else {
      const transCheck: ICheckIfTransResult[] = await antwortenDao.checkIfTrans(
        tagIDs,
        filters.phaen
      );
      let resTrans: ISelectAntwortenTransResult[] = [];
      if (transCheck.length > 0) {
        console.log('starting');
        resTrans = await antwortenDao.selectAntwortenTrans(
          tagIDs[0] < 0 ? tagIDs : transCheck.map((el) => el.id),
          filters.erhArt,
          filters.project,
          osmId.toString(),
          filters.ageLower,
          filters.ageUpper,
          filters.ausbildung,
          filters.beruf_id,
          filters.weiblich,
          filters.gender_sel,
          filters.text.case,
          filters.ortho.case,
          filters.group ? (tagIDs[0] < 0 ? 0 : tagIDs.length) : 0,
          filters.phaen
        );
      }
      const end = Date.now() - start;
      console.log(`Execution time: ${end} ms`);
      let resAntAuf: IGetTimeStampAntwortResult[] = [];
      if (transCheck.length - tagIDs.length != 0 || resTrans.length === 0) {
        resAntAuf = await antwortenDao.getTimeStampAntwort(
          tagIDs,
          filters.erhArt,
          filters.project,
          osmId.toString(),
          filters.ageLower,
          filters.ageUpper,
          filters.ausbildung,
          filters.beruf_id,
          filters.weiblich,
          filters.gender_sel,
          filters.group ? (tagIDs[0] < 0 ? 0 : tagIDs.length) : 0,
          filters.phaen
        );
      }
      mergeArr = resTrans;
      mergeArr = mergeArr.concat(resAntAuf);
    }
    /*
    // Merge the results and add tagNum to the result
    const merged = this.mergeTagNum(mergeArr, tagNum);
    */
    let antworten: AntwortTokenStamp[] = [];
    mergeArr.forEach((el: any) => {
      // const cont = el.content;
      let ant: Antwort | AntwortToken = {} as Antwort;
      let tagId = el.tagId;
      if (tagId && tagId !== undefined) {
        // console.log(el);
        if (tagId.split(',').length > 1) {
          tagId = [
            ...new Set(el.tagId.replace(/[{}]*/g, '').split(',').map(Number)),
          ];
        } else {
          tagId = Number(tagId.replace(/[{}]*/g, ''));
        }
      } else if (tagIDs.length > 0 && tagIDs[0] > -1) {
        tagId = tagIDs[0];
      }
      let tag_name = el.tagname === undefined ? el.tagName : el.tagname;
      if (tag_name === undefined) {
        tag_name = '';
      }
      if (el.ortho || el.text || el.orthoText) {
        ant = {
          start: el.startAntwort,
          stop: el.stopAntwort,
          tagId: tagId,
          tagName: [...new Set(tag_name.replace(/[{}]*/g, '').split(','))].join(
            ','
          ),
          ortho: el.text,
          orthoText: el.orthoText,
        } as AntwortToken;
      } else {
        ant = {
          start: el.startAntwort,
          stop: el.stopAntwort,
          tagId: tagId,
          tagName: [...new Set(tag_name.replace(/[{}]*/g, '').split(','))].join(
            ','
          ),
        } as Antwort;
      }
      const newTimestamp: AntwortTokenStamp = {
        dateipfad: el.dateipfad,
        audiofile: el.audiofile,
        gruppeBez: el.gruppeBez,
        teamBez: el.teamBez,
        age: el.age,
        data: [ant],
      };
      const dataIdx = antworten.findIndex(
        (a: AntwortTokenStamp) =>
          a.dateipfad === el.dateipfad && a.audiofile === el.audiofile
      );
      if (el.ortho === 'einmal' && el.audiofile === '0210_0218_NMYB_GFG.ogg') {
        console.log(filters);
        console.log(el);
      }
      if (dataIdx >= 0) {
        // Data already exists in the return array.
        // Check if the timestamps are also already there
        const idx = antworten[dataIdx].data.findIndex(
          (a: Antwort | AntwortToken) => validator.compareTimeStamps(a, ant)
        );
        if (idx < 0) {
          // does not exist
          antworten[dataIdx].data.push(ant);
        } else {
          // exists
          // append tagName, ortho and orthoText to the existing timestamp
          const curr: Antwort | AntwortToken = antworten[dataIdx].data[idx];

          if (
            (<AntwortToken>curr).ortho !== undefined &&
            (<AntwortToken>ant).ortho !== undefined
          ) {
            // Is AntwortToken
            let currStr = (<AntwortToken>curr).ortho;
            const antStr = (<AntwortToken>ant).ortho;
            if (
              (currStr && antStr && !currStr.includes(antStr)) ||
              curr.tagName !== ant.tagName
            ) {
              if (currStr !== antStr) {
                (<AntwortToken>curr).ortho = `${currStr}, ${antStr}`;
                (<AntwortToken>curr).orthoText = `${currStr}, ${antStr}`;
              }
              if (
                curr.tagName &&
                !curr.tagName.includes(ant.tagName ? ant.tagName : '')
              ) {
                curr.tagName = `${curr.tagName}, ${ant.tagName}`;
              }
            }
          } else if (
            (<AntwortToken>curr).orthoText !== undefined &&
            (<AntwortToken>ant).orthoText !== undefined
          ) {
            // Is AntwortToken
            let currStr = (<AntwortToken>curr).orthoText;
            const antStr = (<AntwortToken>ant).orthoText;
            if (
              (currStr && antStr && !currStr.includes(antStr)) ||
              curr.tagName !== ant.tagName
            ) {
              if (
                currStr !== antStr &&
                !currStr?.includes(antStr ? antStr : '')
              ) {
                (<AntwortToken>curr).orthoText = `${currStr}, ${antStr}`;
              }
              if (
                curr.tagName &&
                !curr.tagName.includes(ant.tagName ? ant.tagName : '')
              ) {
                curr.tagName = `${curr.tagName}, ${ant.tagName}`;
              }
            }
          } else {
            // Is Antwort
            antworten[dataIdx].data.push(ant);
          }
        }
      } else {
        antworten.push(newTimestamp);
      }
    });
    return antworten;
  },
  async getAntSatz(str: string): Promise<ISelectSatzResult[]> {
    return antwortenDao.selectMatchingSatz(str);
  },
  async getErhebungsarten(): Promise<ISelectErhebungsartenResult[]> {
    return antwortenDao.selectErhebungsarten();
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
        start: el.startAntwort,
        stop: el.stopAntwort,
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
      ortho = `${ortho}%`;
    } else {
      ortho = '';
    }
    if (phon && phon.length > 0) {
      phon = `${phon}%`;
    } else {
      phon = '';
    }
    if (lemma && lemma.length > 0) {
      lemma = `${lemma}%`;
    } else {
      lemma = '';
    }
    let results = await antwortenDao.selectMatchingTokens(ortho, phon, lemma);
    // Extract unique results from results
    results = [
      ...new Map(
        results.map((v) => [
          JSON.stringify([v['ortho'], v['textInOrtho'], v['splemma']]),
          v,
        ])
      ).values(),
    ];
    return results;
  },
  async getInfErhebungen(
    osmId: number,
    erhId: number
  ): Promise<ISelectInfErhebungenResult[]> {
    return await antwortenDao.getErhebungsart(osmId.toString(), erhId);
  },
  groupBy<TItem>(xs: TItem[], key: string): { [key: string]: TItem[] } {
    return xs.reduce((rv: any, x: any) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  },
};
