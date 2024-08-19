import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { configure } from 'alto.js'
import { JSDOM } from 'jsdom'

let { DOMParser, XMLSerializer } = new JSDOM().window
configure(DOMParser, XMLSerializer)


globalThis.F = function F(name) {
  return readFileSync(join(import.meta.dirname, `./fixtures/${name}`), {
    encoding: 'utf-8'
  })
}
