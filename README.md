ALTO.js
==============================================================================
![Build Status](https://github.com/inukshuk/alto.js/actions/workflows/ci.yml/badge.svg?branch=main)
[![NPM version](https://img.shields.io/npm/v/alto-xml.svg)](https://www.npmjs.com/package/alto-xml)

JavaScript API to access ALTO XML documents in Node.js or in the browser.

Installation
------------------------------------------------------------------------------
```console
    $ npm install alto-xml
Usage
------------------------------------------------------------------------------
In Node.js, please specify which XML parser to use.
For example:
```node
import { configure, Document } from 'alto-xml'
import { JSDOM } from 'jsdom'

let { DOMParser, XMLSerializer } = new JSDOM().window
configure(DOMParser, XMLSerializer)

let doc = Document.parse(ALTO_DATA)
```

License
------------------------------------------------------------------------------
ALTO.js is licensed under the terms of the AGPL-3.0 license.
