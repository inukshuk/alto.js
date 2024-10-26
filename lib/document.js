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
    return new Page(this.get('alto > Layout > Page'))
  }

  *blocks(order = this.order) {
    for (let section of order)
      for (let node of this.query(`${section} > TextBlock`))
        yield new TextBlock(node, this)
  }

  setScale(width, height) {
    let { WIDTH, HEIGHT } = this.page
    this.scale.x = ((width ?? WIDTH) / WIDTH) || 1
    this.scale.y = ((height ?? HEIGHT) / HEIGHT) || 1
  }

  select(rect, order = this.order) {
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

  toPlainText(rect, order = this.order) {
    return this.select(rect, order)
      .map(
        p => p.map(ln => ln.join(' ')).join('\n')
      )
      .join('\n')
  }
}
