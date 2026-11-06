/** Help script/MCP generators announce finished Resource Maps through DSH's delivery tool. */
import type { Context } from '@deepseek-ai/cordis';
export declare const inject: string[];
/** Request explicit existing-file delivery for generators without structured write events. */
export declare function apply(ctx: Context): void;
