/** Register the Resource Map renderer through public document-preview services. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { ResourceMap } from './ResourceMap.tsx'
import { dictionaries } from './locales.ts'
import { installAutoOpen } from './auto-open.ts'

/** Required browser services; slot declaration readiness is awaited separately. */
export const inject = ['documentPreviews', 'slots', 'locale', 'sessions', 'sidebarRight', 'connection']

/**
 * Install renderer metadata, localized copy, and a reversible document body.
 * @param ctx - browser plugin context supplied by Cordis.
 */
export function apply(ctx: Context): void {
  const id = 'dsh-pcb-resource-map'
  ctx.effect(() => ctx.locale.register('resourceMap', dictionaries))
  const t = ctx.locale.bind('resourceMap')
  ctx.effect(() => ctx.documentPreviews.register({ id, extensions: ['resmap'], title: () => t('title'), loading: 'bytes-complete' }))
  ctx.effect(() => ctx.slots.inject('sidebar.right.tab.document', () => ctx.slots.register({
    name: 'sidebar.right.tab.document', key: id, locale: 'resourceMap',
  }, ResourceMap)))
  installAutoOpen(ctx, 'resmap')
}
