import { AltoElement, Page, TextBlock } from './element.js'


export class Document extends AltoElement {
  scale = { x: 1, y: 1 }

  order = [
    'TopMargin',
    'PrintSpace',
    'LeftMargin',
    'RightMargin',
    'BottomMargin'
  ]

  get unit() {
    return this.get(
      'alto > Description > MeasurementUnit'
    ).textContent
  }

  get page() {
    return Page.for(this.get('alto > Layout > Page'))
  }

  *blocks(order = this.order) {
    for (let section of order)
      for (let node of this.query(`${section} > TextBlock`))
        yield TextBlock.for(node)
  }

  *lines(order = this.order) {
    for (let block of this.blocks(order))
      for (let line of block)
        yield line
  }

  *strings(order = this.order) {
    for (let block of this.blocks(order))
      for (let line of block)
        for (let string of line)
          yield string
  }

  setScale(width, height) {
    let { WIDTH, HEIGHT } = this.page
    this.scale.x = ((width ?? WIDTH) / WIDTH) || 1
    this.scale.y = ((height ?? HEIGHT) / HEIGHT) || 1
  }

  select(rect = false, order = this.order) {
    return this.strings(order).reduce((selection, string) => (
      selection.set(string, string.intersects(rect))
    ), new Map)
  }

  range(head, tail, order = this.order) {
    let selection = new Map
    let isSelected = false
    let isAtomic = (tail == null || head === tail)

    for (let string of this.strings(order)) {
      let flip = (string === head || string === tail)

      if (isSelected) {
        selection.set(string, true)
        if (flip) break

      } else {
        if (flip) {
          selection.set(string, true)

          if (isAtomic) break
          else
            isSelected = true
        }
      }
    }

    return selection
  }

  toPlainText(selection = true, order = this.order) {
    if (selection == null || selection === false)
      return ''

    let text = []

    for (let block of this.blocks(order)) {
      let lines = []
      for (let line of block.lines()) {
        let strings = []
        for (let string of line.strings()) {
          if (selection === true || selection.get(string))
            strings.push(string.CONTENT)
        }
        if (strings.length)
          lines.push(strings)
      }
      if (lines.length)
        text.push(lines)
    }

    return text.map(block =>
      block.map(line => line.join(' ')).join('\n')
    ).join('\n')
  }
}
