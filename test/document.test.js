import assert from 'node:assert/strict'
import { afterEach, before, describe, it } from 'node:test'
import { Document, TextBlock } from 'alto-xml'

describe('Document', () => {
  let loc, tr

  before(() => {
    loc = Document.parse(F('loc.xml'))
    tr = Document.parse(F('transkribus.xml'))
  })

  it('has a measurement unit', () => {
    assert.equal(loc.unit, 'inch1200')
    assert.equal(tr.unit, 'pixel')
  })

  describe('scale', () => {
    let init = { x: 1, y: 1 }

    afterEach(() => {
      loc.setScale()
      tr.setScale()
    })

    it('has default scale without image dimensions', () => {
      tr.setScale()
      assert.deepEqual(tr.scale, init)
      loc.setScale()
      assert.deepEqual(loc.scale, init)
    })

    it('has variable scale when using ', () => {
      let page = loc.get('Page')

      let W = page.getAttribute('WIDTH')
      let H = page.getAttribute('HEIGHT')
      let w = 256
      let h = 512

      loc.setScale(w, h)
      assert.deepEqual(loc.scale, {
        x: w / W,
        y: h / H
      })

      page = tr.get('Page')
      W = page.getAttribute('WIDTH')
      H = page.getAttribute('HEIGHT')

      tr.setScale(w, h)
      assert.deepEqual(tr.scale, {
        x: w / W,
        y: h / H
      })
    })
  })

  describe('toPlainText', () => {
    it('converts the document to plain text', () => {
      assert.match(loc.toPlainText(), /THE WINCHESTER NEWS/)
    })

    it('supports selections', () => {
      assert.equal(
        loc.toPlainText(loc.select({ x: 6750, y: 1840, width: 8000, height: 700 })),
        'WINCHESTER NEWS')
    })
  })

  describe('toString', () => {
    it('returns serialized xml string', () => {
      assert.match(tr.toString(), /^<alto/)
    })
  })

  describe('blocks/iterator', () => {
    it('returns text blocks linked to the document', () => {
      let [block] = Array.from(tr.blocks())

      assert(block instanceof TextBlock, 'not a TextBlock')
      assert.equal(tr, block.document)
    })
  })
})
