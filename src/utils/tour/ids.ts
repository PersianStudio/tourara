/**
 * Builds stable DOM id strings for tour portal / mask / tooltip elements.
 */

export function getIdString(base: string, identifier?: string): string {
  return `${base}${identifier ? `-${identifier}` : ``}`;
}
