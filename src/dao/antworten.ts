import { sql } from "@pgtyped/query";
import query from "./connect/pg";

import {
  ISelectAntwortenParams,
  ISelectAntwortenQuery,
} from "src/dao/antworten.queries";

const antwortenDao = {
  async selectAntwortenAudio(tagID: number[], osmId: string) {
    const selectAntworten = sql<ISelectAntwortenQuery & ISelectAntwortenParams>`
        select  kdte."start_Aufgabe" as "start_Antwort", 
            kdte."stop_Aufgabe" as "stop_Antwort",
          kdta."Kommentar", kdti."Dateipfad", kdti."Audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          t.ortho as "ortho", t.text_in_ortho as "Ortho text"
        from "KorpusDB_tbl_antworten" kdta
          join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Antwort_id" = kdta.id 
          join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdta2."id_Tag_id" 
          join "KorpusDB_tbl_tagebene" kdtt2 on kdta2."id_TagEbene_id"  = kdtt2.id
          join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id" 
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_InfErh_id" = kdti.id
          join lateral(
            select * from token t where t.id = kdta.ist_token_id limit 2
          ) t on true
        where kdtt.id IN $$tagID
          AND odto.osm_id = $osmId
        group by t.ortho, t.text_in_ortho, kdti."Dateipfad", kdti."Audiofile", kdtt."Tag_lang", 
          kdte."start_Aufgabe" , kdte."stop_Aufgabe",
          kdta."Kommentar", 
          kdtt.id, 
          kdta."start_Antwort", kdta."stop_Antwort",
          odto.osm_id limit 50
        `;
    return await query(selectAntworten, { tagID: tagID, osmId: osmId });
  },
};

export default antwortenDao;
