import {
  ISelectASetByPhaenResult,
  ISelectAufgabenByPhaenResult,
  ISelectPhaenBerResult,
  ISelectPhaenResult,
  ISelectSinglePhaenResult,
  ISelectTagByPhaenResult,
} from '../dao/phaen.queries';
import phaenDao from '../dao/phaen';
import _ from 'lodash';

export interface Aset {
  id: number;
  kuerzel: string;
  name: string;
  fokus: string;
  phaen: string;
  aufgaben: Array<Aufgabe>;
}

export interface Aufgabe {
  beschreibung: string;
  aufgabenstellung?: string;
  id: number;
}

export default {
  async getPhaenBer(): Promise<ISelectPhaenBerResult[]> {
    return phaenDao.getPhaenBer();
  },

  async getPhaenResult(): Promise<ISelectPhaenResult[]> {
    return phaenDao.getAllPhaen();
  },

  async getSinglePhaen(berId: number): Promise<ISelectSinglePhaenResult[]> {
    return phaenDao.getPhaenSingleBer(berId);
  },
  async getTagByPhaen(ids: number[]): Promise<ISelectTagByPhaenResult[]> {
    return phaenDao.getTagsToPhaen(ids);
  },
  async getASetByPhaen(ids: number[]): Promise<Aset[]> {
    const res = await phaenDao.getASetPhaen(ids);
    const arr = [] as Aset[];
    if (res.length > 0) {
      res.forEach((el: ISelectASetByPhaenResult) => {
        const aset: Aset = {
          id: el.asetId,
          kuerzel: el.kuerzel,
          name: el.nameAset ? el.nameAset : '',
          phaen: el.bezPhaenomen,
          fokus: el.fokus ? el.fokus : '',
          aufgaben: [] as Aufgabe[],
        };
        const aufgabe: Aufgabe = {
          beschreibung: el.beschreibungAufgabe ? el.beschreibungAufgabe : '',
          id: el.aufId,
        };
        const idx = arr.find((entr) => el.asetId === entr.id);
        if (idx === undefined) {
          aset.aufgaben.push(aufgabe);
          arr.push(aset);
        } else {
          idx.aufgaben.push(aufgabe);
        }
      });
    } else {
      const result = await phaenDao.getAufgabenByPhaen(ids);
      const aset: Aset = {
        id: -1,
        kuerzel: '',
        name: '',
        phaen: '',
        fokus: '',
        aufgaben: [] as Aufgabe[],
      };
      result.forEach((el: ISelectAufgabenByPhaenResult) => {
        const aufgabe: Aufgabe = {
          beschreibung: el.beschr ? el.beschr : '',
          id: el.id,
          aufgabenstellung: el.aufgabe ? el.aufgabe : '',
        };
        aset.aufgaben.push(aufgabe);
      });
      arr.push(aset);
    }
    return arr;
  },
};
