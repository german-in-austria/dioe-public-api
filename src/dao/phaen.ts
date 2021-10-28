import { sql } from "@pgtyped/query";
import query from "./connect/pg";
import { ISelectPhaenBerQuery, ISelectPhaenQuery } from "./phaen.queries";

const phaenDao = {
  async getPhaenBer() {
    const selectPhaenBer = sql<ISelectPhaenBerQuery>`
      SELECT id, "Bez_Phaenber" FROM "KorpusDB_tbl_phaenber" kdtp 
    `;
    return await query(selectPhaenBer);
  },

  async getAllPhaen() {
    const selectPhaen = sql<ISelectPhaenQuery>`
      SELECT kdtp.id, "Bez_Phaenomen", "Beschr_Phaenomen", kdtp2."Bez_Phaenber" 
      FROM "KorpusDB_tbl_phaenomene" kdtp 
      JOIN "KorpusDB_tbl_phaenber" kdtp2 
      ON kdtp."zu_PhaenBer_id" = kdtp2.id  
    `;
    return await query(selectPhaen);
  },
};

export default phaenDao;
