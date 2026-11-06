/** Help script/MCP generators announce finished Resource Maps through DSH's delivery tool. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-tools'

export const inject = ['systemPrompt', 'tools']

/** Request explicit existing-file delivery for generators without structured write events. */
export function apply(ctx: Context): void {
  ctx.systemPrompt.section({
    name: 'pcb-resource-map-auto-preview',
    order: ctx.systemPrompt.getSectionOrder('TOOL_WRITE'),
    text: ({ scope }) => ctx.tools.get('present', scope) === undefined ? ''
      : 'After successfully generating or updating a .resmap file using a shell, script, or MCP tool, '
        + 'call present with the final existing file path so its PCB Resource Map preview can open automatically. '
        + 'Do not present files merely read or mentioned, and do not present failed or incomplete output. '
        + 'Built-in write/edit operations already trigger the Resource Map preview.',
  })
}
