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
  ISelectMatchingTokensParams,
  ISelectMatchingTokensQuery,
  ICheckIfAufgabeParams,
  ICheckIfAufgabeQuery,
  IGetStampsFromAntwortQuery,
  IGetStampsFromAntwortParams,
  ICheckIfRepQuery,
  ISelectErhebungsartenQuery,
  IGetTimeStampAntwortQuery,
  IGetTimeStampAntwortParams,
} from "src/dao/antworten.queries";

const antwortenDao = {
  async selectAntwortenAudio(
    tagID: number[],
    osmId: string,
    ageLower: number,
    ageUpper: number,
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number
  ) {
    const selectAntworten = sql<ISelectAntwortenQuery & ISelectAntwortenParams>`
        select
          kdte."start_Aufgabe" as "start_Antwort", 
          kdte."stop_Aufgabe" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez,
          kdti."ID_Erh_id"
        from "KorpusDB_tbl_tags" kdtt      
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
          ) kdta on true
          join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id"
          ) pdti on true
          JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id
          ) kdte on true
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
          join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
        	kdtt.id in $$tagID
        	and odto.osm_id = $osmId
          and kdti."Dateipfad" not in ('', '0') 
          and kdti."Audiofile" not in ('', '0')
          and kdta3.id = kdta."zu_Aufgabe_id"
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
        group by 
          kdti."ID_Erh_id" ,
          pdti.id,
          kdte."start_Aufgabe", 
          kdte."stop_Aufgabe",
          kdti."Dateipfad", 
          kdti."Audiofile",
          kdtt.id, 
          odto.osm_id, 
          kdtt."Tag_lang",
          pdtig.gruppe_bez, pdtt.team_bez
          having count(pdti.id) > 2 and count(kdti."ID_Erh_id") > 2  
        UNION
          select
          kdte."start_Aufgabe" as "start_Antwort", 
          kdte."stop_Aufgabe" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez,
          kdti."ID_Erh_id"
        from "KorpusDB_tbl_tags" kdtt      
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
          ) kdta on true
          join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id"
          ) pdti on true
          JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on pdti.inf_ort_id = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id
          ) kdte on true
          join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
        	kdtt.id in $$tagID
        	and odto.osm_id = $osmId
          and kdta3.id = kdta."zu_Aufgabe_id"  
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
        group by 
          kdti."ID_Erh_id",
          pdti.id,
          kdte."start_Aufgabe", 
          kdte."stop_Aufgabe",
          kdti."Dateipfad", 
          kdti."Audiofile",
          kdtt.id, 
          odto.osm_id, 
          kdtt."Tag_lang",
          pdtig.gruppe_bez, pdtt.team_bez
          having count(pdti.id) > 2 and count(kdti."ID_Erh_id") > 2
        `;
    return await query(selectAntworten, {
      tagID: tagID,
      osmId: osmId,
      ageLower: ageLower,
      ageUpper: ageUpper,
      aus: aus,
      beruf: beruf,
      gender: gender,
      gender_sel: gender_sel,
    });
    // Possible TODO: Mögliche Variable um Anzahl der Gruppen anzupassen
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
  async checkIfRep(tagId: number[]) {
    const checkIfRep = sql<ICheckIfRepQuery>`
    select distinct kdtt.id
        from "KorpusDB_tbl_tags" kdtt       
        join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Tag_id" = kdtt.id
        join "KorpusDB_tbl_antworten" kdta on kdta2."id_Antwort_id" = kdta.id
        WHERE 
          kdta."zu_Aufgabe_id" is not null and
          kdtt.id in $$tagId
          `;
    return await query(checkIfRep, { tagId: tagId });
  },
  async checkIfAufgabe(tagId: number[]) {
    const checkIfAufgabe = sql<ICheckIfAufgabeQuery & ICheckIfAufgabeParams>`
      select distinct kdtt.id
        from "KorpusDB_tbl_tags" kdtt       
        join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Tag_id" = kdtt.id
        join "KorpusDB_tbl_antworten" kdta on kdta2."id_Antwort_id" = kdta.id
        WHERE 
          kdta."start_Antwort" <> kdta."stop_Antwort" and 
          kdtt.id in $$tagId
    `;
    return await query(checkIfAufgabe, { tagId: tagId });
  },
  async getTimeStampAntwort(
    tagId: number[],
    osmId: string,
    ageLower: number,
    ageUpper: number,
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number
  ) {
    const getTimeStampAntwort = sql<
      IGetTimeStampAntwortQuery & IGetTimeStampAntwortParams
    >`
    select kdta."start_Antwort" as "start_Antwort", 
          kdta."stop_Antwort" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez,
          kdti."ID_Erh_id"
       	from "KorpusDB_tbl_tags" kdtt       
        join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Tag_id" = kdtt.id
        join "KorpusDB_tbl_antworten" kdta on kdta2."id_Antwort_id" = kdta.id
        join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id"
        JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
        join "KorpusDB_tbl_inf_zu_erhebung" kdtize on pdti.id = kdtize."ID_Inf_id" 
        join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id 
        join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_InfErh_id" = kdti.id
        join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
        join "OrteDB_tbl_orte" odto on odto.id = kdti."Ort_id"
        join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
        join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
        join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
          kdta."start_Antwort" <> kdta."stop_Antwort" and 
          kdtt.id in $$tagId and 
          odto.osm_id = $osmId and 
          kdta3.id = kdta."zu_Aufgabe_id" 
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
    UNION
    select
          kdte."start_Aufgabe" as "start_Antwort", 
          kdte."stop_Aufgabe" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez,
          kdti."ID_Erh_id"
        from "KorpusDB_tbl_tags" kdtt      
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
          ) kdta on true
          join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id"
          ) pdti on true
          JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id
          ) kdte on true
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
          join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
        	kdtt.id in $$tagId
        	and odto.osm_id = $osmId
          and kdti."Dateipfad" not in ('', '0') 
          and kdti."Audiofile" not in ('', '0')
          and kdta3.id = kdta."zu_Aufgabe_id"
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
        group by 
          kdti."ID_Erh_id" ,
          pdti.id,
          kdte."start_Aufgabe", 
          kdte."stop_Aufgabe",
          kdti."Dateipfad", 
          kdti."Audiofile",
          kdtt.id, 
          odto.osm_id, 
          kdtt."Tag_lang",
          pdtig.gruppe_bez, pdtt.team_bez
          having count(pdti.id) > 2 and count(kdti."ID_Erh_id") > 2  
        UNION
          select
            kdte."start_Aufgabe" as "start_Antwort", 
            kdte."stop_Aufgabe" as "stop_Antwort",
            kdti."Dateipfad" as dateipfad, 
            kdti."Audiofile" as "audiofile",
            kdtt.id as tag_id, 
            odto.osm_id as osmId, 
            kdtt."Tag_lang" as tag_name,
            pdtig.gruppe_bez, pdtt.team_bez,
            kdti."ID_Erh_id"
        from "KorpusDB_tbl_tags" kdtt      
          join lateral (
          	select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
          ) kdta2 on true
          join lateral (
          	select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
          ) kdta on true
          join lateral (
          	select * from "PersonenDB_tbl_informanten" pdti where pdti.id = kdta."von_Inf_id"
          ) pdti on true
          JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on pdti.inf_ort_id = odto.id
          join lateral(
          	select * from "KorpusDB_tbl_erhinfaufgaben" kdte where kdte."id_InfErh_id" = kdti.id
          ) kdte on true
          join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
        	kdtt.id in $$tagId
        	and odto.osm_id = $osmId
          and kdta3.id = kdta."zu_Aufgabe_id"  
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
        group by 
          kdti."ID_Erh_id",
          pdti.id,
          kdte."start_Aufgabe", 
          kdte."stop_Aufgabe",
          kdti."Dateipfad", 
          kdti."Audiofile",
          kdtt.id, 
          odto.osm_id, 
          kdtt."Tag_lang",
          pdtig.gruppe_bez, pdtt.team_bez
          having count(pdti.id) > 2 and count(kdti."ID_Erh_id") > 2      
    `;
    return await query(getTimeStampAntwort, {
      tagId: tagId,
      osmId: osmId,
      ageLower: ageLower,
      ageUpper: ageUpper,
      beruf: beruf,
      gender: gender,
      aus: aus,
      gender_sel: gender_sel,
    });
  },
  async getStampsFromAntwort(
    tagId: number[],
    osmId: string,
    ageLower: number,
    ageUpper: number,
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number
  ) {
    const getStampsFromAntwort = sql<
      IGetStampsFromAntwortParams & IGetStampsFromAntwortQuery
    >`
      select kdta."start_Antwort" as "start_Antwort", 
          kdta."stop_Antwort" as "stop_Antwort",
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          kdtt.id as tag_id, 
          odto.osm_id as osmId, 
          kdtt."Tag_lang" as tag_name,
          pdtig.gruppe_bez, pdtt.team_bez
       	from "KorpusDB_tbl_tags" kdtt       
        join "KorpusDB_tbl_antwortentags" kdta2 on kdta2."id_Tag_id" = kdtt.id
        join "KorpusDB_tbl_antworten" kdta on kdta2."id_Antwort_id" = kdta.id
        join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta."von_Inf_id"
        JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
        join "KorpusDB_tbl_inf_zu_erhebung" kdtize on pdti.id = kdtize."ID_Inf_id" 
        join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id 
        join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_InfErh_id" = kdti.id
        join "KorpusDB_tbl_aufgaben" kdta3 on kdte."id_Aufgabe_id" = kdta3.id
        join "OrteDB_tbl_orte" odto on odto.id = kdti."Ort_id"
        join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
        join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
        join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE 
          kdta."start_Antwort" <> kdta."stop_Antwort" and 
          kdtt.id in $$tagId and 
          odto.osm_id = $osmId and 
          kdta3.id = kdta."zu_Aufgabe_id" 
          and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
          and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
    `;
    return await query(getStampsFromAntwort, {
      tagId: tagId,
      osmId: osmId,
      ageLower: ageLower,
      ageUpper: ageUpper,
      beruf: beruf,
      gender: gender,
      aus: aus,
      gender_sel: gender_sel,
    });
  },
  async selectAntwortenTrans(
    tagID: number[],
    osmId: string,
    ageLower: number,
    ageUpper: number,
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number
  ) {
    const selectAntwortenTrans = sql<
      ISelectAntwortenTransQuery & ISelectAntwortenTransParams
    >`
    select distinct e.start_time as "start_Antwort", 
          e.end_time as "stop_Antwort",
          kdtt."Tag_lang" as tag_name,
          t.ortho as "ortho", 
          kdti."Dateipfad" as dateipfad, 
          kdti."Audiofile" as "audiofile",
          t.text_in_ortho as "ortho_text",
          pdtig.gruppe_bez, pdtt.team_bez,
          t.token_reihung
    from "KorpusDB_tbl_tags" kdtt       
    join lateral (
      select * from "KorpusDB_tbl_antwortentags" kdta2 where kdta2."id_Tag_id" = kdtt.id
    ) kdta2 on true
    left join lateral (
      select * from "KorpusDB_tbl_antworten" kdta where kdta2."id_Antwort_id" = kdta.id
    ) kdta on true
    join tokenset t4 on t4.id = kdta.ist_tokenset_id 
    join tokentoset t2 on t2.id_tokenset_id = t4.id
    join token t on t.id = t2.id_token_id or t.id = kdta.ist_token_id 
    join event e on t.event_id_id = e.id 
    left join transcript t3 on t3.id = t.transcript_id_id 
    left join "PersonenDB_tbl_informanten" pdti on pdti.id = t."ID_Inf_id"
    left join "KorpusDB_tbl_inferhebung" kdti on kdti."id_Transcript_id" = t3.id
    left join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id 
    left join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id
    left join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id
    left JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id 
    left join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
      where (kdta.ist_token_id is not null or kdta.ist_tokenset_id is not null) and 
        kdtt.id in $$tagID 
        and odto.osm_id  = $osmId
        and kdti."Dateipfad" not in ('', '0') 
        and kdti."Audiofile" not in ('', '0')
        and ($ageLower < 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
        and ($ageUpper < 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
        and ($aus = '' OR pdti.ausbildung_max = $aus)
        and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
        and ($gender_sel < 0 OR pdtp.weiblich = $gender)
      order by 
      	t.token_reihung 
    `;
    return await query(selectAntwortenTrans, {
      tagID: tagID,
      osmId: osmId,
      ageLower: ageLower,
      ageUpper: ageUpper,
      beruf: beruf,
      gender: gender,
      aus: aus,
      gender_sel: gender_sel,
    });
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
          JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize."ID_Inf_id" = pdti.id 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdtize.id_inferhebung_id
          join "OrteDB_tbl_orte" odto on kdti."Ort_id" = odto.id
          join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_InfErh_id" = kdti.id
          join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
          join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
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
  async selectMatchingTokens(ortho: string, phon: string, lemma: string) {
    const selectMatchingTokens = sql<
      ISelectMatchingTokensQuery & ISelectMatchingTokensParams
    >`
    select t.id, t.ortho, t.text_in_ortho, t.splemma from "token" t 
      where ($ortho = '' or t.ortho like $ortho) and 
      ($phon = '' or t.text_in_ortho like $phon) and
      ($lemma = '' or t.splemma like $lemma);
    `;
    return await query(selectMatchingTokens, {
      ortho: ortho,
      phon: phon,
      lemma: lemma,
    });
  },
  async selectErhebungsarten() {
    const selectErhebungsarten = sql<ISelectErhebungsartenQuery>`select kdte.id, kdte."Bezeichnung" from "KorpusDB_tbl_erhebungsarten" kdte;`;
    return await query(selectErhebungsarten);
  },
};

export default antwortenDao;
