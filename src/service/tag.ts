import tagDao from '../dao/tag'

const tagService = {
  getTagTree() {
    return tagDao.getTagTree()
  }
}

export default tagService
