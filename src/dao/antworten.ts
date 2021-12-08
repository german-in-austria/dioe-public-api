import { sql } from "@pgtyped/query";
import query from "./connect/pg";

import {
  ISelectAntwortenParams,
  ISelectAntwortenQuery,
  ISelectSatzQuery,
  ISelectSatzParams,
  ISelectAntwortFromAufgabeParams,
  ISelectAntwortFromAufgabeQuery,
  ICheckIfTransQuery,
  ICheckIfTransParams,
  ISelectAntwortenTransQuery,
  ISelectAntwortenTransParams,
} from "src/dao/antworten.queries";

const antwortenDao = {
  async selectAntwortenAudio(tagID: number[], osmId: string) {
    const selectAntworten = sql<ISelectAntwortenQuery & ISelectAntwortenParams>`
        select  
          kdte."start_Aufgabe" as "start_Antwort", 
          kdte."stop_Aufgabe" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez
        from "KorpusDB_tbl_tags" kdtt       
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id limit 5
          ) kdta on true
          join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id" limit 2
          ) pdti on true
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id limit 3
          ) kdte on true
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id           
        WHERE 
          kdtt.id IN $$tagID
          AND odto.osm_id = $osmId
          and kdti."Dateipfad" not in ('', '0') 
          and kdti."Audiofile" not in ('', '0')
        group by kdti."Dateipfad", kdti."Audiofile", kdtt."Tag_lang", 
          kdte."start_Aufgabe" , kdte."stop_Aufgabe",
          kdtt.id, 
          kdta."start_Antwort", kdta."stop_Antwort",
          pdtig.gruppe_bez, pdtt.team_bez, 
          odto.osm_id limit 40  
        `;
    return await query(selectAntworten, { tagID: tagID, osmId: osmId });
  },
  async selectMatchingSatz(str: string) {
    const selectSatz = sql<ISelectSatzQuery & ISelectSatzParams>`
    select kdts.id, kdts."Transkript", kdts.ipa 
    from "KorpusDB_tbl_saetze" kdts 
    where kdts."Transkript" like $str`;
    return await query(selectSatz, { str: str });
  },
  async checkIfTrans(tagId: number[]) {
    const checkIfTrans = sql<ICheckIfTransParams & ICheckIfTransQuery>`
    select distinct kdtt.id
        from "KorpusDB_tbl_tags" kdtt       
        join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Tag_id" = kdtt.id
        join "KorpusDB_tbl_antworten" kdta on kdta2."id_Antwort_id" = kdta.id
        WHERE 
          (kdta.ist_token_id is not null or kdta.ist_tokenset_id is not null) and 
          kdtt.id in $$tagId
    `;
    return await query(checkIfTrans, { tagId: tagId });
  },
  async selectAntwortenTrans(tagID: number[], osmId: string) {
    const selectAntwortenTrans = sql<
      ISelectAntwortenTransQuery & ISelectAntwortenTransParams
    >`
    select distinct e.start_time as "start_Antwort", 
          e.end_time as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          t.ortho as "ortho", t.text_in_ortho as "Ortho text",
          pdtig.gruppe_bez, pdtt.team_bez
    from "KorpusDB_tbl_tags" kdtt       
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id limit 1200
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
          ) kdta on true
	      left join token t on t.id = kdta.ist_token_id 
	      left join tokentoset t2 on t2.id = kdta.ist_tokenset_id 
	      join event e on t.event_id_id = e.id
		  join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id" limit 2
          ) pdti on true
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id limit 3
          ) kdte on true
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id      
    where (kdta.ist_token_id is not null or kdta.ist_tokenset_id is not null) and 
    kdtt.id IN $$tagID and odto.osm_id = $osmId
    and kdti."Dateipfad" not in ('', '0') 
    and kdti."Audiofile" not in ('', '0')
    limit 50
    `;
    return await query(selectAntwortenTrans, { tagID: tagID, osmId: osmId });
  },
  async selectAntwortenFromAufgaben(satzid: number, aufgabeid: number) {
    const selectAntwortFromAufgabe = sql<
      ISelectAntwortFromAufgabeQuery & ISelectAntwortFromAufgabeParams
    >`
    select  kdte."start_Aufgabe" as "start_Antwort", 
          kdte."stop_Aufgabe" as "stop_Antwort",
          kdta."Kommentar" as "kommentar", kdti."Dateipfad" as "dateipfad", 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          odto.lat, odto.lon,
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez,
          kdta."ist_Satz_id" as "Satz_id",
          kdte."id_Aufgabe_id" as "Aufgabe_id"
        from "KorpusDB_tbl_antworten" kdta
          join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Antwort_id" = kdta.id 
          join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdta2."id_Tag_id" 
          join "KorpusDB_tbl_tagebene" kdtt2 on kdta2."id_TagEbene_id"  = kdtt2.id
          join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id" 
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_InfErh_id" = kdti.id
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
        where ($satzid < 0 or kdta."ist_Satz_id" = $satzid) and 
        ($aufgabeid < 0 or kdte."id_Aufgabe_id" = $aufgabeid)
        group by kdti."Dateipfad", kdti."Audiofile", kdtt."Tag_lang", kdtt.id,
          kdte."start_Aufgabe" , kdte."stop_Aufgabe",
          kdta."Kommentar", 
          kdta."start_Antwort", kdta."stop_Antwort",
          kdte."id_Aufgabe_id", kdta."ist_Satz_id" ,
          pdtig.gruppe_bez, pdtt.team_bez, 
          odto.osm_id, odto.lat, odto.lon
        order by kdti."Dateipfad", kdti."Audiofile", kdtt.id, odto.osm_id
    `;
    return await query(selectAntwortFromAufgabe, {
      satzid: satzid,
      aufgabeid: aufgabeid,
    });
  },
};

export default antwortenDao;
