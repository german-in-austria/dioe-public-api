import _, { String } from "lodash";
import { tagDto } from "src/controller/tagController";
import { ausbildungGrad } from "./social";

export interface tag {
  ids: number[];
  erhArt: number[];
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
};
