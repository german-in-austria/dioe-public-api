import { sql } from '@pgtyped/query'
import query from './connect/pg'
import { ISelectTagsQuery, ISelectTagsLayersQuery, ISelectOrtTagsQuery, ISelectOrtTagsParams } from './tag.queries'

const tagDao = {

  async getTagLayers() {
    const selectTagsLayers = sql<ISelectTagsLayersQuery>`
      SELECT
        id,
        "Name"
      FROM
        "KorpusDB_tbl_tagebene"`
    return query(selectTagsLayers)
  },

  async getTagTree() {
    const selectTags = sql<ISelectTagsQuery>`
      SELECT
        -- the basic tag
        t.id as tag_id,
        t."Tag" as tag_abbrev,
        t."Tag_lang" as tag_name,
        t."Kommentar" as tag_comment,
        t."AReihung" as tag_order,
        -- phaenomen
        t."zu_Phaenomen_id" as phenomen_id,
        p."Bez_Phaenomen" as phenomen_name,
        -- ebene
        te."Name" as tag_ebene_name,
        te.id as tag_ebene_id,
        -- child ids as array or null
        (
          SELECT array_agg("id_ChildTag_id")
          FROM "KorpusDB_tbl_tagfamilie"
          WHERE "id_ParentTag_id" = t.id
        ) as children_ids,
        -- parent ids as array or null
        (
          SELECT array_agg("id_ParentTag_id")
          FROM "KorpusDB_tbl_tagfamilie"
          WHERE "id_ChildTag_id" = t.id
        ) as parent_ids
      FROM "KorpusDB_tbl_tags" t
      -- get all the adjunct data
      LEFT JOIN "KorpusDB_tbl_phaenomene" p
        ON t."zu_Phaenomen_id" = p.id
      LEFT JOIN "KorpusDB_tbl_tagebenezutag" tet
        ON t."id" = tet."id_Tag_id"
      LEFT JOIN "KorpusDB_tbl_tagebene" te
        ON tet."id_TagEbene_id" = te.id
    `
    return await query(selectTags)
  },

  async getOrtTag(tagId: number) {
    const selectOrtTags = sql<ISelectOrtTagsQuery & ISelectOrtTagsParams> `
      SELECT
        count(*) AS num_tag,
        kdtt. "Tag" AS tag_name,
        kdtt. "Tag_lang" AS tag_lang,
        odto. "osm_id" AS osm_id,
        odto. "ort_namelang" AS ort_namelang,
        odto. "lat" AS lat,
        odto. "lon" AS lon
      FROM
        "KorpusDB_tbl_tags" kdtt
        JOIN "KorpusDB_tbl_antwortentags" kdta ON kdtt.id = kdta. "id_Tag_id"
        JOIN "KorpusDB_tbl_antworten" kdta2 ON kdta. "id_Antwort_id" = kdta.id
        JOIN "PersonenDB_tbl_informanten" pdti ON kdta2. "von_Inf_id" = pdti.id
        JOIN "OrteDB_tbl_orte" odto ON pdti.inf_ort_id = odto.id
      WHERE
        kdtt.id = $tagId
      GROUP BY
        odto.osm_id,
        odto.ort_namelang,
        kdtt. "Tag",
        kdtt. "Tag_lang",
        odto.lat,
        odto.lon
      ORDER BY
      num_tag DESC;
      
    `
    return await query(selectOrtTags, { tagId: tagId });
  }
}

export default tagDao
