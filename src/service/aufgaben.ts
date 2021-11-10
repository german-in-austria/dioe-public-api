import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult,
} from "src/dao/aufgaben.queries";
import aufgabenDao from "../dao/aufgaben";
import _ from "lodash";

export default {
  async getAufgabenSetPhaen(
    phaen: number
  ): Promise<ISelectAufgabenSetResult[]> {
    return aufgabenDao.getAufgabenSetPhaen(phaen);
  },
  async getAufgabenPhaen(phaen: number): Promise<ISelectAufgabenResult[]> {
    return aufgabenDao.getAufgabenPhaen(phaen);
  },
  async getAufgabenWithSet(
    aufgabe: number
  ): Promise<ISelectAufgabenFromSetResult[]> {
    return aufgabenDao.getAufgabenWithSet(aufgabe);
  },
};
