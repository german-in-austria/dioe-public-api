import _, { String } from "lodash";
import { antwortenDto } from "src/controller/antwortenController";
import { tagDto } from "src/controller/tagController";
import { ausbildungGrad } from "./social";

export interface tag {
  ids: number[];
  erhArt: number[];
  ausbildung: string;
  beruf_id: number;
  weiblich: string;
}

export interface ageBound {
  ageLower: number;
  ageUpper: number;
}

export interface filters extends ageBound {
  ausbildung: string;
  beruf_id: number;
  weiblich: string;
}

export default {
  validateTagDto(tag: tagDto): tag {
    const aus = this.validateAusbildung(tag.ausbildung ? tag.ausbildung : "");
    const beruf = this.validateBeruf(tag.beruf_id ? tag.beruf_id : -1);
    const gender = String(tag.weiblich);

    const res = {
      ids: tag.ids,
      erhArt: tag.erhArt,
      ausbildung: aus,
      beruf_id: beruf,
      weiblich: gender,
    } as tag;
    return res;
  },
  validateAntwortenDto(ant: antwortenDto): filters {
    const ageBound = this.validateAgeBound(ant.ageLower, ant.ageUpper);
    const aus = this.validateAusbildung(ant.ausbildung ? ant.ausbildung : "");
    const beruf = this.validateBeruf(ant.beruf_id ? ant.beruf_id : -1);
    const gender = String(ant.weiblich);

    return {
      ausbildung: aus,
      beruf_id: beruf,
      weiblich: gender,
      ageLower: ageBound.ageLower,
      ageUpper: ageBound.ageUpper,
    } as filters;
  },
  validateAusbildung(str: string): string {
    let aus = ausbildungGrad.find((el: string) => el === str);
    if (aus == undefined) {
      aus = "";
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
};
