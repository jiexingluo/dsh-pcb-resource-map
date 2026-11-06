// @vitest-environment jsdom
/** Verify plugin registrations are scoped to the Cordis fiber lifetime. */
import { Context } from '@deepseek-ai/cordis'
import { expect, it, vi } from 'vitest'
// Registration lifecycle is independent of host-provided browser primitives.
vi.mock('../src/client/ResourceMap.tsx', () => ({ ResourceMap: () => null }))
import { apply } from '../src/client/index.ts'

it('retires the locale, preview metadata and foreign slot on disposal', async () => {
  const ctx = new Context()
  const removeLocale = vi.fn()
  const removePreview = vi.fn()
  const removeSlot = vi.fn()
  const registerPreview = vi.fn((_options: unknown) => removePreview)
  const registerSlot = vi.fn((_options: unknown) => removeSlot)
  ctx.provide('locale', { register: () => removeLocale, bind: () => () => 'PCB Resource Map' } as never)
  ctx.provide('documentPreviews', { register: registerPreview } as never)
  ctx.provide('slots', {
    inject: (_name: string, callback: () => () => void) => callback(),
    register: registerSlot,
  } as never)
  const fiber = ctx.plugin({ apply })
  try {
    await fiber.await()
    expect(registerPreview.mock.calls[0]?.[0]).toMatchObject({ extensions: ['resmap'], loading: 'bytes-complete' })
    expect(registerSlot.mock.calls[0]?.[0]).toMatchObject({ name: 'sidebar.right.tab.document', locale: 'resourceMap' })
    await fiber.dispose()
    expect(removeLocale).toHaveBeenCalledOnce()
    expect(removePreview).toHaveBeenCalledOnce()
    expect(removeSlot).toHaveBeenCalledOnce()
  } finally { await fiber.dispose() }
})
