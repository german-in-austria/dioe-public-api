import {
  ISelectOrtTagsResult,
  ISelectSingleGenResult,
  ISelectTagsResult,
  ISelectTagByIdResult,
  IGetTagsByPresetResult,
  IGetPresetTagsResult,
  IGetPresetOrtTagResult,
} from '../dao/tag.queries';
import tagDao from '../dao/tag';
import _, { String } from 'lodash';

import { ausbildungGrad } from './social';
import { tag } from './validate';

export interface TagTree extends ISelectTagsResult {
  children: TagTree[];
}

export interface numDto extends ISelectOrtTagsResult {
  para: string | null;
}

export default {
  async getTagLayers() {
    return tagDao.getTagLayers();
  },
  async getTagById(id: number): Promise<ISelectTagByIdResult[]> {
    return tagDao.getSingleTagById(id);
  },

  async getTagList(): Promise<ISelectTagsResult[]> {
    return tagDao.getTagTree();
  },
  async getPresetTags(): Promise<IGetPresetTagsResult[]> {
    return tagDao.getPresetTags();
  },
  async getTagsFromPreset(tag: tag): Promise<ISelectOrtTagsResult[]> {
    const res: IGetTagsByPresetResult[] = await tagDao.getTagsByPreset(tag.ids);
    let aus = ausbildungGrad.find((el: string) => el === tag.ausbildung);
    if (aus == undefined) {
      aus = '';
    }
    return tagDao.getOrtTag(
      res.map((val) => val.tagId),
      0,
      tag.erhArt,
      aus,
      tag.beruf_id,
      tag.weiblich,
      tag.gender_sel,
      -1,
      [-1]
    );
  },
  async getPresetOrtTags(tagId: number[]): Promise<IGetPresetOrtTagResult[]> {
    return tagDao.getPresetOrtTag(tagId);
  },
  async getTagOrte(tag: tag[]): Promise<ISelectOrtTagsResult[]> {
    let res: ISelectOrtTagsResult[] = [];
    for (const el of tag) {
      let result: any[] = [];
      if (
        el.text.overall.length > 0 ||
        el.ortho.overall.length > 0 ||
        el.lemma.overall.length > 0 ||
        el.text.sppos.length > 0 ||
        el.ortho.sppos.length > 0 ||
        el.lemma.sppos.length > 0
      ) {
        if (el.ids[0] == -1) {
          if (
            el.text.overall.length > 0 ||
            el.ortho.overall.length > 0 ||
            el.lemma.overall.length > 0
          ) {
            console.log('calling');
            result = (await tagDao.getOrtToken(
              el.erhArt,
              el.ausbildung,
              el.beruf_id,
              el.weiblich,
              el.gender_sel,
              el.project_id,
              el.text.case,
              el.text.cI,
              el.lemma.case,
              el.lemma.cI
            )) as any as ISelectOrtTagsResult[];
          }
          if (el.text.sppos.length > 0) {
            console.log('calling1');
            for (const sppos of el.text.sppos) {
              console.log(sppos);
              const res = await tagDao.getOrtTokenSppos(
                el.ausbildung,
                el.beruf_id,
                el.weiblich,
                el.gender_sel,
                el.project_id,
                sppos.case,
                sppos.cI,
                '',
                '',
                sppos.sppos
              );
              result = this.concatByOsmID(result, res);
            }
          }
          if (el.lemma.sppos.length > 0) {
            console.log('calling2');
            for (const sppos of el.lemma.sppos) {
              const res = await tagDao.getOrtTokenSppos(
                el.ausbildung,
                el.beruf_id,
                el.weiblich,
                el.gender_sel,
                el.project_id,
                '',
                '',
                sppos.case,
                sppos.cI,
                sppos.sppos
              );
              result = this.concatByOsmID(result, res);
            }
          }
        } else {
          result = (await tagDao.getOrtTagToken(
            el.ids,
            el.erhArt,
            el.ausbildung,
            el.beruf_id,
            el.weiblich,
            el.gender_sel,
            el.project_id,
            el.text.overall,
            el.ortho.overall,
            el.lemma.cI,
            el.lemma.case
          )) as any as ISelectOrtTagsResult[];
        }
      } else {
        if (el.group) {
          result = (await tagDao.getOrtTagGroup(
            el.ids,
            el.erhArt,
            el.ausbildung,
            el.beruf_id,
            el.weiblich,
            el.gender_sel,
            el.project_id,
            el.ids.length,
            el.phaenIds
          )) as any as ISelectOrtTagsResult[];
        } else {
          result = await tagDao.getOrtTag(
            el.ids,
            el.ids.length,
            el.erhArt,
            el.ausbildung,
            el.beruf_id,
            el.weiblich,
            el.gender_sel,
            el.project_id,
            el.phaenIds
          );
        }
      }
      result = result as numDto[];
      result.forEach((e: numDto, idx: number, array) => {
        array[idx].para = el.para;
        if (e.tagName && e.tagName.startsWith('{')) {
          array[idx].tagName = e.tagName.substring(1, e.tagName.length - 1);
          array[idx].numTag = Math.floor(
            Number(array[idx].numTag) / el.ids.length
          ).toString();
        }
      });
      res = res.concat(result);
    }
    return res;
  },
  async getTagGen(gen: number): Promise<ISelectSingleGenResult[]> {
    return tagDao.getSingleGen(gen);
  },
  async getTagTree() {
    const list = await this.getTagList();
    const listById = _.keyBy(list, 'tagId');
    const firstLevelTags = list.filter((t) => t.parentIds === null);
    return this.buildTreeRecursive(firstLevelTags, listById);
  },
  concatByOsmID(array1: any[], array2: any[]): any[] {
    if (
      _.has(array1[0], 'numTag') &&
      _.has(array2[0], 'numTag') &&
      _.has(array1[0], 'osmId') &&
      _.has(array2[0], 'osmId')
    ) {
      array2.forEach((el) => {
        const currIdx = array1.findIndex((e) => e.osmId === el.osmId);
        array1[currIdx].numTag = (
          Number(el.numTag) + Number(array1[currIdx].numTag)
        ).toString();
      });
    }
    return array1;
  },
  buildTreeRecursive(
    currentLevel: ISelectTagsResult[],
    listById: { [key: string]: ISelectTagsResult }
  ): TagTree[] {
    return currentLevel.map((t) => {
      return {
        ...t,
        children: this.buildTreeRecursive(
          (t.childrenIds || []).map((id) => listById[id]),
          listById
        ),
      };
    });
  },
};
