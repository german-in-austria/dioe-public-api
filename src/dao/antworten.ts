import { sql } from "@pgtyped/query";
import query from "./connect/pg";

import {
  ISelectAntwortenParams,
  ISelectAntwortenQuery,
} from "src/dao/antworten.queries";

const antwortenDao = {
  async selectAntwortenAudio(tagID: number[]) {
    const selectAntworten = sql<ISelectAntwortenQuery & ISelectAntwortenParams>`
        select kdta."start_Antwort", kdta."stop_Antwort", 
        kdta."Kommentar", kdti."Dateipfad", kdti."Audiofile",
        kdtt.id as tag_id
        from "KorpusDB_tbl_antworten" kdta 
        left join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Antwort_id" = kdta.id 
        left join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdta2."id_Tag_id" 
        left join "KorpusDB_tbl_tagebene" kdtt2 on kdta2."id_TagEbene_id"  = kdtt2.id
        left join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id" 
        left join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
        left join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
        where kdtt.id IN $$tagID
        AND kdta."start_Antwort" <> kdta."stop_Antwort";
        `;
    return await query(selectAntworten, { tagID: tagID });
  },
};

export default antwortenDao;
