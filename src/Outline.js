const EventEmitter = require('events')
const uuid = require('uuid/v4')
const {compareMap} = require('./helper')
const px = require('./fractionalPosition')

class Outline extends EventEmitter {
  constructor(authorId) {
    super()

    this.authorId = authorId || uuid()
    this.timestamp = 0

    this._items = {}
    this._childrenMap = {[null]: []}
    this._parentMap = {}
  }

  getItemId() {
    return JSON.stringify([this.timestamp++, this.authorId])
  }

  getNextItemId(id) {
    let children = this.getChildren(id)
    if (children.length > 0) return children[0].id

    let inner = id => {
      let parent = this.getParent(id)
      let siblings = this.getChildren(parent.id)

      let index = siblings.findIndex(item => item.id === id)
      if (index + 1 < siblings.length) return siblings[index + 1].id

      return inner(parent.id)
    }

    return inner(id)
  }

  getItem(id) {
    return this._items[id]
  }

  getParent(id) {
    return this.getItem(this._parentMap[id])
  }

  getChildren(id) {
    return this._childrenMap[id].map(childId => this.getItem(childId))
  }

  applyChanges(changes) {
    return this
  }
}

module.exports = Outline
