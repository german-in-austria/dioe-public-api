import {
  ISelectOrtTagsResult,
  ISelectSingleGenResult,
  ISelectTagsResult,
  ISelectTagByIdResult,
  IGetTagsByPresetResult,
  IGetPresetTagsResult,
  IGetPresetOrtTagResult,
} from "../dao/tag.queries";
import tagDao from "../dao/tag";
import _, { String } from "lodash";

import { ausbildungGrad } from "./social";
import { tag } from "./validate";

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
      aus = "";
    }
    return tagDao.getOrtTag(
      res.map((val) => val.tagId),
      tag.erhArt,
      aus,
      tag.beruf_id,
      tag.weiblich
    );
  },
  async getPresetOrtTags(tagId: number[]): Promise<IGetPresetOrtTagResult[]> {
    return tagDao.getPresetOrtTag(tagId);
  },
  async getTagOrte(tag: tag): Promise<ISelectOrtTagsResult[]> {
    return tagDao.getOrtTag(
      tag.ids,
      tag.erhArt,
      tag.ausbildung,
      tag.beruf_id,
      tag.weiblich
    );
  },
  async getTagGen(gen: number): Promise<ISelectSingleGenResult[]> {
    return tagDao.getSingleGen(gen);
  },
  async getTagTree() {
    const list = await this.getTagList();
    const listById = _.keyBy(list, "tagId");
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
