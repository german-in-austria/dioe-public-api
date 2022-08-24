import _, { String } from 'lodash';
import { antwortenDto } from 'src/controller/antwortenController';
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
  validateTagDto(tag: tagDto): tag {
    const aus = this.validateAusbildung(tag.ausbildung ? tag.ausbildung : '');
    const beruf = this.validateBeruf(tag.beruf_id ? tag.beruf_id : -1);
    let project_id = tag.project == undefined ? -1 : tag.project;
    let gender_sel = 0;
    let tags: searchToken = this.constructSearchToken();
    let ortho: searchToken = this.constructSearchToken();
    let lemma: searchToken = this.constructSearchToken();
    if (tag.weiblich == undefined) {
      gender_sel = -1;
      tag.weiblich = false;
    }

    if (tag.ids.length === 0 || tag.ids[0] < 0) {
      tag.ids = [-1];
    }

    if (!(tag.text === undefined || !tag.text || tag.text.length === 0)) {
      tags = this.transformToken(tag.text);
      ortho = tags;
    }

    if (!(tag.ortho === undefined || !tag.ortho || tag.ortho.length === 0)) {
      ortho = this.transformToken(tag.ortho);
      if (ortho.overall === '') {
        tags = ortho;
      }
    }

    if (!(tag.lemma === undefined || !tag.lemma || tag.lemma.length === 0)) {
      lemma = this.transformTextToMatch(tag.lemma, false);
    }

    if (tag.group === undefined) tag.group = false;
    const res = {
      ids: tag.ids,
      erhArt: tag.erhArt == undefined ? [-1] : tag.erhArt,
      ausbildung: aus,
      beruf_id: beruf,
      weiblich: tag.weiblich,
      project_id: project_id,
      group: tag.group,
      gender_sel: gender_sel,
      text: tags,
      ortho: ortho,
      lemma: lemma,
    } as tag;
    return res;
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
      case: `${this.createGroup(c)}${matchAll ? '.*' : ''}`,
      cI: `${this.createGroup(cI)}${matchAll ? '.*' : ''}`,
      overall: `${this.createGroup(c.concat(cI))}}${matchAll ? '.*' : ''}`,
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
