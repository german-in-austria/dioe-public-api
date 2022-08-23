import _, { String } from 'lodash';
import { antwortenDto } from 'src/controller/antwortenController';
import { tagDto } from 'src/controller/tagController';
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
  text: string;
  ortho: string;
  lemma: string;
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
  text: string;
  ortho: string;
  textInOrtho: string;
  lemma: string;
}

export default {
  validateTagDto(tag: tagDto): tag {
    const aus = this.validateAusbildung(tag.ausbildung ? tag.ausbildung : '');
    const beruf = this.validateBeruf(tag.beruf_id ? tag.beruf_id : -1);
    let project_id = tag.project == undefined ? -1 : tag.project;
    let gender_sel = 0;
    let tags = '';
    let ortho = '';
    let lemma = '';
    if (tag.weiblich == undefined) {
      gender_sel = -1;
      tag.weiblich = false;
    }

    if (tag.ids.length === 0 || tag.ids[0] < 0) {
      tag.ids = [-1];
    }

    if (tag.text === undefined || !tag.text || tag.text.length === 0) {
      tags = '';
    } else {
      tags = this.transformToken(tag.text as string[]);
    }

    if (tag.ortho === undefined || !tag.ortho || tag.ortho.length === 0) {
      ortho = '';
    } else {
      ortho = this.transformToken(tag.ortho as string[]);
    }

    if (tag.lemma === undefined || !tag.lemma || tag.lemma.length === 0) {
      lemma = '';
    } else {
      lemma = `^${this.transformTextToMatch(tag.lemma as string[], false)}`;
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
    let text = '';
    let ortho = '';
    let textInOrtho = '';
    let lemma = '';

    if (ant.weiblich == undefined) {
      gender_sel = -1;
      ant.weiblich = false;
    }

    if (ant.text === undefined || !ant.text || ant.text.length === 0) {
      text = '';
    } else {
      text = this.transformToken(ant.text as string[]);
      ortho = textInOrtho = text;
    }

    if (!(ant.ortho === undefined || !ant.ortho || ant.ortho.length === 0)) {
      ortho = this.transformToken(ant.ortho as string[]);
      if (ortho === '') {
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
      textInOrtho = this.transformToken(ant.textInOrtho as string[]);
      if (text === '') {
        text = textInOrtho;
      }
      if (ortho === '') {
        ortho = textInOrtho;
      }
    }

    if (ant.lemma === undefined || !ant.lemma || ant.lemma.length === 0) {
      lemma = '';
    } else {
      lemma = `^${this.transformTextToMatch(ant.lemma as string[], false)}`;
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
  transformTextToMatch(token: string[], matchAll: boolean) {
    return `(${token.join('|')})${matchAll ? '.*' : ''}`;
  },
  transformToken(token: string[]) {
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
