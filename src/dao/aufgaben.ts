import { sql } from "@pgtyped/query";
import query from "./connect/pg";
import {
  ISelectAufgabenSetQuery,
  ISelectAufgabenSetParams,
  ISelectAufgabenParams,
  ISelectAufgabenQuery,
  ISelectAufgabenFromSetParams,
  ISelectAufgabenFromSetQuery,
  ISelectAllAufgabenQuery,
  ISelectOrtAufgabeQuery,
} from "./aufgaben.queries";

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
      select kdta.id, kdta."Variante", kdta."Beschreibung_Aufgabe", kdta."Beschreibung_Aufgabe", kdta."Aufgabenstellung",
      kdta2."Kuerzel", kdta2."Name_Aset", kdta2.id ,kdtp."Bez_Phaenomen", kdtp.id 
      from "KorpusDB_tbl_aufgaben" kdta 
      join "KorpusDB_tbl_aufgabensets" kdta2 ON kdta."von_ASet_id" = kdta2.id 
      join "KorpusDB_tbl_phaenomene" kdtp on kdta2."zu_Phaenomen_id" = kdtp.id
      where kdta2.id IN $$aufgabenSet
      `;
    return await query(selectAufgabenFromSet, { aufgabenSet: aufgabenSet });
  },
  async getAllAufgaben() {
    const selectAllAufgaben = sql<ISelectAllAufgabenQuery>`
    select kdta.id as "Auf_id",
    kdta."Beschreibung_Aufgabe" as "Beschreibung",
    kdta."Aufgabenstellung",
    kdta."Kontext",
    kdta3."Bezeichnung" as "Art_Bezeichnung",
    kdta2."Name_Aset" as "Aset_Name",
    kdta2."Fokus" as "Aset_Fokus"
    from "KorpusDB_tbl_aufgaben" kdta 
    join "KorpusDB_tbl_aufgabensets" kdta2 on kdta2.id = kdta."von_ASet_id" 
    join "KorpusDB_tbl_aufgabenarten" kdta3 on kdta3.id = kdta."Aufgabenart_id" 
    `;
    return await query(selectAllAufgaben);
  },
  async getOrtAufgabe(aufgID: number[]) {
    const selectOrtAufgabe = sql<ISelectOrtAufgabeQuery>`
    select count(*) as num_aufg, 
    kdta.id,
    kdta."Aufgabenstellung", 
    odto.ort_namelang, odto.lat, odto.lon, odto.osm_id 
    from "KorpusDB_tbl_aufgaben" kdta
      join "KorpusDB_tbl_antworten" kdta2 on kdta2."zu_Aufgabe_id" = kdta.id
      join "KorpusDB_tbl_erhinfaufgaben" kdte on kdte."id_Aufgabe_id" = kdta.id
      join "KorpusDB_tbl_inferhebung" kdti on kdti.id = kdte."id_InfErh_id" 
      join "OrteDB_tbl_orte" odto on odto.id = kdti."Ort_id" 
      where kdta.id IN $$aufgID
      group by 
      odto.osm_id,
       odto.ort_namelang,
       odto.lat,
        odto.lon,
        kdta.id,
        kdta."Aufgabenstellung" 
    `;
    return await query(selectOrtAufgabe, { aufgID: aufgID });
  },
};

export default aufgabenDao;
