import { MatchPattern } from '@webext-core/match-patterns'
import { getResult } from 'return-style'

/**
 * @see https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
 */
export function matchPatterns(url: string, patterns: string[]): boolean {
  return patterns
    .map(pattern => getResult(() => new MatchPattern(pattern)))
    .some(pattern => getResult(() => pattern?.includes(url)))
}
