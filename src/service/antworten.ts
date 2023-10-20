import antwortenDao from '../dao/antworten';
import _, { filter, isFunction, rest } from 'lodash';

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
  bezErhebung: string;
  erhArt: string;
  erhArtId: number;
}

export interface AntwortKontext {
  reihung: number;
  ortho: string;
  sppos: string;
  text: string;
  phon: string;
  sigle: string;
}

export interface AntwortAufgabe extends Antwort {
  satzId: number | null;
  aufgabeId: number;
}

export interface AntwortToken extends Antwort {
  ortho: string | null;
  orthoText: string | null;
  text: string | null;
  phon: string | null;
  transcript: string | null;
  stdOrth: string | null;
  kontext: AntwortKontext[];
  reihung: number;
}

export interface AntwortTokenStamp {
  dateipfad: string | null;
  audiofile: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  sigle: string;
  age: number;
  res: {
    data: (Antwort | AntwortToken)[];
    id: string;
  }[];
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
    tagIDs: number[][],
    osmId: number[],
    ids: string[],
    filters: filters[]
  ): Promise<AntwortTokenStamp[]> {
    let start = Date.now();
    let mergeArr: any = [];
    for (let idx = 0; idx < ids.length; idx++) {
      let tagId = tagIDs[idx];
      const filter = filters[idx];
      const el = osmId[idx];
      const id = ids[idx];
      let content = [] as any[];

      if (tagId.length === 0) {
        tagId = [-1];
      }
      if (
        (tagId[0] < 0 || filter.phaen[0] < 0) &&
        (filter.lemma.overall.length > 0 ||
          filter.text.overall.length > 0 ||
          filter.ortho.overall.length > 0)
      ) {
        const resTrans = await antwortenDao.selectAntwortenToken(
          filter.erhArt,
          filter.project,
          el.toString(),
          filter.ageLower,
          filter.ageUpper,
          filter.ausbildung,
          filter.beruf_id,
          filter.weiblich,
          filter.gender_sel,
          filter.text.case,
          filter.ortho.case,
          filter.textInOrtho.case,
          filter.lemma.case,
          filter.text.cI,
          filter.ortho.cI,
          filter.textInOrtho.cI,
          filter.lemma.cI,
          5
        );
        content = resTrans;
      } else {
        const transCheck = tagId;
        /*const transCheck: ICheckIfTransResult[] =
          await antwortenDao.checkIfTrans(tagId, filter.phaen);*/
        let resTrans: ISelectAntwortenTransResult[] = [];
        if (transCheck.length > 0) {
          console.log('starting');
          resTrans = await antwortenDao.selectAntwortenTrans(
            tagId[0] < 0 ? tagId : transCheck.map((el) => el),
            filter.erhArt,
            filter.project,
            el.toString(),
            filter.ageLower,
            filter.ageUpper,
            filter.ausbildung,
            filter.beruf_id,
            filter.weiblich,
            filter.gender_sel,
            filter.group ? (tagId[0] < 0 ? 0 : tagId.length) : 0,
            filter.phaen,
            5
          );
        }
        let end = Date.now() - start;
        console.log(`Execution time: ${end} ms`);
        let resAntAuf: IGetTimeStampAntwortResult[] = [];
        if (transCheck.length - tagId.length != 0 || resTrans.length === 0) {
          resAntAuf = await antwortenDao.getTimeStampAntwort(
            tagId,
            filter.erhArt,
            filter.project,
            el.toString(),
            filter.ageLower,
            filter.ageUpper,
            filter.ausbildung,
            filter.beruf_id,
            filter.weiblich,
            filter.gender_sel,
            filter.group ? (tagId[0] < 0 ? 0 : tagId.length) : 0,
            filter.phaen
          );
        }
        content = resTrans;
        content = content.concat(resAntAuf);
      }
      content.map((el) => {
        el.id = id;
        return el;
      });
      mergeArr = mergeArr.concat(content);
    }
    /*
    // Merge the results and add tagNum to the result
    const merged = this.mergeTagNum(mergeArr, tagNum);
    */
    let antworten: AntwortTokenStamp[] = [];
    start = Date.now();
    mergeArr
      .filter((el: any) => {
        if (el.tokenreihung) {
          return (
            el.tokenreihung === el.kontextreihung &&
            el.infSigle === el.kontextsigle
          );
        } else {
          return true;
        }
      })
      .forEach((el: any) => {
        let ant: Antwort | AntwortToken = {} as Antwort;
        let tagId = el.tagId;
        if (tagId && tagId !== undefined) {
          if (tagId.split(',').length > 1) {
            tagId = [
              ...new Set(el.tagId.replace(/[{}]*/g, '').split(',').map(Number)),
            ];
          } else {
            tagId = Number(tagId.replace(/[{}]*/g, ''));
          }
        }
        let tag_name = el.tagname === undefined ? el.tagName : el.tagname;
        if (tag_name === undefined) {
          tag_name = '';
        }
        if (el.ortho || el.text || el.orthoText) {
          let kontext: AntwortKontext[] = [];
          kontext = mergeArr
            .filter((kontextEl: any) => {
              return (
                el.ortho === kontextEl.ortho &&
                el.text === kontextEl.text &&
                el.dateipfad === kontextEl.dateipfad &&
                el.audiofile === kontextEl.audiofile &&
                el.tagShort === kontextEl.tagShort &&
                validator.compareTimeStampsIfEqual(
                  { start: el.startAntwort, stop: el.stopAntwort } as Antwort,
                  {
                    start: kontextEl.startAntwort,
                    stop: kontextEl.stopAntwort,
                  } as Antwort
                )
              );
            })
            .map((kontextEl: any) => ({
              reihung: kontextEl.kontextreihung,
              ortho: kontextEl.kontextortho,
              sppos: kontextEl.kontextsppos,
              text: kontextEl.kontexttext,
              phon: kontextEl.kontextphon,
              sigle: kontextEl.kontextsigle,
            }))
            .sort((a: AntwortKontext, b: AntwortKontext) =>
              a.reihung < b.reihung ? -1 : 1
            );
          ant = {
            start: el.startAntwort,
            stop: el.stopAntwort,
            tagId: tagId,
            tagName: [
              ...new Set(tag_name.replace(/[{}]*/g, '').split(',')),
            ].join(','),
            ortho: el.ortho,
            orthoText: el.orthoText,
            text: el.text,
            phon: el.phon,
            transcript: el.transcript,
            stdOrth: el.standardorth,
            reihung: el.tokenreihung,
            kontext: kontext,
            erhArt: el.bezeichnungErhebung,
            erhArtId: el.artErhebungId,
            bezErhebung: el.Bezeichnung,
          } as AntwortToken;
        } else {
          ant = {
            start: el.startAntwort,
            stop: el.stopAntwort,
            tagId: tagId,
            erhArt: el.bezeichnungErhebung,
            erhArtId: el.artErhebungId,
            bezErhebung: el.Bezeichnung,
            tagName: [
              ...new Set(tag_name.replace(/[{}]*/g, '').split(',')),
            ].join(','),
          } as Antwort;
        }
        const newTimestamp: AntwortTokenStamp = {
          dateipfad: el.dateipfad,
          audiofile: el.audiofile,
          gruppeBez: el.gruppeBez,
          teamBez: el.teamBez,
          sigle: el.infSigle ? el.infSigle : '',
          age: el.age,
          res: [{ data: [ant], id: el.id }],
        };
        const dataIdx = antworten.findIndex(
          (a: AntwortTokenStamp) =>
            a.dateipfad === el.dateipfad && a.audiofile === el.audiofile
        );
        if (dataIdx >= 0) {
          if (
            antworten[dataIdx].res.findIndex((resEl) => resEl.id === el.id) < 0
          ) {
            antworten[dataIdx].res.push({ data: [ant], id: el.id });
          }
          const data =
            antworten[dataIdx].res[
              antworten[dataIdx].res.findIndex((resEl) => el.id === resEl.id)
            ];
          // Data already exists in the return array.
          // Check if the timestamps are also already there
          const idx = data.data.findIndex((a: Antwort | AntwortToken) => {
            return (
              validator.compareTimeStampsIfEqual(a, ant) ||
              (validator.compareTimeStamps(a.start, ant.start) > 0 &&
                validator.compareTimeStamps(a.stop, ant.stop) < 0) ||
              (validator.compareTimeStamps(a.start, ant.start) < 0 &&
                validator.compareTimeStamps(a.stop, ant.stop) > 0)
            );
          });
          if (idx < 0) {
            // does not exist
            data.data.push(ant);
          } else {
            // exists
            // append tagName, ortho and orthoText to the existing timestamp
            const curr: Antwort | AntwortToken = data.data[idx];
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
              if (Array.isArray(curr.tagId) && Array.isArray(ant.tagId)) {
                if (!_.isEqual(curr.tagId.sort(), ant.tagId.sort())) {
                  data.data.push(ant);
                }
              } else if (
                Array.isArray(curr.tagId) &&
                !Array.isArray(ant.tagId) &&
                ant.tagId
              ) {
                if (!curr.tagId.includes(ant.tagId)) {
                  data.data.push(ant);
                }
              }
            }
          }
        } else {
          antworten.push(newTimestamp);
        }
      });
    let end = Date.now() - start;
    console.log(`Execution time: ${end} ms`);
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
        bezErhebung: el.bezeichnungErhebung,
        erhArt: el.bezeichnung,
        erhArtId: el.artErhebungId,
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
