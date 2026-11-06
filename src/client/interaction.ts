/** Indexed NET selection and file-authored Relay state switching. */
const SVG_NS = 'http://www.w3.org/2000/svg'
const RELAY_SELECTOR = '[data-type="Relay"], [data-role="relay"]'

/**
 * Resolve authored Relay state children, refusing ambiguous exporter suffixes.
 * @param relay - one relay group; nested relays retain their own state.
 * @returns exactly one ON/OFF pair, or undefined when incomplete or ambiguous.
 */
export function relayPair(relay: Element): readonly [HTMLElement | SVGElement, HTMLElement | SVGElement] | undefined {
  const nodes = Array.from(relay.querySelectorAll<HTMLElement | SVGElement>('[id]'))
    .filter(node => node.closest(RELAY_SELECTOR) === relay)
  const leaf = relay.id.split('-').at(-1)
  for (const prefix of [relay.id, `${relay.id}-${leaf}`]) {
    const on = nodes.filter(node => node.id === `${prefix}_ON`)
    const off = nodes.filter(node => node.id === `${prefix}_OFF`)
    if (on.length === 1 && off.length === 1 && on[0] && off[0]) return [on[0], off[0]]
  }
  const stem = relay.id.replace(/-\d+$/u, '')
  const state = (name: string) => nodes.filter((node) => {
    const match = node.id.match(/^(.*)_(ON|OFF)(?:-\d+)?$/u)
    return match?.[2] === name && (match[1] === relay.id || match[1] === stem)
  })
  const on = state('ON')
  const off = state('OFF')
  return on.length === 1 && off.length === 1 && on[0] && off[0] ? [on[0], off[0]] : undefined
}

export interface MapInteractions {
  readonly nets: number
  readonly relays: number
  readonly unavailable: number
  readonly dispose: () => void
}

/**
 * Bind interaction to one isolated SVG document; all mutations are transient.
 * @param svg - sanitized SVG root in its own iframe document.
 * @returns indexed counts and a disposer for listeners and generated hit targets.
 */
export function bindMap(svg: SVGSVGElement): MapInteractions {
  const nets = new Map<string, Element[]>()
  const generated: Element[] = []
  for (const net of svg.querySelectorAll<SVGElement>('[data-type="NET"], [data-role="wire"][data-net]')) {
    const key = net.getAttribute('data-net') ?? net.id
    if (!key) continue
    const members = nets.get(key) ?? []
    members.push(net)
    nets.set(key, members)
    net.setAttribute('data-resmap-net', key)
    for (const painted of [net, ...net.querySelectorAll<SVGElement>('*')]) {
      const style = svg.ownerDocument.defaultView?.getComputedStyle(painted)
      if (style?.stroke && style.stroke !== 'none') painted.setAttribute('data-resmap-paint-stroke', '')
      if (style?.fill && style.fill !== 'none') painted.setAttribute('data-resmap-paint-fill', '')
    }
    const hit = net.cloneNode(true) as SVGElement
    for (const node of [hit, ...hit.querySelectorAll('*')]) {
      for (const attribute of Array.from(node.attributes)) {
        if (attribute.name === 'id' || attribute.name === 'class' || attribute.name.startsWith('data-')) node.removeAttribute(attribute.name)
      }
      node.setAttribute('data-resmap-hit', key)
    }
    net.before(hit)
    generated.push(hit)
  }
  const relays = Array.from(svg.querySelectorAll<SVGGraphicsElement>(RELAY_SELECTOR))
  const pairs = new Map<Element, readonly [HTMLElement | SVGElement, HTMLElement | SVGElement]>()
  for (const relay of relays) {
    const pair = relayPair(relay)
    if (!pair) continue
    pairs.set(relay, pair)
    relay.setAttribute('data-resmap-relay', '')
    relay.setAttribute('role', 'button')
    relay.setAttribute('tabindex', '0')
    relay.setAttribute('aria-label', relay.getAttribute('data-designator') ?? relay.id)
    relay.setAttribute('aria-pressed', String(svg.ownerDocument.defaultView?.getComputedStyle(pair[0]).display !== 'none'))
    // Geometry is measured in the relay's own SVG coordinates, after frame load.
    if (typeof relay.getBBox === 'function') {
      const box = relay.getBBox()
      const hit = svg.ownerDocument.createElementNS(SVG_NS, 'rect')
      for (const name of ['x', 'y', 'width', 'height'] as const) hit.setAttribute(name, String(box[name]))
      hit.setAttribute('data-resmap-relay-hit', '')
      relay.append(hit)
      generated.push(hit)
    }
  }
  const selected = new Set<string>()
  let hovered: string | undefined
  const mark = (id: string | undefined, attr: string, enabled: boolean) => {
    if (id) for (const net of nets.get(id) ?? []) net.toggleAttribute(attr, enabled)
  }
  const targetElement = (event: Event): Element | undefined => {
    const target = event.target
    return target && 'nodeType' in target && target.nodeType === 1 ? target as Element : undefined
  }
  const netId = (target: Element | undefined): string | undefined => {
    const node = target?.closest('[data-resmap-hit], [data-resmap-net]')
    return node?.getAttribute('data-resmap-hit') ?? node?.getAttribute('data-resmap-net') ?? undefined
  }
  const eventNet = (event: MouseEvent): string | undefined => {
    const direct = netId(targetElement(event))
    if (direct) return direct
    // Labels and symbols may paint above a wire; retain the wider underlying hit target.
    for (const node of svg.ownerDocument.elementsFromPoint(event.clientX, event.clientY)) {
      const id = netId(node)
      if (id) return id
    }
    return undefined
  }
  const hover = (event: MouseEvent) => {
    const next = eventNet(event)
    if (next === hovered) return
    mark(hovered, 'data-resmap-hover', false)
    hovered = next
    mark(hovered, 'data-resmap-hover', true)
  }
  const leave = () => { mark(hovered, 'data-resmap-hover', false); hovered = undefined }
  const toggle = (relay: Element) => {
    const pair = pairs.get(relay)
    if (!pair) return
    const onVisible = svg.ownerDocument.defaultView?.getComputedStyle(pair[0]).display !== 'none'
    pair[0].style.display = onVisible ? 'none' : 'inline'
    pair[1].style.display = onVisible ? 'inline' : 'none'
    relay.setAttribute('aria-pressed', String(!onVisible))
  }
  const click = (event: MouseEvent) => {
    const target = targetElement(event)
    const relay = target?.closest(RELAY_SELECTOR)
    if (relay) { toggle(relay); return }
    const id = eventNet(event)
    if (!id) return
    if (selected.has(id)) { selected.delete(id); mark(id, 'data-resmap-selected', false); return }
    if (!event.ctrlKey && !event.metaKey) {
      for (const prior of selected) mark(prior, 'data-resmap-selected', false)
      selected.clear()
    }
    selected.add(id)
    mark(id, 'data-resmap-selected', true)
  }
  const keydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const relay = targetElement(event)?.closest(RELAY_SELECTOR)
    if (relay && pairs.has(relay)) { event.preventDefault(); toggle(relay) }
  }
  svg.addEventListener('mouseover', hover)
  svg.addEventListener('mouseleave', leave)
  svg.addEventListener('click', click)
  svg.addEventListener('keydown', keydown)
  return {
    nets: nets.size, relays: relays.length, unavailable: relays.length - pairs.size,
    dispose: () => {
      svg.removeEventListener('mouseover', hover)
      svg.removeEventListener('mouseleave', leave)
      svg.removeEventListener('click', click)
      svg.removeEventListener('keydown', keydown)
      for (const node of generated) node.remove()
    },
  }
}

/** @returns a finite scale within the Resource Map viewer's 25–1200% range. */
export function clampScale(scale: number): number {
  return Number.isFinite(scale) ? Math.min(12, Math.max(0.25, scale)) : 0.25
}
