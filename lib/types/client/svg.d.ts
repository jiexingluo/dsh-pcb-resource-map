export interface PreparedMap {
    readonly html: string;
    readonly width: number;
    readonly height: number;
}
/**
 * Parse a complete UTF-8 SVG and remove active content before embedding it.
 * @param data - complete file bytes borrowed from the document owner.
 * @returns an isolated document and its intrinsic drawing dimensions.
 * @throws when the encoding, XML root, or dimensions are invalid.
 */
export declare function prepareMap(data: Uint8Array<ArrayBuffer>): PreparedMap;
