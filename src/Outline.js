const EventEmitter = require('events')

class Outline extends EventEmitter {
  constructor() {
    super()

    this.items = []
    this.childrenMap = {}
    this.parentMap = {}
  }

  applyChanges(changes) {
    return this
  }
}

module.exports = Outline
