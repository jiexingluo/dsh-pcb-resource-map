/**
 * Resolve authored Relay state children, refusing ambiguous exporter suffixes.
 * @param relay - one relay group; nested relays retain their own state.
 * @returns exactly one ON/OFF pair, or undefined when incomplete or ambiguous.
 */
export declare function relayPair(relay: Element): readonly [HTMLElement | SVGElement, HTMLElement | SVGElement] | undefined;
export interface MapInteractions {
    readonly nets: number;
    readonly relays: number;
    readonly unavailable: number;
    readonly dispose: () => void;
}
/**
 * Bind interaction to one isolated SVG document; all mutations are transient.
 * @param svg - sanitized SVG root in its own iframe document.
 * @returns indexed counts and a disposer for listeners and generated hit targets.
 */
export declare function bindMap(svg: SVGSVGElement): MapInteractions;
/** @returns a finite scale within the Resource Map viewer's 25–1200% range. */
export declare function clampScale(scale: number): number;
