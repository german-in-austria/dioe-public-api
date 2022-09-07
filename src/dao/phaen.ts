import { sql } from '@pgtyped/query';
import query from './connect/pg';
import {
  ISelectPhaenBerQuery,
  ISelectPhaenQuery,
  ISelectSinglePhaenQuery,
  ISelectSinglePhaenParams,
  ISelectTagByPhaenParams,
  ISelectTagByPhaenQuery,
  ISelectASetByPhaenParams,
  ISelectASetByPhaenQuery,
  ISelectAufgabenByPhaenQuery,
  ISelectAufgabenByPhaenParams,
} from './phaen.queries';

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
  async getPhaenSingleBer(berId: number) {
    const selectSinglePhaen = sql<
      ISelectSinglePhaenQuery & ISelectSinglePhaenParams
    >`
        SELECT kdtp.id, "Bez_Phaenomen", "Beschr_Phaenomen", kdtp2."Bez_Phaenber" 
      FROM "KorpusDB_tbl_phaenomene" kdtp 
      JOIN "KorpusDB_tbl_phaenber" kdtp2 
      ON kdtp."zu_PhaenBer_id" = kdtp2.id
      WHERE
        kdtp."zu_PhaenBer_id" = $berId
      `;
    return await query(selectSinglePhaen, { berId: berId });
  },
  async getTagsToPhaen(ids: number[]) {
    const selectTagByPhaen = sql<
      ISelectTagByPhaenParams & ISelectTagByPhaenQuery
    >`select 
        kdtt.id as tag_id, 
        kdtt."Tag"  as tag_name,
        kdtt."Tag_lang" as tag_lang,
        kdtt."Generation" as generation,
        kdtp."Bez_Phaenomen" as phaen
      from "KorpusDB_tbl_phaenomene" kdtp 
        join "KorpusDB_tbl_tags" kdtt on kdtp.id = kdtt."zu_Phaenomen_id" 
	      where kdtt."zu_Phaenomen_id" IN $$ids
    `;
    return await query(selectTagByPhaen, { ids: ids });
  },
  async getASetPhaen(ids: number[]) {
    const selectASetByPhaen = sql<
      ISelectASetByPhaenParams & ISelectASetByPhaenQuery
    >`
      select kdta.id as aset_id, kdta."Kuerzel", kdta."Name_Aset", kdta."Fokus", kdtp."Bez_Phaenomen", kdta2."Beschreibung_Aufgabe", kdta2.id as auf_id
    from "KorpusDB_tbl_aufgabensets" kdta 
      join "KorpusDB_tbl_phaenomene" kdtp on kdtp.id = kdta."zu_Phaenomen_id" 
      join "KorpusDB_tbl_aufgaben" kdta2 on kdta2."von_ASet_id" = kdtp.id
    where kdtp.id IN $$ids
    `;
    return await query(selectASetByPhaen, { ids: ids });
  },
  async getAufgabenByPhaen(phaenID: number[]) {
    const selectAufgabenByPhaen = sql<
      ISelectAufgabenByPhaenQuery & ISelectAufgabenByPhaenParams
    >`
      select kdta.id, kdta."Beschreibung_Aufgabe" as beschr, kdta."Aufgabenstellung" as aufgabe, kdtp2."Bez_Phaenomen" as phaen from "KorpusDB_tbl_aufgaben" kdta 
      join "KorpusDB_tbl_phaenzuaufgabe" kdtp on kdta.id = kdtp.id_aufgabe_id 
      join "KorpusDB_tbl_phaenomene" kdtp2 on kdtp2.id = kdtp.id_phaenomen_id 
      where kdtp2.id IN $$phaenID;
      `;
    return await query(selectAufgabenByPhaen, { phaenID: phaenID });
  },
};

export default phaenDao;
