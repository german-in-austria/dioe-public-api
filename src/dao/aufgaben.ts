import { sql } from '@pgtyped/query';
import query from './connect/pg';
import {
  ISelectAufgabenSetQuery,
  ISelectAufgabenSetParams,
  ISelectAufgabenParams,
  ISelectAufgabenQuery,
  ISelectAufgabenFromSetParams,
  ISelectAufgabenFromSetQuery,
  ISelectAllAufgabenQuery,
  ISelectOrtAufgabeQuery,
  ISelectAllTeamsQuery,
  ISelectAufgabeAudioByOrtQuery,
} from './aufgaben.queries';

const aufgabenDao = {
  async getAufgabenSetPhaen(phaenID: number[]) {
    const selectAufgabenSet = sql<
      ISelectAufgabenSetParams & ISelectAufgabenSetQuery
    >`
        SELECT kdta.id, kdta."Kuerzel", kdta."Name_Aset", kdta."Fokus", kdta."Kommentar" 
        FROM "KorpusDB_tbl_aufgabensets" kdta 
        WHERE kdta."zu_Phaenomen_id" in $$phaenID;
        `;
    return await query(selectAufgabenSet, { phaenID: phaenID });
  },
  async getAufgabenPhaen(phaenID: number[]) {
    const selectAufgaben = sql<ISelectAufgabenParams & ISelectAufgabenQuery>`
      select kdta.id, kdta."Beschreibung_Aufgabe", kdta."Aufgabenstellung" from "KorpusDB_tbl_aufgaben" kdta 
      join "KorpusDB_tbl_phaenzuaufgabe" kdtp on kdta.id = kdtp.id_aufgabe_id 
      join "KorpusDB_tbl_phaenomene" kdtp2 on kdtp2.id = kdtp.id_phaenomen_id 
      where kdtp2.id IN $$phaenID;
      `;
    return await query(selectAufgaben, { phaenID: phaenID });
  },
  async getAufgabenWithSet(aufgabenSet: number[]) {
    const selectAufgabenFromSet = sql<
      ISelectAufgabenFromSetParams & ISelectAufgabenFromSetQuery
    >`
      select kdta.id, kdta."Variante", kdta."Beschreibung_Aufgabe", kdta."Aufgabenstellung",
      kdta2."Kuerzel", kdta2."Name_Aset", kdta2.id as "set_id" ,kdtp."Bez_Phaenomen", kdtp.id as "phaen_id"
      from "KorpusDB_tbl_aufgaben" kdta 
      join "KorpusDB_tbl_aufgabensets" kdta2 ON kdta."von_ASet_id" = kdta2.id 
      join "KorpusDB_tbl_phaenomene" kdtp on kdta2."zu_Phaenomen_id" = kdtp.id
      where kdta2.id IN $$aufgabenSet
      `;
    return await query(selectAufgabenFromSet, { aufgabenSet: aufgabenSet });
  },
  async getAllAufgaben() {
    const selectAllAufgaben = sql<ISelectAllAufgabenQuery>`
    select kdta.id as "auf_id",
    kdta."Beschreibung_Aufgabe" as "beschreibung",
    kdta."Aufgabenstellung" as "aufgabenstellung",
    kdta."Kontext" as "kontext",
    kdta3."Bezeichnung" as "art_bezeichnung",
    kdta2."Name_Aset" as "aset_name",
    kdta2."Fokus" as "aset_fokus"
    from "KorpusDB_tbl_aufgaben" kdta 
    LEFT join "KorpusDB_tbl_aufgabensets" kdta2 on kdta2.id = kdta."von_ASet_id" 
    LEFT join "KorpusDB_tbl_aufgabenarten" kdta3 on kdta3.id = kdta."Aufgabenart_id" 
    `;
    return await query(selectAllAufgaben);
  },
  async getOrtAufgabe(aufgID: number[], asetIds: number[]) {
    const selectOrtAufgabe = sql<ISelectOrtAufgabeQuery>`
      select count(*) as num_aufg, 
        kdta.id,
        (case when kdta."Aufgabenstellung" is null then kdta."Beschreibung_Aufgabe" else kdta."Aufgabenstellung" END) as aufgabenstellung,   
        odto.ort_namelang, odto.lat, odto.lon, odto.osm_id
      from "KorpusDB_tbl_aufgaben" kdta
      join "KorpusDB_tbl_antworten" kdta2 on kdta2."zu_Aufgabe_id" = kdta.id
      join "PersonenDB_tbl_informanten" pdti on pdti.id = kdta2."von_Inf_id"
      join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id
      where 
        ($aufId < 0 OR kdta.id IN $$aufgID)
        AND ($asetSinId < 0 OR kdta."von_ASet_id" IN $$asetId)
        and kdta2."start_Antwort" <> '00:00:00' 
        and kdta2."stop_Antwort"  <> '00:00:00'
      group by 
        odto.osm_id,
        odto.ort_namelang,
        kdta.id,
        kdta."Aufgabenstellung",
        odto.lat,
        odto.lon
        union
        select count(*) as num_aufg, 
            kdta.id,
            (case when kdta."Aufgabenstellung" is null then kdta."Beschreibung_Aufgabe" else kdta."Aufgabenstellung" END) as aufgabenstellung,   
            odto.ort_namelang, odto.lat, odto.lon, odto.osm_id 
        from "KorpusDB_tbl_aufgaben" kdta 
          join "KorpusDB_tbl_erhinfaufgaben" kdte on kdta.id = kdte."id_Aufgabe_id" 
          join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdte."id_InfErh_id" 
          join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize.id_inferhebung_id = kdti.id
          join "PersonenDB_tbl_informanten" pdti on pdti.id = kdtize."ID_Inf_id" 
          join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id 
        where  
          ($aufId < 0 OR kdta.id IN $$aufgID)
          AND ($asetSinId < 0 OR kdta."von_ASet_id" IN $$asetId)  
        group by 
          odto.osm_id,
          odto.ort_namelang,
          kdta.id,
          kdta."Aufgabenstellung",
          odto.lat,
          odto.lon
    `;
    return await query(selectOrtAufgabe, {
      aufgID: aufgID,
      aufId: aufgID[0],
      asetSinId: asetIds[0],
      asetId: asetIds,
    });
  },
  async getTeams() {
    const selectAllTeams = sql<ISelectAllTeamsQuery>`
    select pdtt.id as "team_id", 
    pdtt.team_bez as "team" 
    from "PersonenDB_tbl_teams" pdtt 
    `;
    return await query(selectAllTeams);
  },
  async getAufgabeOrtAudio(
    aufIDs: number[],
    osmId: string,
    ageLower: number,
    ageUpper: number
  ) {
    const selectAufgabeAudioByOrt = sql<ISelectAufgabeAudioByOrtQuery>`
    select kdta.id,
    kdta."Aufgabenstellung" as "aufgabe", 
    kdti."Dateipfad" as "dateipfad",
    kdti."Audiofile" as "audiofile",
    kdte."start_Aufgabe" + (COALESCE(kdti.sync_time, interval '0') - COALESCE(kdti.time_beep , interval '0')) as "start_aufgabe",
    kdte."stop_Aufgabe"  + (COALESCE(kdti.sync_time, interval '0') - COALESCE(kdti.time_beep , interval '0')) as "stop_aufgabe",
    pdtig.gruppe_bez, pdtt.team_bez,
    pdti.inf_sigle,
    DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) as age
    from "KorpusDB_tbl_aufgaben" kdta
      join "KorpusDB_tbl_antworten" kdta2 on kdta2."zu_Aufgabe_id" = kdta.id
      join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_Aufgabe_id" = kdta.id
      join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdte."id_InfErh_id" 
      join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize.id_inferhebung_id = kdti.id
      join "PersonenDB_tbl_informanten" pdti on pdti.id = kdtize."ID_Inf_id" 
      join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id
      join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
      join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
      join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
    where
      kdta2."von_Inf_id" = pdti.id and kdta.id IN $$aufIDs 
      and odto.osm_id = $osmId 
      and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
      and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
    UNION
      select kdta.id,
      kdta."Aufgabenstellung" as "aufgabe", 
      kdti."Dateipfad" as "dateipfad",
      kdti."Audiofile" as "audiofile",
      kdte."start_Aufgabe" + (COALESCE(kdti.sync_time, interval '0') - COALESCE(kdti.time_beep , interval '0')) as "start_aufgabe",
    kdte."stop_Aufgabe"  + (COALESCE(kdti.sync_time, interval '0') - COALESCE(kdti.time_beep , interval '0')) as "stop_aufgabe",
      pdtig.gruppe_bez, pdtt.team_bez,
      pdti.inf_sigle,
      DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) as age
      from "KorpusDB_tbl_aufgaben" kdta
      join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_Aufgabe_id" = kdta.id
        join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdte."id_InfErh_id" 
        join "KorpusDB_tbl_inf_zu_erhebung" kdtize on kdtize.id_inferhebung_id = kdti.id
        join "PersonenDB_tbl_informanten" pdti on pdti.id = kdtize."ID_Inf_id" 
        join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id  
        join "PersonenDB_tbl_informantinnen_gruppe" pdtig on pdtig.id = pdti.inf_gruppe_id 
        join "PersonenDB_tbl_teams" pdtt on pdtt.id = pdtig.gruppe_team_id 
        join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
      where
        kdta.id IN $$aufIDs 
        and odto.osm_id = $osmId  
        and ($ageLower <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) >= $ageLower)
        and ($ageUpper <= 1 or DATE_PART('year', AGE(kdti."Datum", pdtp.geb_datum)) <= $ageUpper)
    `;
    return await query(selectAufgabeAudioByOrt, {
      aufIDs: aufIDs,
      osmId: osmId,
      ageLower: ageLower,
      ageUpper: ageUpper,
    });
  },
};

export default aufgabenDao;
