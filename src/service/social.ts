import _ from "lodash";
import socialDao from "../dao/social";

import { ISelectAusbildungResult } from "../dao/social.queries";

export default {
  async getAllAusbildung(): Promise<ISelectAusbildungResult[]> {
    return socialDao.getAusbildung();
  },
};
