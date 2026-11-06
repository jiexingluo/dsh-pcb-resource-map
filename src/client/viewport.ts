/** Frame-local zoom, pointer anchoring, and resize lifecycle. */
import { bindMap, clampScale } from './interaction.ts'
import type { MapInteractions } from './interaction.ts'
import type { PreparedMap } from './svg.ts'

export interface MapViewport extends MapInteractions {
  readonly zoom: (factor: number) => void
  readonly actual: () => void
  readonly fit: () => void
}

/**
 * Own an already-loaded isolated preview frame until content replacement.
 * @param frame - mounted, same-origin frame with scripts disabled by sandbox and CSP.
 * @param prepared - validated drawing dimensions.
 * @param changed - local rendering callback for the displayed zoom.
 * @returns zoom operations, interaction counts, and complete lifecycle cleanup.
 */
export function mountViewport(frame: HTMLIFrameElement, prepared: PreparedMap, changed: (scale: number) => void): MapViewport {
  const doc = frame.contentDocument
  const svg = doc?.querySelector('svg')
  if (!doc || !svg) throw new Error('frame-unavailable')
  const interaction = bindMap(svg)
  let scale = 1
  let fitting = true
  const resize = (next: number, x = frame.clientWidth / 2, y = frame.clientHeight / 2) => {
    const viewport = doc.scrollingElement
    const prior = scale
    scale = clampScale(next)
    const left = viewport?.scrollLeft ?? 0
    const top = viewport?.scrollTop ?? 0
    svg.style.width = `${prepared.width * scale}px`
    svg.style.height = `${prepared.height * scale}px`
    if (viewport) {
      viewport.scrollLeft = (left + x - 16) * scale / prior - x + 16
      viewport.scrollTop = (top + y - 16) * scale / prior - y + 16
    }
    changed(scale)
  }
  const fit = () => {
    fitting = true
    resize(Math.min((frame.clientWidth - 32) / prepared.width, (frame.clientHeight - 32) / prepared.height))
    doc.defaultView?.scrollTo(0, 0)
  }
  const wheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    fitting = false
    resize(scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15), event.clientX, event.clientY)
  }
  doc.addEventListener('wheel', wheel, { passive: false })
  // SVG zoom needs pixel dimensions of the containing frame; CSS cannot compute its scale.
  const observer = new ResizeObserver(() => { if (fitting) fit() })
  observer.observe(frame)
  fit()
  return {
    ...interaction,
    zoom: (factor) => { fitting = false; resize(scale * factor) },
    actual: () => { fitting = false; resize(1) },
    fit,
    dispose: () => { observer.disconnect(); doc.removeEventListener('wheel', wheel); interaction.dispose() },
  }
}
