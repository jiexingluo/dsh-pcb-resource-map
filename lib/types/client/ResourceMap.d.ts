/** Resource Map document body; all file reads belong to the document owner. */
import { type ReactNode } from 'react';
import type { DocumentPreviewProps } from '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
type ResourceMapProps = DocumentPreviewProps & PropsLocale<'resourceMap'>;
/**
 * Render complete SVG bytes or a localized validation failure.
 * @param props - document owner inputs and framework-bound dictionary.
 * @returns the Resource Map renderer with isolated per-frame interaction state.
 */
export declare function ResourceMap(props: ResourceMapProps): ReactNode;
export {};
