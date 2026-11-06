// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { bindMap, clampScale, relayPair } from '../src/client/interaction.ts'
import { prepareMap } from '../src/client/svg.ts'

afterEach(() => { document.body.replaceChildren() })
// jsdom has no layout hit-testing API; individual overlap cases supply the stack.
beforeEach(() => { document.elementsFromPoint = () => [] })

function drawing(body: string): SVGSVGElement {
  const host = document.createElement('div')
  host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">${body}</svg>`
  document.body.append(host)
  return host.querySelector('svg')!
}

function bytes(source: string): Uint8Array<ArrayBuffer> { return new TextEncoder().encode(source) }

describe('complete Resource Map documents', () => {
  it('uses viewBox dimensions and puts the network-blocking policy before authored content', () => {
    const result = prepareMap(bytes('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297"><g data-type="NET" id="N1"/></svg>'))
    expect(result.width).toBe(420)
    expect(result.height).toBe(297)
    expect(result.html.indexOf('Content-Security-Policy')).toBeLessThan(result.html.indexOf('<svg'))
    expect(result.html).toContain("script-src 'none'")
    expect(result.html).toContain('data-type="NET"')
  })

  it('accepts a static SVG without viewBox and converts physical units', () => {
    const result = prepareMap(bytes('<svg xmlns="http://www.w3.org/2000/svg" width="25.4mm" height="1in"><text>Static map</text></svg>'))
    expect(result.width).toBeCloseTo(96)
    expect(result.height).toBe(96)
    expect(result.html).toContain('Static map')
  })

  it.each([
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><g></svg>',
    '<html>not SVG</html>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"/>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="100"/>',
  ])('rejects malformed or unsized files: %s', (source) => {
    expect(() => prepareMap(bytes(source))).toThrow()
  })

  it('rejects invalid UTF-8', () => { expect(() => prepareMap(new Uint8Array([0xff]))).toThrow() })

  it('removes scripts, event handlers, foreign objects, navigation and animation', () => {
    const result = prepareMap(bytes('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" onload="alert(1)"><script>alert(1)</script><foreignObject><div>unsafe</div></foreignObject><image href="https://example.test/secret"/><animate attributeName="href"/><g id="K1" data-type="Relay"><g id="K1_ON"/><g id="K1_OFF"/></g></svg>'))
    const doc = new DOMParser().parseFromString(result.html, 'text/html')
    expect(doc.querySelector('script, foreignObject, animate, [onload], [href]')).toBeNull()
    expect(doc.querySelector('[data-type="Relay"]')?.id).toBe('K1')
  })
})

describe('Relay state ownership', () => {
  it.each([
    ['K1', 'K1_ON', 'K1_OFF'],
    ['RELAY-K52', 'RELAY-K52_ON', 'RELAY-K52_OFF'],
    ['RELAY-K52', 'RELAY-K52-K52_ON', 'RELAY-K52-K52_OFF'],
    ['RELAY-K19-8', 'RELAY-K19_ON-9', 'RELAY-K19_OFF-4'],
  ])('resolves %s without rewriting authored IDs', (id, on, off) => {
    const svg = drawing(`<g data-type="Relay" id="${id}"><g id="${on}"/><g id="${off}"/></g>`)
    expect(relayPair(svg.querySelector('g')!)?.map(node => node.id)).toEqual([on, off])
  })

  it('refuses ambiguous and incomplete state pairs', () => {
    const svg = drawing('<g data-type="Relay" id="K1"><g id="K1_ON-1"/><g id="K1_ON-2"/><g id="K1_OFF-1"/></g><g data-type="Relay" id="K2"><g id="K2_ON"/></g>')
    for (const relay of svg.querySelectorAll('[data-type="Relay"]')) expect(relayPair(relay)).toBeUndefined()
  })

  it('switches authored states through mouse and keyboard, without changing source colors', () => {
    const svg = drawing('<g data-type="Relay" id="K1"><g id="K1_ON" style="display:none;fill:red"/><g id="K1_OFF" style="fill:blue"/></g>')
    const interaction = bindMap(svg)
    const relay = svg.querySelector<SVGElement>('#K1')!
    relay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(svg.querySelector<SVGElement>('#K1_ON')!.style.display).toBe('inline')
    expect(svg.querySelector<SVGElement>('#K1_OFF')!.style.display).toBe('none')
    expect(svg.querySelector<SVGElement>('#K1_ON')!.style.fill).toBe('red')
    relay.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }))
    expect(svg.querySelector<SVGElement>('#K1_ON')!.style.display).toBe('none')
    interaction.dispose()
  })
})

describe('network interaction and disposal', () => {
  it('highlights, selects, extends and clears selections using geometry hit targets', () => {
    const svg = drawing('<path data-type="NET" id="N1" d="M0 0L30 30" stroke="red"/><path data-type="NET" id="N2" d="M40 40L60 60" stroke="red"/>')
    const interaction = bindMap(svg)
    const first = svg.querySelector('[data-resmap-hit="N1"]')!
    const second = svg.querySelector('[data-resmap-hit="N2"]')!
    first.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(svg.querySelector('#N1')!.hasAttribute('data-resmap-hover')).toBe(true)
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    second.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }))
    expect(svg.querySelectorAll('[data-resmap-selected]')).toHaveLength(2)
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(svg.querySelector('#N1')!.hasAttribute('data-resmap-selected')).toBe(false)
    svg.dispatchEvent(new MouseEvent('mouseleave'))
    expect(svg.querySelector('[data-resmap-hover]')).toBeNull()
    interaction.dispose()
    expect(svg.querySelector('[data-resmap-hit]')).toBeNull()
    svg.querySelector('#N1')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(svg.querySelector('#N1')!.hasAttribute('data-resmap-selected')).toBe(false)
  })

  it('groups data-role wires by data-net and leaves other documents independent', () => {
    const a = drawing('<path data-role="wire" data-net="VIN"/><path data-role="wire" data-net="VIN"/>')
    const b = drawing('<path data-type="NET" id="VIN"/>')
    const left = bindMap(a)
    const right = bindMap(b)
    a.querySelector('[data-resmap-net]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(left.nets).toBe(1)
    expect(a.querySelectorAll('[data-resmap-selected]')).toHaveLength(2)
    expect(b.querySelector('[data-resmap-selected]')).toBeNull()
    left.dispose(); right.dispose()
  })

  it('selects the wider underlying wire when a symbol paints above it', () => {
    const svg = drawing('<path data-type="NET" id="N1"/><text id="label">Ground</text>')
    const interaction = bindMap(svg)
    const label = svg.querySelector('#label')!
    document.elementsFromPoint = () => [label, svg.querySelector('[data-resmap-hit]')!]
    label.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(svg.querySelector('#N1')!.hasAttribute('data-resmap-selected')).toBe(true)
    interaction.dispose()
  })

  it('reports static drawings and unavailable Relay states honestly', () => {
    const svg = drawing('<g data-role="relay" id="K1"/><text>Static text</text>')
    const interaction = bindMap(svg)
    expect(interaction).toMatchObject({ nets: 0, relays: 1, unavailable: 1 })
    expect(svg.querySelector('[role="button"]')).toBeNull()
    interaction.dispose()
  })

  it('bounds invalid and extreme zoom requests', () => {
    expect(clampScale(NaN)).toBe(0.25)
    expect(clampScale(0.01)).toBe(0.25)
    expect(clampScale(20)).toBe(12)
    expect(clampScale(1)).toBe(1)
  })
})
