import { parse, serialize } from './dom.js'

export class AltoElement {
  static parse(string) {
    return new this(parse(string))
  }

  constructor(node) {
    this.node = node
  }

  get(...args) {
    return this.node.querySelector(...args)
  }

  query(...args) {
    return this.node.querySelectorAll(...args)
  }

  attr(name) {
    return this.node.getAttribute(name)
  }

  toString() {
    return serialize(this.node)
  }
}

export class LayoutElement extends AltoElement {
  get WIDTH() {
    return parseFloat(this.attr('WIDTH'))
  }

  get HEIGHT() {
    return parseFloat(this.attr('HEIGHT'))
  }

  get HPOS() {
    return parseFloat(this.attr('HPOS')) || 0
  }

  get VPOS() {
    return parseFloat(this.attr('VPOS')) || 0
  }

  bounds(scale) {
    let x = scale?.x ?? 1
    let y = scale?.y ?? 1
    
    return {
      x: this.VPOS * scale.x,
      y: this.HPOS * scale.y,
      width: this.WIDTH * scale.x,
      height: this.HEIGHT * scale.y
    }
  }
}

export class Page extends LayoutElement {
}

export class TextBlock extends LayoutElement {
  *lines() {
    for (let node of this.query(':scope > TextLine'))
      yield new TextLine(node)
  }
}

export class TextLine extends LayoutElement {
  *strings() {
    for (let node of this.query(':scope > String'))
      yield new String(node)
  }
}

export class String extends LayoutElement {
  get CONTENT() {
    return this.attr('CONTENT')
  }

  toPlainText() {
    return this.CONTENT
  }
}
