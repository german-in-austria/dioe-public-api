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
      tag.erhArt,
      aus,
      tag.beruf_id,
      tag.weiblich,
      tag.gender_sel,
      -1
    );
  },
  async getPresetOrtTags(tagId: number[]): Promise<IGetPresetOrtTagResult[]> {
    return tagDao.getPresetOrtTag(tagId);
  },
  async getTagOrte(tag: tag[]): Promise<ISelectOrtTagsResult[]> {
    let res: ISelectOrtTagsResult[] = [];
    for (const el of tag) {
      let result;
      if (
        el.text.overall.length > 0 ||
        el.ortho.overall.length > 0 ||
        el.lemma.overall.length > 0
      ) {
        if (el.ids[0] == -1) {
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
            el.ids.length
          )) as any as ISelectOrtTagsResult[];
        } else {
          result = await tagDao.getOrtTag(
            el.ids,
            el.erhArt,
            el.ausbildung,
            el.beruf_id,
            el.weiblich,
            el.gender_sel,
            el.project_id
          );
        }
      }
      result.forEach((e: ISelectOrtTagsResult, idx: number, array) => {
        array[idx].para = el.para;
        if (e.tagName && e.tagName.startsWith('{'))
          array[idx].tagName = e.tagName.substring(1, e.tagName.length - 1);
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
