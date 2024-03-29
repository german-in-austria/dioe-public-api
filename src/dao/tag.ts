import { sql } from '@pgtyped/query';
import query from './connect/pg';
import {
  ISelectTagsQuery,
  ISelectTagsLayersQuery,
  ISelectOrtTagsQuery,
  ISelectOrtTagsParams,
  ISelectSingleGenQuery,
  ISelectSingleGenParams,
  ISelectTagByIdQuery,
  ISelectTagByIdParams,
  IGetPresetTagsQuery,
  IGetTagsByPresetQuery,
  IGetPresetOrtTagQuery,
  IGetPresetOrtTagParams,
  ISelectOrtTagGroupParams,
  ISelectOrtTagGroupQuery,
  ISelectOrtTokenQuery,
  ISelectOrtTokenParams,
  ISelectOrtTokenSingleParams,
  ISelectOrtTokenSingleQuery,
  ISelectOrtTokenSpposParams,
  ISelectOrtTokenSpposQuery,
  IGetAllSpposQuery,
} from './tag.queries';

const tagDao = {
  async getTagLayers() {
    const selectTagsLayers = sql<ISelectTagsLayersQuery>`
      SELECT
        id,
        "Name"
      FROM
        "KorpusDB_tbl_tagebene"
    `;
    return await query(selectTagsLayers);
  },
  async getSingleTagById(tagId: number) {
    const selectTagById = sql<ISelectTagByIdParams & ISelectTagByIdQuery>`
    select t.id AS tag_id,
        t. "Tag" AS tag_abbrev,
        t."Generation" AS tag_gene,
        t. "Tag_lang" AS tag_name,
        t. "Kommentar" AS tag_comment,
        t. "AReihung" AS tag_order,
        t. "zu_Phaenomen_id" AS phenomen_id
        from "KorpusDB_tbl_tags" t 
        where t.id = $tagId
    `;
    return await query(selectTagById, { tagId: tagId });
  },
  async getTagTree() {
    // Generation Anzeigen
    // Ordnung: AReihnung
    // 0. Generation keine AReihung
    // Alphabetisch und dann nach Reihung
    const selectTags = sql<ISelectTagsQuery>`
      SELECT
        t.id AS tag_id,
        t. "Tag" AS tag_abbrev,
        t."Generation" AS tag_gene,
        t. "Tag_lang" AS tag_name,
        t. "Kommentar" AS tag_comment,
        t. "AReihung" AS tag_order,
        t. "zu_Phaenomen_id" AS phenomen_id,
        p. "Bez_Phaenomen" AS phenomen_name,
        te. "Name" AS tag_ebene_name,
        te.id AS tag_ebene_id,
        (
          SELECT
            array_agg("id_ChildTag_id")
          FROM "KorpusDB_tbl_tagfamilie"
        WHERE
          "id_ParentTag_id" = t.id) AS children_ids,
        (
          SELECT
            array_agg("id_ParentTag_id")
          FROM "KorpusDB_tbl_tagfamilie"
        WHERE
          "id_ChildTag_id" = t.id) AS parent_ids
      FROM
        "KorpusDB_tbl_tags" t
        LEFT JOIN "KorpusDB_tbl_phaenomene" p ON t. "zu_Phaenomen_id" = p.id
        LEFT JOIN "KorpusDB_tbl_tagebenezutag" tet ON t. "id" = tet. "id_Tag_id"
        LEFT JOIN "KorpusDB_tbl_tagebene" te ON tet. "id_TagEbene_id" = te.id
    `;
    return await query(selectTags);
  },
  async getSingleGen(gen: number) {
    const selectSingleGen = sql<ISelectSingleGenParams & ISelectSingleGenQuery>`
    select t.id AS tag_id,
        t. "Tag" AS tag_abbrev,
        t."Generation" AS tag_gene,
        t. "Tag_lang" AS tag_name,
        t. "Kommentar" AS tag_comment,
        t. "AReihung" AS tag_order,
        -- phaenomen
        t. "zu_Phaenomen_id" AS phenomen_id from "KorpusDB_tbl_tags" t 
        where t."Generation" = $gen
    `;
    return await query(selectSingleGen, { gen: gen });
  },
  async getOrtTagToken(
    tagId: number[],
    erhArt: number[],
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number,
    project_id: number,
    text: string,
    ortho: string,
    lemmaCI: string,
    lemmaC: string
  ) {
    const selectOrtToken = sql<ISelectOrtTokenQuery & ISelectOrtTokenParams>`
        SELECT
          count(1) AS num_tag,
          CONCAT(ARRAY_AGG(distinct kdtt."Tag")) AS tag_name,
          odto. "osm_id" AS osm_id,
          odto. "ort_namelang" AS ort_namelang,
          odto. "lat" AS lat,
          odto. "lon" AS lon
        FROM
          "KorpusDB_tbl_tags" kdtt
          JOIN "KorpusDB_tbl_antwortentags" kdta ON kdtt.id = kdta. "id_Tag_id"
          JOIN "KorpusDB_tbl_antworten" kdta2 ON kdta. "id_Antwort_id" = kdta2.id
          JOIN "PersonenDB_tbl_informanten" pdti ON kdta2. "von_Inf_id" = pdti.id
          JOIN "token" t on t."ID_Inf_id" = pdti.id 
            and ($textTag = '' OR t.text ~* $textTag)
            and ($textOrtho = '' OR t.ortho ~* $textOrtho)
          LEFT JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          JOIN "OrteDB_tbl_orte" odto ON pdti.inf_ort_id = odto.id
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE
          ($firstTagId < 0 OR (kdtt.id IN $$tagId 
            AND kdta2.id in 
            (select kdta3."id_Antwort_id" 
              from "KorpusDB_tbl_antwortentags" kdta3 
                join "KorpusDB_tbl_tagebene" kdtt on kdtt.id = kdta3."id_TagEbene_id"
                join "KorpusDB_tbl_tagebenezutag" kdtt2 on kdtt2."id_TagEbene_id" = kdtt.id
                join "KorpusDB_tbl_tags" kdtt3 on kdtt2."id_Tag_id" = kdtt3.id
              where 
                kdta3."id_Tag_id" IN $$tagId
                and ($tagLen = 0 or kdtt3."Generation" = 0) 
                and ($tagLen = 0 or kdtt3.id in $$tagId)
              group by kdta3."id_Antwort_id" 
                having count(kdta3."id_Tag_id") >= $tagLen)
          )) 
          and ($firstErhArt < 0 or pdti.id in (
	         select kdtize."ID_Inf_id" from "KorpusDB_tbl_inf_zu_erhebung" kdtize
	          join "KorpusDB_tbl_inferhebung" kdti2 on kdti2.id = kdtize.id_inferhebung_id
	          join "KorpusDB_tbl_erhebungen" kdte2 on kdte2.id = kdti2."ID_Erh_id"
	          where ($firstErhArt < 0 or kdte2."Art_Erhebung_id" in $$erhArt)
          ))
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
          and pdti.inf_gruppe_id in (
            select pdtig.id from "PersonenDB_tbl_informantinnen_gruppe" pdtig 
            where $project_id <= 0 or pdtig.gruppe_team_id = $project_id)
          
          and ($lemmaTokenC = '' or t.splemma ~ $lemmaTokenC)
          and ($lemmaTokenCI = '' or t.splemma ~* $lemmaTokenCI)
        GROUP BY
          odto.osm_id,
          odto.ort_namelang,
          odto.lat,
          odto.lon        
      `;
    return await query(selectOrtToken, {
      tagId: tagId,
      firstTagId: tagId[0],
      tagLen: tagId.length,
      lemmaTokenC: lemmaC,
      lemmaTokenCI: lemmaCI,
      beruf: beruf,
      gender: gender,
      erhArt: erhArt,
      firstErhArt: erhArt[0],
      gender_sel: gender_sel,
      aus: aus,
      project_id: project_id,
      // @ts-ignore
      textTag: text,
      // @ts-ignore
      textOrtho: ortho,
      /*
      text.map((el) => {
        return { val: el };
      })
      */
    });
  },
  async getOrtToken(
    erhArt: number[],
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number,
    project_id: number,
    textC: string,
    textCI: string,
    lemmaC: string,
    lemmaCI: string
  ) {
    const selectOrtTokenSingle = sql<
      ISelectOrtTokenSingleParams & ISelectOrtTokenSingleQuery
    >`
      select 
      count(1) as num_tag, 
      odto. "osm_id" AS osm_id,
                odto. "ort_namelang" AS ort_namelang,
                odto. "lat" AS lat,
                odto. "lon" AS lon
                from token t 
      join "PersonenDB_tbl_informanten" pdti on t."ID_Inf_id" = pdti.id
      join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id 
      join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id 
      LEFT JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
      where 
        ($textTagCI = '' OR t.ortho ~* $textTagCI)
        AND ($textTagC = '' OR t.ortho ~ $textTagC)
        AND ($tokenLemmaCI = '' OR t.splemma ~* $tokenLemmaCI)
        AND ($tokenLemmaC = '' OR t.splemma ~ $tokenLemmaC)
        and ($aus = '' OR pdti.ausbildung_max = $aus)
        and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
                  and ($gender_sel < 0 OR pdtp.weiblich = $gender)
                  and pdti.inf_gruppe_id in (
                    select pdtig.id from "PersonenDB_tbl_informantinnen_gruppe" pdtig 
                  where $project_id <= 0 or pdtig.gruppe_team_id = $project_id)
              GROUP BY
                odto.osm_id,
                odto.ort_namelang,
                odto.lat,
                odto.lon;
      `;
    return await query(selectOrtTokenSingle, {
      beruf: beruf,
      gender: gender,
      gender_sel: gender_sel,
      aus: aus,
      project_id: project_id,
      textTagCI: textCI,
      textTagC: textC,
      tokenLemmaC: lemmaC,
      tokenLemmaCI: lemmaCI,
    });
  },
  async getOrtTokenSppos(
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number,
    project_id: number,
    textC: string,
    textCI: string,
    lemmaC: string,
    lemmaCI: string,
    sppos: string
  ) {
    const selectOrtTokenSppos = sql<
      ISelectOrtTokenSpposParams & ISelectOrtTokenSpposQuery
    >`
      select 
      count(1) as num_tag, 
      odto. "osm_id" AS osm_id,
                odto. "ort_namelang" AS ort_namelang,
                odto. "lat" AS lat,
                odto. "lon" AS lon
                from token t 
      join "PersonenDB_tbl_informanten" pdti on t."ID_Inf_id" = pdti.id
      join "OrteDB_tbl_orte" odto on odto.id = pdti.inf_ort_id 
      join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id 
      where 
        ($textTagCI = '' OR t.ortho ~* $textTagCI)
        AND ($textTagC = '' OR t.ortho ~ $textTagC)
        AND ($tokenLemmaCI = '' OR t.splemma ~* $tokenLemmaCI)
        AND ($tokenLemmaC = '' OR t.splemma ~ $tokenLemmaC)
        AND ($sppos = '' OR t.sppos = $sppos)
        and ($aus = '' OR pdti.ausbildung_max = $aus)
        and (pdti.id in (
        	select pdiib.id_informant_id from "PersonenDB_inf_ist_beruf" pdiib where (pdiib.id_beruf_id = $beruf) 
        ) or $beruf < 0)
                  and ($gender_sel < 0 OR pdtp.weiblich = $gender)
                  and pdti.inf_gruppe_id in (
                    select pdtig.id from "PersonenDB_tbl_informantinnen_gruppe" pdtig 
                  where $project_id <= 0 or pdtig.gruppe_team_id = $project_id)
              GROUP BY
                odto.osm_id,
                odto.ort_namelang,
                odto.lat,
                odto.lon;
      `;
    return await query(selectOrtTokenSppos, {
      beruf: beruf,
      gender: gender,
      gender_sel: gender_sel,
      aus: aus,
      project_id: project_id,
      textTagCI: textCI,
      textTagC: textC,
      tokenLemmaC: lemmaC,
      tokenLemmaCI: lemmaCI,
      sppos: sppos,
    });
  },
  async getOrtTag(
    tagId: number[],
    tagLength: number,
    erhArt: number[],
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number,
    project_id: number,
    phaen: number[]
  ) {
    const selectOrtTags = sql<ISelectOrtTagsQuery & ISelectOrtTagsParams>`
        SELECT
          count(1) AS num_tag,
          CONCAT(ARRAY_AGG(distinct kdtt."Tag")) AS tag_name,
          odto. "osm_id" AS osm_id,
          odto. "ort_namelang" AS ort_namelang,
          odto. "lat" AS lat,
          odto. "lon" AS lon
        FROM
          "KorpusDB_tbl_tags" kdtt
          JOIN "KorpusDB_tbl_antwortentags" kdta ON kdtt.id = kdta. "id_Tag_id"
          JOIN "KorpusDB_tbl_antworten" kdta2 ON kdta. "id_Antwort_id" = kdta2.id
          JOIN "PersonenDB_tbl_informanten" pdti ON kdta2. "von_Inf_id" = pdti.id
          LEFT JOIN "PersonenDB_inf_ist_beruf" pdiib on pdiib.id_informant_id  = pdti.id
          JOIN "OrteDB_tbl_orte" odto ON pdti.inf_ort_id = odto.id
          join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
        WHERE
          ($tagId_first < 0 or kdtt.id IN $$tagId) 
          and pdti.id in (
	         select kdtize."ID_Inf_id" from "KorpusDB_tbl_inf_zu_erhebung" kdtize
	          join "KorpusDB_tbl_inferhebung" kdti2 on kdti2.id = kdtize.id_inferhebung_id
	          join "KorpusDB_tbl_erhebungen" kdte2 on kdte2.id = kdti2."ID_Erh_id"
	          where ($firstErhArt < 0 or kdte2."Art_Erhebung_id" in $$erhArt)
          )
          and ($aus = '' OR pdti.ausbildung_max = $aus)
          and ($beruf < 0 or pdiib.id_beruf_id = $beruf)
          and ($gender_sel < 0 OR pdtp.weiblich = $gender)
          and ($phaen_first < 0 OR kdtt."zu_Phaenomen_id" IN $$phaen)
          and pdti.inf_gruppe_id in (
            select pdtig.id from "PersonenDB_tbl_informantinnen_gruppe" pdtig 
            where $project_id <= 0 or pdtig.gruppe_team_id = $project_id)
        GROUP BY
          odto.osm_id,
          odto.ort_namelang,
          odto.lat,
          odto.lon        
      `;
    return await query(selectOrtTags, {
      tagId: tagId,
      tagId_first: tagId[0],
      beruf: beruf,
      gender: gender,
      erhArt: erhArt,
      firstErhArt: erhArt[0],
      gender_sel: gender_sel,
      aus: aus,
      project_id: project_id,
      phaen: phaen,
      phaen_first: phaen[0],
    });
  },
  async getOrtTagGroup(
    tagId: number[],
    erhArt: number[],
    aus: string,
    beruf: number,
    gender: boolean,
    gender_sel: number,
    project_id: number,
    tagGroupLength: number,
    phaen: number[]
  ) {
    const selectOrtTagGroup = sql<
      ISelectOrtTagGroupParams & ISelectOrtTagGroupQuery
    >`
      SELECT
        count(1) AS num_tag,
        CONCAT(ARRAY_AGG(distinct kdtt."Tag")) AS tag_name,
        odto. "osm_id" AS osm_id,
        odto. "ort_namelang" AS ort_namelang,
        odto. "lat" AS lat,
        odto. "lon" AS lon
      FROM
        "KorpusDB_tbl_tags" kdtt
        JOIN "KorpusDB_tbl_antwortentags" kdta ON kdtt.id = kdta. "id_Tag_id"
        JOIN "KorpusDB_tbl_antworten" kdta2 ON kdta. "id_Antwort_id" = kdta2.id
        JOIN "PersonenDB_tbl_informanten" pdti ON kdta2. "von_Inf_id" = pdti.id
        JOIN "OrteDB_tbl_orte" odto ON pdti.inf_ort_id = odto.id
        join "PersonenDB_tbl_personen" pdtp on pdtp.id = pdti.id_person_id
      WHERE
        ($firstTag < 0 OR kdtt.id IN $$tagId)
        and ($firstErhArt < 0 or pdti.id in (
          select kdtize."ID_Inf_id" from "KorpusDB_tbl_inf_zu_erhebung" kdtize
           join "KorpusDB_tbl_inferhebung" kdti2 on kdti2.id = kdtize.id_inferhebung_id
           join "KorpusDB_tbl_erhebungen" kdte2 on kdte2.id = kdti2."ID_Erh_id"
           where ($firstErhArt < 0 or kdte2."Art_Erhebung_id" in $$erhArt)
         ))
        and ($aus = '' OR pdti.ausbildung_max = $aus)
        and (pdti.id in (
        	select pdiib.id_informant_id from "PersonenDB_inf_ist_beruf" pdiib where (pdiib.id_beruf_id = $beruf) 
        ) or $beruf < 0)
        and ($gender_sel < 0 OR pdtp.weiblich = $gender)
        and ($phaen_first < 0 OR kdtt."zu_Phaenomen_id" IN $$phaen)
        and kdta."id_Antwort_id" in 
        (select kdta3."id_Antwort_id" 
          from "KorpusDB_tbl_antwortentags" kdta3 
            join "KorpusDB_tbl_tagebene" kdtt on kdtt.id = kdta3."id_TagEbene_id"
            join "KorpusDB_tbl_tagebenezutag" kdtt2 on kdtt2."id_TagEbene_id" = kdtt.id
            join "KorpusDB_tbl_tags" kdtt3 on kdtt2."id_Tag_id" = kdtt3.id
          where 
            kdta3."id_Tag_id" IN $$tagId
            and ($tagGroupLength = 0 or kdtt3."Generation" = 0) 
            and ($tagGroupLength = 0 or kdtt3.id in $$tagId)
          group by kdta3."id_Antwort_id" 
          having count(kdta3."id_Tag_id") >= $tagGroupLength)
        and pdti.inf_gruppe_id in (
          select pdtig.id from "PersonenDB_tbl_informantinnen_gruppe" pdtig 
          where $project_id <= 0 or pdtig.gruppe_team_id = $project_id)
      GROUP BY
        odto.osm_id,
        odto.ort_namelang,
        odto.lat,
        odto.lon
    `;
    return await query(selectOrtTagGroup, {
      firstTag: tagId[0],
      tagId: tagId,
      beruf: beruf,
      gender: gender,
      erhArt: erhArt,
      firstErhArt: erhArt[0],
      gender_sel: gender_sel,
      aus: aus,
      project_id: project_id,
      tagGroupLength: tagGroupLength,
      phaen: phaen,
      phaen_first: phaen[0],
    });
  },
  async getPresetOrtTag(tagIDs: number[]) {
    const getPresetOrtTag = sql<IGetPresetOrtTagQuery & IGetPresetOrtTagParams>`
    SELECT
        count(*) AS num_tag,
        kdsp.id as preset_id,
        kdsp."Bezeichnung" as preset_name, 
        odto. "osm_id" AS osm_id,
        odto. "ort_namelang" AS ort_namelang,
        odto. "lat" AS lat,
        odto. "lon" AS lon
    FROM "KorpusDB_sys_presettags" kdsp 
    join "KorpusDB_sys_tagszupresettags" kdst on kdsp.id = kdst."id_PresetTags_id" 
    join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdst."id_Tag_id" 
    JOIN "KorpusDB_tbl_antwortentags" kdta ON kdtt.id = kdta. "id_Tag_id"
    JOIN "KorpusDB_tbl_antworten" kdta2 ON kdta. "id_Antwort_id" = kdta2.id
    JOIN "PersonenDB_tbl_informanten" pdti ON kdta2. "von_Inf_id" = pdti.id
    JOIN "OrteDB_tbl_orte" odto ON pdti.inf_ort_id = odto.id
    WHERE 
      kdsp.id IN $$tagIDs
      GROUP BY
        odto.osm_id,
        odto.ort_namelang,
        kdsp.id,
        odto.lat,
        odto.lon
      ORDER BY
      num_tag DESC;
    `;
    return await query(getPresetOrtTag, { tagIDs: tagIDs });
  },
  async getPresetTags() {
    const getPresetTags = sql<IGetPresetTagsQuery>`
    select kdsp.id, 
    kdsp."Bezeichnung", 
    kdsp."Kommentar" 
    from "KorpusDB_sys_presettags" kdsp 
    `;
    return await query(getPresetTags);
  },
  async getTagsByPreset(tagIDs: number[]) {
    const getTagsByPreset = sql<IGetTagsByPresetQuery>`
    select kdsp.id as "preset_id", kdsp."Bezeichnung", 
    kdtt.id as "tagId", kdtt."Tag", kdtt."Tag_lang", 
    kdtt."Generation" 
    from "KorpusDB_sys_presettags" kdsp 
    join "KorpusDB_sys_tagszupresettags" kdst on kdsp.id = kdst."id_PresetTags_id" 
    join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdst."id_Tag_id" 
    where 
      kdsp.id IN $$tagIDs
    `;
    return await query(getTagsByPreset, { tagIDs: tagIDs });
  },
  async getAllSppos() {
    const getAllSppos = sql<IGetAllSpposQuery>`select distinct t.sppos from token t where t.sppos <> ''`;
    return await query(getAllSppos);
  },
};

export default tagDao;
