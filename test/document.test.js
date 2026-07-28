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

    it('has variable scale when using image dimensions', () => {
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

  describe('range', () => {
    let doc, strings
    let content = (m) => [...m].filter(([, on]) => on).map(([s]) => s.CONTENT)

    before(() => {
      doc = Document.parse(F('margins.xml'))
      strings = [...doc.strings()]
    })

    it('selects the strings between head and tail inclusively', () => {
      assert.deepEqual(
        content(doc.range(strings[1], strings[3])),
        ['body', 'text', 'left'])
    })

    it('selects the same range when head and tail are reversed', () => {
      assert.deepEqual(
        content(doc.range(strings[3], strings[1])),
        content(doc.range(strings[1], strings[3])))
    })

    it('selects a single string when tail is omitted or equal to head', () => {
      assert.deepEqual(content(doc.range(strings[2])), ['text'])
      assert.deepEqual(content(doc.range(strings[2], strings[2])), ['text'])
    })

    it('sets only selected strings, all of them to true', () => {
      let selection = doc.range(strings[1], strings[3])
      assert.equal(selection.size, 3)
      assert.equal(selection.get(strings[0]), undefined)
      assert([...selection.values()].every(on => on === true))
    })

    it('selects nothing when no anchor is given', () => {
      assert.deepEqual(content(doc.range()), [])
    })

    it('selects nothing when the anchor is not part of the document', () => {
      let foreign = [...Document.parse(F('hyphenated.xml')).strings()][0]
      assert.deepEqual(content(doc.range(foreign)), [])
      assert.deepEqual(content(doc.range(foreign, foreign)), [])
    })

    it('follows the given reading order, not document order', () => {
      assert.deepEqual(
        content(doc.range(strings[0], strings.at(-1))),
        ['header', 'body', 'text', 'left', 'right', 'footer'])

      assert.deepEqual(
        content(doc.range(strings[0], strings.at(-1), ['BottomMargin', 'TopMargin'])),
        ['footer', 'header'])
    })

    it('selects up to the end when only one anchor is reachable', () => {
      let unreachable = [...doc.strings(['BottomMargin'])][0]

      assert.deepEqual(
        content(doc.range(strings[1], unreachable, ['PrintSpace'])),
        ['body', 'text'])

      assert.deepEqual(content(doc.range(null, strings[3])), ['left', 'right', 'footer'])
    })
  })

  describe('select', () => {
    let selected = (doc, ...args) =>
      [...doc.select(...args)].filter(([, on]) => on).map(([s]) => s.CONTENT)

    it('selects nothing without a rectangle', () => {
      assert.deepEqual(selected(tr), [])
    })

    it('selects everything when true', () => {
      let doc = Document.parse(F('hyphenated.xml'))
      assert.deepEqual(
        selected(doc, true),
        ['An', 'exam', 'ple', 'line', 'unpositioned'])
    })

    it('excludes strings without bounds when given a rectangle', () => {
      let doc = Document.parse(F('hyphenated.xml'))
      assert.deepEqual(
        selected(doc, { x: 0, y: 0, width: 200, height: 100 }),
        ['An', 'exam', 'ple', 'line'])
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
