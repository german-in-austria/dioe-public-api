import { sql } from '@pgtyped/query'
import query from './connect/pg'
import { ISelectTagsQuery } from './tag.queries'

const tagDao = {
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
        -- children as array
        (
          SELECT array_agg("id_ChildTag_id")
          FROM "KorpusDB_tbl_tagfamilie"
          WHERE "id_ParentTag_id" = t.id
        ) as child_ids,
        -- parents as array
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
  }
}

export default tagDao
