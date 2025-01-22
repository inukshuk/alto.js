import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { Document, String } from 'alto'

describe('TextLine', () => {
  let lines

  before(() => {
    lines = [...Document.parse(F('transkribus.xml')).lines()]
  })

  describe('first', () => {
    it('returns first string on line', () => {
      let strings = lines[1].strings().toArray()
      let first = lines[1].first()
      assert(first instanceof String)
      assert.equal(strings[0], first)
    })
  })

  describe('last', () => {
    it('returns last string on line', () => {
      let strings = lines[1].strings().toArray()
      let last = lines[1].last()
      assert(last instanceof String)
      assert.equal(strings.at(-1), last)
    })
  })

  describe('previous', () => {
    it('returns previous line in the block', () => {
      assert.equal(lines[0], lines[1].previous())
      assert.equal(null, lines[0].previous())
    })
  })

  describe('next', () => {
    it('returns next line in the block', () => {
      assert.equal(lines[1], lines[0].next())
      assert.equal(null, lines.at(-1).next())
    })
  })
})
