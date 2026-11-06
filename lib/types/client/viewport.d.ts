import type { MapInteractions } from './interaction.ts';
import type { PreparedMap } from './svg.ts';
export interface MapViewport extends MapInteractions {
    readonly zoom: (factor: number) => void;
    readonly actual: () => void;
    readonly fit: () => void;
}
/**
 * Own an already-loaded isolated preview frame until content replacement.
 * @param frame - mounted, same-origin frame with scripts disabled by sandbox and CSP.
 * @param prepared - validated drawing dimensions.
 * @param changed - local rendering callback for the displayed zoom.
 * @returns zoom operations, interaction counts, and complete lifecycle cleanup.
 */
export declare function mountViewport(frame: HTMLIFrameElement, prepared: PreparedMap, changed: (scale: number) => void): MapViewport;
