import { parse, serialize, tags } from './dom.js'
import { intersects } from './util.js'

const WM = new WeakMap()

export class AltoElement {
  static parse(string) {
    return new this(parse(string))
  }

  static for(node) {
    return node != null ? (WM.get(node) || new this(node)) : null
  }

  constructor(node) {
    if (node == null)
      throw new Error('backing xml node missing')
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
  #geometry

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

  get geometry() {
    this.#geometry ??= Object.freeze({
      HPOS: this.HPOS,
      VPOS: this.VPOS,
      WIDTH: this.WIDTH,
      HEIGHT: this.HEIGHT
    })

    return this.#geometry
  }

  bounds(scale = this.scale) {
    let { HPOS, VPOS, WIDTH, HEIGHT } = this.geometry

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

    let bounds = this.bounds(...args)
    return bounds != null && intersects(rect, bounds)
  }
}

export class Page extends LayoutElement {
}

export class TextBlock extends LayoutElement {
  *lines() {
    let lines = tags(this.node, 'TextLine')

    for (let i = 0; i < lines.length; i++)
      yield TextLine.for(lines[i])
  }

  [Symbol.iterator]() {
    return this.lines()
  }
}

export class TextLine extends LayoutElement {
  previous() {
    let previous = this.node.previousElementSibling
    return (previous?.localName === 'TextLine') ?
      TextLine.for(previous) : null
  }

  next() {
    let next = this.node.nextElementSibling
    return (next?.localName === 'TextLine') ?
      TextLine.for(next) : null
  }

  first() {
    return String.for(tags(this.node, 'String')[0])
  }

  last() {
    let strings = tags(this.node, 'String')
    return String.for(strings[strings.length - 1])
  }

  *strings() {
    let strings = tags(this.node, 'String')

    for (let i = 0; i < strings.length; i++)
      yield String.for(strings[i])
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
