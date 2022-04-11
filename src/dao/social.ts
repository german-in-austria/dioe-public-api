import { sql } from "@pgtyped/query";
import query from "./connect/pg";

import { ISelectAusbildungQuery } from "./social.queries";

const socialDao = {
  async getAusbildung() {
    const selectAusbildung = sql<ISelectAusbildungQuery>`
          select distinct pdti.ausbildung_max from "PersonenDB_tbl_informanten" pdti where pdti.ausbildung_max is not null and pdti.ausbildung_max <> '';
        `;
    return await query(selectAusbildung);
  },
};

export default socialDao;
