import { parse, serialize } from './dom.js'
import { intersects } from './util.js'

export class AltoElement {
  static parse(string) {
    return new this(parse(string))
  }

  constructor(node, parentElement) {
    this.node = node
    this.parent = parentElement 
  }

  get root() {
    if (this.parent == null)
      return this
    else
      return this.parent.root
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
  get scale () {
    return this.root?.scale
  }

  get WIDTH() {
    return parseFloat(this.attr('WIDTH'))
  }

  get HEIGHT() {
    return parseFloat(this.attr('HEIGHT'))
  }

  get HPOS() {
    return parseFloat(this.attr('HPOS'))
  }

  get VPOS() {
    return parseFloat(this.attr('VPOS'))
  }

  bounds(scale = this.scale) {
    let { HPOS, VPOS, WIDTH, HEIGHT } = this

    if (Number.isNaN(HPOS + VPOS + WIDTH + HEIGHT))
      return null

    let x = scale?.x ?? 1
    let y = scale?.y ?? 1
    
    return {
      x: HPOS * x,
      y: VPOS * y,
      width: WIDTH * x,
      height: HEIGHT * y
    }
  }

  intersects(rect, ...args) {
    return !rect || intersects(rect, this.bounds(...args))
  }
}

export class Page extends LayoutElement {
}

export class TextBlock extends LayoutElement {
  *lines() {
    for (let node of this.query(':scope > TextLine'))
      yield new TextLine(node, this)
  }

  [Symbol.iterator]() {
    return this.lines()
  }
}

export class TextLine extends LayoutElement {
  *strings() {
    for (let node of this.query(':scope > String'))
      yield new String(node, this)
  }

  [Symbol.iterator]() {
    return this.strings()
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
