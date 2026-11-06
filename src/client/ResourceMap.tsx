/** Resource Map document body; all file reads belong to the document owner. */
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import type { DocumentPreviewProps } from '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { PreparedMap } from './svg.ts'
import { prepareMap } from './svg.ts'
import { mountViewport, type MapViewport } from './viewport.ts'
import type {} from './locales.ts'
import css from './ResourceMap.module.css'

type ResourceMapProps = DocumentPreviewProps & PropsLocale<'resourceMap'>

/**
 * Render complete SVG bytes or a localized validation failure.
 * @param props - document owner inputs and framework-bound dictionary.
 * @returns the Resource Map renderer with isolated per-frame interaction state.
 */
export function ResourceMap(props: ResourceMapProps): ReactNode {
  const data = props.content.kind === 'bytes' ? props.content.data : undefined
  const prepared = useMemo(() => {
    if (!data) return undefined
    try { return prepareMap(data) } catch (error) {
      // Invalid external bytes are reported in the preview, without embedding raw XML.
      if (error instanceof Error) return undefined
      throw error
    }
  }, [data])
  if (!prepared) return <div className={css.error} role="alert">{props.t('invalid')}</div>
  return <MapFrame prepared={prepared} t={props.t} />
}

function MapFrame({ prepared, t }: { prepared: PreparedMap; t: ResourceMapProps['t'] }): ReactNode {
  const controls = useRef<MapViewport>()
  const [scale, setScale] = useState(1)
  const [counts, setCounts] = useState<{ nets: number; relays: number; unavailable: number }>()
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState<PreparedMap>()
  const ready = active === prepared && !failed
  useEffect(() => () => { controls.current?.dispose() }, [])
  return <div className={css.root}>
    <div className={css.toolbar} role="group" aria-label={t('controls')}>
      <Button size="sm" disabled={!ready || scale <= 0.25} onClick={() => controls.current?.zoom(1 / 1.15)}>{t('zoomOut')}</Button>
      <span className={css.scale} aria-live="polite">{t('percent', { value: Math.round(scale * 100) })}</span>
      <Button size="sm" disabled={!ready || scale >= 12} onClick={() => controls.current?.zoom(1.15)}>{t('zoomIn')}</Button>
      <Button size="sm" disabled={!ready} onClick={() => controls.current?.actual()}>{t('actual')}</Button>
      <Button size="sm" disabled={!ready} onClick={() => controls.current?.fit()}>{t('fit')}</Button>
    </div>
    {ready && counts && <p className={css.status}>{counts.nets || counts.relays
      ? t('counts', { nets: counts.nets, relays: counts.relays }) : t('static')}
    {counts.unavailable > 0 && <span> · {t('unavailable', { count: counts.unavailable })}</span>}
    </p>}
    {failed && <p className={css.error} role="alert">{t('failed')}</p>}
    <iframe className={css.frame} title={t('title')} sandbox="allow-same-origin" referrerPolicy="no-referrer"
      srcDoc={prepared.html} onLoad={(event) => {
        controls.current?.dispose()
        controls.current = undefined
        try {
          const viewport = mountViewport(event.currentTarget, prepared, setScale)
          controls.current = viewport
          setCounts({ nets: viewport.nets, relays: viewport.relays, unavailable: viewport.unavailable })
          setFailed(false)
          setActive(prepared)
        } catch (error) {
          // Frame initialization failures retain the shared Reload control above this body.
          if (!(error instanceof Error)) throw error
          setFailed(true)
        }
      }} />
  </div>
}
