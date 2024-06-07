let Parser
let Serializer

export function parse(string) {
  if (!Parser) throw new Error('DOMParser missing')
  let doc = (new Parser).parseFromString(string, 'text/xml')

  if (doc.documentElement.nodeName === 'parsererror')
    throw new Error(`Parser error: ${doc.documentElement.textContent}`)

  return doc
}

export function serialize(node) {
  if (!Serializer) throw new Error('XMLSerializer missing')
  return (new Serializer).serializeToString(node)
}

export function configure(P, S) {
  if (P) Parser = P
  if (S) Serializer = S
}

configure(
  typeof DOMParser === 'undefined' ? undefined : DOMParser,
  typeof XMLSerializer === 'undefined' ? undefined : XMLSerializer
)

export {
  Parser as DOMParser,
  Serializer as XMLSerializer
}
