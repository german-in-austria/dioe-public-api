import { sql } from "@pgtyped/query";
import query from "./connect/pg";

import {
  ISelectAntwortenParams,
  ISelectAntwortenQuery,
} from "src/dao/antworten.queries";

const antwortenDao = {
  async selectAntwortenAudio(tagID: number[], osmId: string) {
    const selectAntworten = sql<ISelectAntwortenQuery & ISelectAntwortenParams>`
        select kdta."start_Antwort", kdta."stop_Antwort", 
        kdta."Kommentar", kdti."Dateipfad", kdti."Audiofile",
        kdtt.id as tag_id, 
        odto.osm_id as osmId, 
        kdtt."Tag_lang" as tag_name,
        t.ortho as "ortho", t.text_in_ortho as "Ortho text",
        e.start_time, e.end_time
        from "KorpusDB_tbl_antworten" kdta 
        left join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Antwort_id" = kdta.id 
        left join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdta2."id_Tag_id" 
        left join "KorpusDB_tbl_tagebene" kdtt2 on kdta2."id_TagEbene_id"  = kdtt2.id
        left join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id" 
        left join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
        left join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
        left join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
        left join "token" t on t.id = kdta.ist_token_id 
        left join "event" e on t.fragment_of_id = e.id
        where kdtt.id IN $$tagID
        AND odto.osm_id = $osmId;
        `;
    return await query(selectAntworten, { tagID: tagID, osmId: osmId });
  },
};

export default antwortenDao;
