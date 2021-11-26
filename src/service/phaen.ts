import {
  ISelectPhaenBerResult,
  ISelectPhaenResult,
  ISelectSinglePhaenResult,
} from "../dao/phaen.queries";
import phaenDao from "../dao/phaen";
import _ from "lodash";

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
};
