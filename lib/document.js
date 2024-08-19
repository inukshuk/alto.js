import { AltoElement, Page, TextBlock } from './element.js'
import { intersects } from './util.js'


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
        yield new TextBlock(node)
  }

  setScale(width, height) {
    let { WIDTH, HEIGHT } = this.page
    this.scale.x = ((width ?? WIDTH) / WIDTH) || 1
    this.scale.y = ((height ?? HEIGHT) / HEIGHT) || 1
  }

  select(rect, order = this.order) {
    let selection = []

    for (let block of this.blocks(order)) {
      if (!rect || intersects(rect, block.bounds(this.scale))) {
        let ls = []

        for (let line of block.lines()) {
          if (!rect || intersects(rect, line.bounds(this.scale))) {
            let ws = []

            for (let string of line.strings()) {
              if (!rect || intersects(rect, string.bounds(this.scale)))
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
