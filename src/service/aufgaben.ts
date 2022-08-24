import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult,
  ISelectAllAufgabenResult,
  ISelectOrtAufgabeResult,
  ISelectAllTeamsResult,
  ISelectAufgabeAudioByOrtResult,
} from 'src/dao/aufgaben.queries';
import aufgabenDao from '../dao/aufgaben';
import _ from 'lodash';

interface Aufgabe {
  start: string;
  stop: string;
  aufgabe: string;
  aufgabeId: number;
}

export interface AufgabeStamp {
  dateipfad: string | null;
  audiofile: string | null;
  gruppeBez: string | null;
  teamBez: string | null;
  data: Aufgabe[];
}

export default {
  async getAufgabenSetPhaen(
    phaen: number[]
  ): Promise<ISelectAufgabenSetResult[]> {
    return aufgabenDao.getAufgabenSetPhaen(phaen);
  },
  async getAllTeams(): Promise<ISelectAllTeamsResult[]> {
    return aufgabenDao.getTeams();
  },
  async getAufgabenPhaen(phaen: number[]): Promise<ISelectAufgabenResult[]> {
    return aufgabenDao.getAufgabenPhaen(phaen);
  },
  async getAufgabenWithSet(
    aufgabe: number[]
  ): Promise<ISelectAufgabenFromSetResult[]> {
    return aufgabenDao.getAufgabenWithSet(aufgabe);
  },
  async getAllAufgaben(): Promise<ISelectAllAufgabenResult[]> {
    return aufgabenDao.getAllAufgaben();
  },
  async getOrtAufgabe(arg: {
    ids: number[];
    asetIds: number[];
  }): Promise<ISelectOrtAufgabeResult[]> {
    return aufgabenDao.getOrtAufgabe(arg.ids, arg.asetIds);
  },
  async getAufgabeAudioByOrt(
    aufIDs: number[],
    osmId: number,
    ageLower: number,
    ageUpper: number
  ): Promise<AufgabeStamp[]> {
    const res = await aufgabenDao.getAufgabeOrtAudio(
      aufIDs,
      osmId.toString(),
      ageLower,
      ageUpper
    );
    let aufgaben: AufgabeStamp[] = [];
    res.forEach((el: ISelectAufgabeAudioByOrtResult) => {
      const a = {
        start: el.startAufgabe,
        stop: el.stopAufgabe,
        aufgabeId: el.id,
        aufgabe: el.aufgabe,
      } as Aufgabe;
      const stamp = {
        dateipfad: el.dateipfad,
        audiofile: el.audiofile,
        gruppeBez: el.gruppeBez,
        teamBez: el.teamBez,
        data: [a],
      } as AufgabeStamp;

      const dataIdx = aufgaben.findIndex(
        (a: AufgabeStamp) =>
          a.dateipfad === el.dateipfad && a.audiofile === el.audiofile
      );
      if (dataIdx >= 0) {
        aufgaben[dataIdx].data.push(a);
      } else {
        aufgaben.push(stamp);
      }
    });
    return aufgaben;
  },
};
