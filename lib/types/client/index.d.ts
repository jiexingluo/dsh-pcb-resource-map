/** Register the Resource Map renderer through public document-preview services. */
import type { Context } from '@deepseek-ai/cordis';
/** Required browser services; slot declaration readiness is awaited separately. */
export declare const inject: string[];
/**
 * Install renderer metadata, localized copy, and a reversible document body.
 * @param ctx - browser plugin context supplied by Cordis.
 */
export declare function apply(ctx: Context): void;
