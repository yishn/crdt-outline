const EventEmitter = require('events')
const uuid = require('uuid/v4')
const {compareMap} = require('./helper')
const px = require('./fractionalPosition')

class Outline extends EventEmitter {
  constructor(authorId) {
    super()

    this.author = authorId || uuid()
    this.timestamp = 0

    this._items = {}
    this._childrenMap = {[null]: []}
    this._parentMap = {}

    this.compareId = compareMap(id => this.getItem(id).position, px.compare)
  }

  createItemId() {
    return JSON.stringify([this.timestamp++, this.author])
  }

  getNextItem(id) {
    let children = this.getChildren(id)
    if (children.length > 0) return children[0]

    let inner = id => {
      let parent = this.getParent(id)
      let siblings = this.getChildren(parent == null ? null : parent.id)

      let index = siblings.findIndex(item => item.id === id)
      if (index + 1 < siblings.length) return siblings[index + 1]

      return inner(parent.id)
    }

    return inner(id)
  }

  getItem(id) {
    return this._items[id]
  }

  getParent(id) {
    return this._parentMap[id] == null ? null : this.getItem(this._parentMap[id])
  }

  getChildren(id) {
    return this._childrenMap[id].map(childId => this.getItem(childId))
  }

  _insertItem(parentId, item) {
    if (parentId != null && this.getItem(parentId) == null) {
      return false
    }

    this._items[item.id] = item
    this._childrenMap[item.id] = []
    this._parentMap[item.id] = parentId

    this._childrenMap[parentId].push(item.id)
    this._childrenMap[parentId].sort(this.compareId)

    return true
  }

  insertItem(parentId, beforeId, content) {
    if (beforeId == null) {
      beforeId = parentId
    }

    let id = this.createItemId()
    let beforeItem = this.getItem(beforeId)
    let afterItem = this.getNextItem(beforeId)
    let position = px.create(this.author, beforeItem.position, afterItem != null ? afterItem.position : null)
    let item = {id, position, content}
    let result = this._insertItem(parentId, item)

    this.emit('change', {
      change: {
        type: '_insertItem',
        args: [parentId, item]
      }
    })

    return result
  }

  applyChanges(changes) {
    return this
  }
}

module.exports = Outline
