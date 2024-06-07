import { parse, serialize } from './dom.js'

export class Document {
  scale = 1


  static parse(string) {
    return new Document(parse(string))
  }

  constructor(node) {
    this.document = node
    this.computeScalingFactor()
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

  get dimensions() {
    let { page } = this
    return [
      parseFloat(page.getAttribute('WIDTH')),
      parseFloat(page.getAttribute('HEIGHT'))
    ]
  }

  get resolution() {
    let [width, height] = this.dimensions
    return width * height
  }

  computeScalingFactor() {
    switch (this.unit) {
      case 'pixel':
        this.scale = 1
        break
      case 'inch1200':
        this.scale = this.resolution / 1200
        break
      case 'mm10':
        this.scale = this.resolution / 254
        break
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
