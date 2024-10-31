import assert from 'node:assert/strict'
import { before, describe, it } from 'node:test'
import { Document, String } from 'alto.js'

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
})
