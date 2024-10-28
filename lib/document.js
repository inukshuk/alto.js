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
    let selection = []

    for (let block of this.blocks(order)) {
      if (block.intersects(rect)) {
        let ls = []

        for (let line of block.lines()) {
          if (line.intersects(rect)) {
            let ws = []

            for (let string of line.strings()) {
              if (string.intersects(rect))
                ws.push(string.CONTENT)
            }
            ls.push(ws)
          }
        }
        selection.push(ls)
      }
    }

    return selection
  }

  toPlainText(rect = true, order = this.order) {
    return this.select(rect, order)
      .map(
        p => p.map(ln => ln.join(' ')).join('\n')
      )
      .join('\n')
  }
}
