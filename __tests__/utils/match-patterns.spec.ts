import { describe, test, expect } from 'vitest'
import { matchPatterns } from '@utils/match-patterns.js'

describe('matchPatterns', () => {
  test('<all_urls>', () => {
    const patterns = ['<all_urls>']

    const result = matchPatterns(patterns, 'https://example.com/')

    expect(result).toBe(true)
  })

  describe('wildcard', () => {
    test('in domain', () => {
      const patterns = ['https://*.example.com/']

      expect(matchPatterns(patterns, 'https://foo.example.com/')).toBe(true)
      expect(matchPatterns(patterns, 'https://example.com/')).toBe(true)
      expect(matchPatterns(patterns, 'https://foo.example-bar.com/')).toBe(false)
    })

    test('in pathname', () => {
      const patterns = ['https://example.com/foo/*']

      expect(matchPatterns(patterns, 'https://example.com/foo/bar')).toBe(true)
      expect(matchPatterns(patterns, 'https://example.com/bar/foo')).toBe(false)
    })

    test('in search params', () => {
      const patterns = ['https://example.com/pathname?foo=*']

      expect(matchPatterns(patterns, 'https://example.com/pathname?foo=bar')).toBe(true)
      expect(matchPatterns(patterns, 'https://example.com/pathname?bar=foo')).toBe(false)
    })
  })
})
