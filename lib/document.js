import { parse, serialize } from './dom.js'

export class Document {
  scale = { x: 1, y: 1 }

  static parse(string) {
    return new Document(parse(string))
  }

  constructor(node) {
    this.document = node
  }

  get(...args) {
    return this.document.querySelector(...args)
  }

  query(...args) {
    return this.document.querySelectorAll(...args)
  }

  get unit() {
    return this.get(
      'alto > Description > MeasurementUnit'
    ).textContent
  }

  get page() {
    return this.get('alto > Layout > Page')
  }

  setScale(width, height) {
    switch (this.unit) {
      case 'pixel':
        this.scale.x = 1
        this.scale.y = 1
        break
      case 'inch1200':
      case 'mm10': {
        let { page } = this
        let WIDTH = parseFloat(page.getAttribute('WIDTH'))
        var HEIGHT= parseFloat(page.getAttribute('HEIGHT'))
        this.scale.x = (width ?? WIDTH) / WIDTH
        this.scale.y = (height ?? HEIGHT) / HEIGHT
        break
      }
      default:
        throw new Error('invalid measurement unit')
    }
  }

  select() {
  }

  text() {
  }

  toString() {
    return serialize(this.document)
  }
}
