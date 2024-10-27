import { parse, serialize } from './dom.js'
import { intersects } from './util.js'

const WM = new WeakMap()

export class AltoElement {
  static parse(string) {
    return new this(parse(string))
  }

  static for(node) {
    return WM.get(node) || new this(node)
  }

  constructor(node) {
    if (WM.has(node))
      throw new Error('element for node already exists')

    WM.set(node, this)
    this.node = node
  }

  get parent() {
    return WM.get(this.node.parentElement)
  }

  get document() {
    return WM.get(this.node.ownerDocument)
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
    return this.document?.scale
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
    if (!rect) return false
    if (rect === true) return true

    return rect && intersects(rect, this.bounds(...args))
  }
}

export class Page extends LayoutElement {
}

export class TextBlock extends LayoutElement {
  *lines() {
    for (let node of this.query(':scope > TextLine'))
      yield TextLine.for(node)
  }

  [Symbol.iterator]() {
    return this.lines()
  }
}

export class TextLine extends LayoutElement {
  *strings() {
    for (let node of this.query(':scope > String'))
      yield String.for(node)
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
