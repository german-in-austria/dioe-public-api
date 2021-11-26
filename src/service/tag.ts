import {
  ISelectOrtTagsResult,
  ISelectSingleGenResult,
  ISelectTagsResult,
  ISelectTagByIdResult,
} from "../dao/tag.queries";
import tagDao from "../dao/tag";
import _ from "lodash";

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
    // console.log(await tagDao.getTagTree());
    return tagDao.getTagTree();
  },

  async getTagOrte(tagId: number[]): Promise<ISelectOrtTagsResult[]> {
    return tagDao.getOrtTag(tagId);
  },
  async getTagGen(gen: number): Promise<ISelectSingleGenResult[]> {
    return tagDao.getSingleGen(gen);
  },
  async getTagTree() {
    const list = await this.getTagList();
    const listById = _.keyBy(list, "tagId");
    const firstLevelTags = list.filter((t) => t.parentIds === null);
    // console.log(list.filter((el) => el.tagAbbrev === "rot"));
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
