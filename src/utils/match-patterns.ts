import { matchPattern } from 'browser-extension-url-match'
import { getResult } from 'return-style'

/**
 * @see https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
 */
export function matchPatterns(patterns: string[], url: string): boolean {
  return patterns
    .map(pattern => getResult(() => matchPattern(pattern).assertValid()))
    .some(pattern => getResult(() => pattern?.match(url)))
}
