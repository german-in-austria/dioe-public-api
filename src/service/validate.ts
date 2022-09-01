import _, { String } from 'lodash';
import { antwortenDto } from 'src/controller/antwortenController';
import { aufgabenDto } from 'src/controller/aufgabenController';
import { selectionObject, tagDto } from 'src/controller/tagController';
import { Antwort } from './antworten';
import { ausbildungGrad } from './social';

export interface tag {
  ids: number[];
  erhArt: number[];
  ausbildung: string;
  beruf_id: number;
  weiblich: boolean;
  gender_sel: number;
  project_id: number;
  group: boolean;
  text: searchToken;
  ortho: searchToken;
  lemma: searchToken;
}

export interface ageBound {
  ageLower: number;
  ageUpper: number;
}

export interface filters extends ageBound {
  ausbildung: string;
  beruf_id: number;
  weiblich: boolean;
  gender_sel: number;
  group: boolean;
  text: searchToken;
  ortho: searchToken;
  textInOrtho: searchToken;
  lemma: searchToken;
}

export interface searchToken {
  case: string;
  cI: string;
  overall: string;
}

export default {
  validateTagDto(tag: tagDto[]): tag[] {
    const res: tag[] = [];
    tag.forEach((el: tagDto) => {
      res.push(this.validateSingleTagDto(el));
    });
    return res;
  },
  validateSingleTagDto(el: tagDto): tag {
    const aus = this.validateAusbildung(el.ausbildung ? el.ausbildung : '');
    const beruf = this.validateBeruf(el.beruf_id ? el.beruf_id : -1);
    let project_id = el.project == undefined ? -1 : el.project;
    let gender_sel = 0;
    let tags: searchToken = this.constructSearchToken();
    let ortho: searchToken = this.constructSearchToken();
    let lemma: searchToken = this.constructSearchToken();
    if (el.weiblich == undefined) {
      gender_sel = -1;
      el.weiblich = false;
    }

    if (el.ids.length === 0 || el.ids[0] < 0) {
      el.ids = [-1];
    }

    if (!(el.text === undefined || !el.text || el.text.length === 0)) {
      tags = this.transformToken(el.text);
      ortho = tags;
    }

    if (!(el.ortho === undefined || !el.ortho || el.ortho.length === 0)) {
      ortho = this.transformToken(el.ortho);
      if (ortho.overall === '') {
        tags = ortho;
      }
    }

    if (!(el.lemma === undefined || !el.lemma || el.lemma.length === 0)) {
      lemma = this.transformTextToMatch(el.lemma, false);
    }

    if (el.group === undefined) el.group = false;
    return {
      ids: el.ids,
      erhArt: el.erhArt == undefined ? [-1] : el.erhArt,
      ausbildung: aus,
      beruf_id: beruf,
      weiblich: el.weiblich,
      project_id: project_id,
      group: el.group,
      gender_sel: gender_sel,
      text: tags,
      ortho: ortho,
      lemma: lemma,
    } as tag;
  },
  validateAufgabenDto(auf: aufgabenDto) {
    let aufIds = auf.ids;
    let asetIds = auf.asetIds;
    if (auf.ids.length === 0 || auf.ids[0] === -1) {
      aufIds = [-1];
    }

    if (!asetIds || asetIds === undefined || auf.asetIds?.length === 0)
      asetIds = [-1];

    return { ids: aufIds, asetIds: asetIds };
  },
  validateAntwortenDto(ant: antwortenDto): filters {
    const ageBound = this.validateAgeBound(ant.ageLower, ant.ageUpper);
    const aus = this.validateAusbildung(ant.ausbildung ? ant.ausbildung : '');
    const beruf = this.validateBeruf(ant.beruf_id ? ant.beruf_id : -1);
    let gender_sel = 0;
    let text: searchToken = this.constructSearchToken();
    let ortho: searchToken = this.constructSearchToken();
    let textInOrtho: searchToken = this.constructSearchToken();
    let lemma: searchToken = this.constructSearchToken();

    if (ant.weiblich == undefined) {
      gender_sel = -1;
      ant.weiblich = false;
    }

    if (!(ant.text === undefined || !ant.text || ant.text.length === 0)) {
      text = this.transformToken(ant.text);
      ortho = textInOrtho = text;
    }

    if (!(ant.ortho === undefined || !ant.ortho || ant.ortho.length === 0)) {
      ortho = this.transformToken(ant.ortho);
      if (ortho.overall === '') {
        text = ortho;
      }
    }

    if (
      !(
        ant.textInOrtho === undefined ||
        !ant.textInOrtho ||
        ant.textInOrtho.length === 0
      )
    ) {
      textInOrtho = this.transformToken(ant.textInOrtho);
      if (text.overall === '') {
        text = textInOrtho;
      }
      if (ortho.overall === '') {
        ortho = textInOrtho;
      }
    }

    if (!(ant.lemma === undefined || !ant.lemma || ant.lemma.length === 0)) {
      lemma = this.transformTextToMatch(ant.lemma, false);
    }

    return {
      ausbildung: aus,
      beruf_id: beruf,
      weiblich: ant.weiblich,
      gender_sel: gender_sel,
      ageLower: ageBound.ageLower,
      ageUpper: ageBound.ageUpper,
      group: ant.group === undefined ? false : ant.group,
      text: text,
      ortho: ortho,
      textInOrtho: textInOrtho,
      lemma: lemma,
    } as filters;
  },
  validateAusbildung(str: string): string {
    let aus = ausbildungGrad.find((el: string) => el === str);
    if (aus == undefined) {
      aus = '';
    }
    return aus;
  },
  validateBeruf(nr: number) {
    return nr < 0 ? -1 : nr;
  },
  constructSearchToken(): searchToken {
    return {
      case: '',
      cI: '',
      overall: '',
    };
  },
  validateAgeBound(
    lower: number | undefined,
    upper: number | undefined
  ): ageBound {
    const low = lower ? lower : -1;
    const up = upper ? upper : -1;
    return {
      ageLower: low,
      ageUpper: up,
    } as ageBound;
  },
  transformTextToMatch(
    token: selectionObject[],
    matchAll: boolean
  ): searchToken {
    const c: string[] = [];
    const cI: string[] = [];

    token.forEach((el: selectionObject) => {
      const token =
        el.case.toLowerCase() !== 'regexp'
          ? `${el.state === 'nicht' ? '?!' : ''}${el.val}`
          : el.val.substring(1, el.val.lastIndexOf('/'));
      if (el.case === 'case-sensitive') {
        c.push(token);
      } else if (el.case === 'case-insensitive') {
        cI.push(token);
      }
    });
    return {
      case: `${this.createGroup(c)}${matchAll && c.length > 0 ? '.*' : ''}`,
      cI: `${this.createGroup(cI)}${matchAll && cI.length > 0 ? '.*' : ''}`,
      overall: `${this.createGroup(c.concat(cI))}${matchAll ? '.*' : ''}`,
    } as searchToken;
  },
  createGroup(val: string[]) {
    if (val.length > 0) {
      return `(${val.join('|')})`;
    }
    return '';
  },
  transformToken(token: selectionObject[]): searchToken {
    return this.transformTextToMatch(token, true);
  },
  compareTimeStamps(currStamp: Antwort, currAnt: Antwort): boolean {
    const sStamp = currStamp.start;
    const eStamp = currStamp.stop;

    const sAnt = currAnt.start;
    const eAnt = currAnt.stop;

    if (
      sStamp.hours &&
      sAnt.hours &&
      eStamp.hours &&
      eAnt.hours &&
      (sStamp.hours !== sAnt.hours || eStamp.hours !== eAnt.hours)
    ) {
      return false;
    }

    return (
      sStamp.minutes === sAnt.minutes &&
      sStamp.seconds === sAnt.seconds &&
      sStamp.milliseconds === sAnt.milliseconds &&
      eStamp.minutes == eAnt.minutes &&
      eStamp.seconds === eStamp.seconds &&
      eStamp.milliseconds === eStamp.milliseconds
    );
  },
};
