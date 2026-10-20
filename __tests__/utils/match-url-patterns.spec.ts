import { describe, test, expect } from 'vitest'
import { matchURLPatterns } from '@utils/match-url-patterns.js'

describe('matchURLPatterns', () => {
  test('<all_urls>', () => {
    const patterns = ['<all_urls>']

    expect(matchURLPatterns(patterns, 'https://example.com/')).toBe(true)
  })

  describe('wildcard', () => {
    test('in domain', () => {
      const patterns = ['https://*.example.com/']

      expect(matchURLPatterns(patterns, 'https://foo.example.com/')).toBe(true)
      expect(matchURLPatterns(patterns, 'https://example.com/')).toBe(true)
      expect(matchURLPatterns(patterns, 'https://foo.example-bar.com/')).toBe(false)
    })

    test('in pathname', () => {
      const patterns = ['https://example.com/foo/*']

      expect(matchURLPatterns(patterns, 'https://example.com/foo/bar')).toBe(true)
      expect(matchURLPatterns(patterns, 'https://example.com/bar/foo')).toBe(false)
    })

    test('in search params', () => {
      const patterns = ['https://example.com/pathname?foo=*']

      expect(matchURLPatterns(patterns, 'https://example.com/pathname?foo=bar')).toBe(true)
      expect(matchURLPatterns(patterns, 'https://example.com/pathname?bar=foo')).toBe(false)
    })
  })

  test('any of patterns', () => {
    const patterns = [
      'https://foo.example.com/'
    , 'https://*/foo'
    ]

    expect(matchURLPatterns(patterns, 'https://foo.example.com/')).toBe(true)
    expect(matchURLPatterns(patterns, 'https://foo.example.com/foo')).toBe(true)
    expect(matchURLPatterns(patterns, 'https://bar.example.com/foo')).toBe(true)
    expect(matchURLPatterns(patterns, 'https://bar.example.com/')).toBe(false)
  })

  test('invalid pattern', () => {
    const patterns = ['https://*.example.com']

    expect(matchURLPatterns(patterns, 'https://foo.example.com/')).toBe(false)
  })
})
