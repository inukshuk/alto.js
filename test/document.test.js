import assert from 'node:assert/strict'
import { afterEach, before, describe, it } from 'node:test'
import { Document } from 'alto.js'

describe('Document', () => {
  let inch
  let pixel

  before(() => {
    inch = Document.parse(F('loc.xml'))
    pixel = Document.parse(F('transkribus.xml'))
  })

  it('has a measurement unit', () => {
    assert.equal(inch.unit, 'inch1200')
    assert.equal(pixel.unit, 'pixel')
  })

  describe('scale', () => {
    let init = { x: 1, y: 1 }

    afterEach(() => {
      pixel.setScale()
      inch.setScale()
    })

    it('has default scale without image dimensions', () => {
      pixel.setScale()
      assert.deepEqual(pixel.scale, init)
      inch.setScale()
      assert.deepEqual(pixel.scale, init)
    })

    it('has default scale when using pixels', () => {
      pixel.setScale(512, 512)
      assert.deepEqual(pixel.scale, init)
    })

    it('has variable scale when using inch1200', () => {
      let { page } = inch

      let W = page.getAttribute('WIDTH')
      let H = page.getAttribute('HEIGHT')
      let w = 256
      let h = 512
      
      inch.setScale(w, h)
      assert.deepEqual(inch.scale, {
        x: w / W,
        y: h / H
      })
    })
  })
})
