/** Complete SVG validation and an isolated, script-free preview document. */
import DOMPurify from 'dompurify'

export interface PreparedMap {
  readonly html: string
  readonly width: number
  readonly height: number
}

/**
 * Parse a complete UTF-8 SVG and remove active content before embedding it.
 * @param data - complete file bytes borrowed from the document owner.
 * @returns an isolated document and its intrinsic drawing dimensions.
 * @throws when the encoding, XML root, or dimensions are invalid.
 */
export function prepareMap(data: Uint8Array<ArrayBuffer>): PreparedMap {
  const source = new TextDecoder('utf-8', { fatal: true }).decode(data)
  const parsed = new DOMParser().parseFromString(source, 'image/svg+xml')
  if (parsed.querySelector('parsererror') || parsed.documentElement.localName !== 'svg'
    || parsed.documentElement.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('invalid-svg')
  const root = parsed.documentElement
  const viewBox = root.getAttribute('viewBox')?.trim().split(/[\s,]+/u).map(Number)
  const boxWidth = viewBox?.[2] ?? NaN
  const boxHeight = viewBox?.[3] ?? NaN
  const validBox = viewBox?.length === 4 && viewBox.every(Number.isFinite) && boxWidth > 0 && boxHeight > 0
  const width = validBox ? boxWidth : svgLength(root.getAttribute('width'))
  const height = validBox ? boxHeight : svgLength(root.getAttribute('height'))
  if (!(width > 0 && height > 0 && Number.isFinite(width) && Number.isFinite(height))) throw new Error('invalid-size')
  const clean = DOMPurify.sanitize(new XMLSerializer().serializeToString(root), {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['style'],
    FORBID_TAGS: ['script', 'foreignObject', 'foreignobject', 'a', 'animate', 'animateMotion', 'animateTransform', 'set'],
    FORBID_ATTR: ['src'],
  })
  const cleanDoc = new DOMParser().parseFromString(clean, 'image/svg+xml')
  if (cleanDoc.querySelector('parsererror') || cleanDoc.documentElement.localName !== 'svg') throw new Error('invalid-svg')
  for (const node of cleanDoc.querySelectorAll('*')) {
    for (const attr of Array.from(node.attributes)) {
      if ((attr.localName === 'href') && !/^#[^\s]+$/u.test(attr.value)) node.removeAttributeNode(attr)
      // Viewer markers are owned by the plugin, never by the source file.
      if (attr.name.startsWith('data-resmap-')) node.removeAttributeNode(attr)
    }
  }
  const doc = document.implementation.createHTMLDocument('')
  const policy = doc.createElement('meta')
  policy.httpEquiv = 'Content-Security-Policy'
  policy.content = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'"
  doc.head.prepend(policy)
  const style = doc.createElement('style')
  style.textContent = 'html,body{margin:0;width:100%;height:100%;overflow:auto;background:white}body{box-sizing:border-box;padding:16px}svg{display:block;max-width:none} [data-resmap-net]{cursor:pointer} [data-resmap-hover]{--resmap-ink:#2a7fff} [data-resmap-selected]{--resmap-ink:#0000ff} [data-resmap-hover],[data-resmap-selected]{filter:none!important} [data-resmap-hover][data-resmap-paint-stroke],[data-resmap-selected][data-resmap-paint-stroke],[data-resmap-hover] [data-resmap-paint-stroke],[data-resmap-selected] [data-resmap-paint-stroke]{stroke:var(--resmap-ink)!important} [data-resmap-hover][data-resmap-paint-fill],[data-resmap-selected][data-resmap-paint-fill],[data-resmap-hover] [data-resmap-paint-fill],[data-resmap-selected] [data-resmap-paint-fill]{fill:var(--resmap-ink)!important} [data-resmap-hit]{pointer-events:stroke;opacity:0;fill:none!important;stroke:black!important;stroke-width:5px!important;vector-effect:non-scaling-stroke} [data-resmap-relay-hit]{pointer-events:all;fill:transparent;cursor:pointer} [data-resmap-relay]{cursor:pointer}'
  doc.head.append(style)
  const svg = doc.importNode(cleanDoc.documentElement, true)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  // A viewBox also makes physical SVG units resolve consistently during zoom.
  if (!validBox) svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  doc.body.append(svg)
  return { html: `<!doctype html>${doc.documentElement.outerHTML}`, width, height }
}

function svgLength(value: string | null): number {
  const match = value?.trim().match(/^(\d+(?:\.\d+)?)(px|mm|cm|in|pt|pc)?$/u)
  if (!match) return NaN
  const units: Record<string, number> = { px: 1, mm: 96 / 25.4, cm: 96 / 2.54, in: 96, pt: 96 / 72, pc: 16 }
  return Number(match[1]) * (units[match[2] ?? 'px'] ?? NaN)
}
