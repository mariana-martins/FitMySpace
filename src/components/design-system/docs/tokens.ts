import documentedTokens from '../tokens/tokens.docs.json';

/* ---------------------------------------------------------------
 * Token data for the Foundation pages (Storybook docs helper)
 *
 * Reads tokens.docs.json, which Style Dictionary generates next to
 * tokens.css. The pages list tokens from here instead of keeping
 * hand-written lists that drift from the JSON.
 * --------------------------------------------------------------- */

export interface DocumentedToken {
  /** The CSS custom property, e.g. `--ds-semantic-spacing-inset-md`. */
  name: string;
  /** The token's path in the JSON, e.g. `['semantic', 'spacing', 'inset', 'md']`. */
  path: string[];
  /** The resolved value, as in tokens.css after every alias is followed. */
  value: string;
  /** The `comment` written next to the token in the JSON. */
  comment: string | null;
}

const allTokens: DocumentedToken[] = documentedTokens;

/** Size steps are shown upper-case (`XS`, `2XL`); every other segment is capitalised. */
const SIZE_STEP_PATTERN = /^(\d*x[sl]|sm|md|lg)$/;

/** Tokens whose JSON path starts with the given segments, in JSON order. */
export function getTokens(...pathPrefix: string[]): DocumentedToken[] {
  return allTokens.filter((token) =>
    pathPrefix.every((segment, index) => token.path[index] === segment),
  );
}

/**
 * Splits tokens into groups, keeping the order in which each group
 * first appears in the JSON. By default the key is a path segment,
 * e.g. `2` groups `semantic.spacing.*` into inset, gap, section...
 */
export function groupTokens(
  tokens: DocumentedToken[],
  groupBy: number | ((token: DocumentedToken) => string),
): Map<string, DocumentedToken[]> {
  const getGroupKey =
    typeof groupBy === 'number' ? (token: DocumentedToken) => token.path[groupBy] : groupBy;
  const groups = new Map<string, DocumentedToken[]>();
  for (const token of tokens) {
    const groupKey = getGroupKey(token);
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), token]);
  }
  return groups;
}

function formatSegment(segment: string): string {
  if (SIZE_STEP_PATTERN.test(segment)) return segment.toUpperCase();
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** A readable label from path segments: `['inset', 'xs']` → `Inset XS`. */
export function formatTokenLabel(segments: string[]): string {
  return segments.map(formatSegment).join(' ');
}
