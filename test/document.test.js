import assert from 'node:assert'
import { before, describe, it } from 'node:test'
import { Document } from 'alto.js'

describe('Document', () => {
  let alto

  before(() => {
    alto = Document.parse(F('doc.xml'))
  })

  it('has a measurement unit', () => {
    assert.equal(alto.unit, 'pixel')
  })

  it('has a numerical resolution', () => {
    let { resolution } = alto
    assert(typeof resolution === 'number', 'not a number')
    assert(!Number.isNaN(resolution), 'NaN')
  })
})
