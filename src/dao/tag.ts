import { sql } from "@pgtyped/query";
import query from "./connect/pg";
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
} from "./tag.queries";

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
  async getOrtTag(tagId: number[]) {
    const selectOrtTags = sql<ISelectOrtTagsQuery & ISelectOrtTagsParams>`
      SELECT
        count(*) AS num_tag,
        kdtt. "Tag" AS tag_name,
        kdtt. "Tag_lang" AS tag_lang,
        kdtt.id as tag_id,
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
      WHERE
        kdtt.id IN $$tagId
      GROUP BY
        odto.osm_id,
        odto.ort_namelang,
        kdtt. "Tag",
        kdtt. "Tag_lang",
        kdtt.id,
        odto.lat,
        odto.lon
      ORDER BY
      num_tag DESC;
      
    `;
    return await query(selectOrtTags, { tagId: tagId });
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
    select kdsp.id, kdsp."Bezeichnung", 
    kdtt.id, kdtt."Tag", kdtt."Tag_lang", 
    kdtt."Generation" 
    from "KorpusDB_sys_presettags" kdsp 
    join "KorpusDB_sys_tagszupresettags" kdst on kdsp.id = kdst."id_PresetTags_id" 
    join "KorpusDB_tbl_tags" kdtt on kdtt.id = kdst."id_Tag_id" 
    where 
      kdsp.id IN $$tagIDs
    `;
    return await query(getTagsByPreset, { tagIDs: tagIDs });
  },
};

export default tagDao;
