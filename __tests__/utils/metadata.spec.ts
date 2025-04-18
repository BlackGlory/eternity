import { describe, test, expect } from 'vitest'
import { dedent } from 'extra-tags'
import { toArray } from '@blackglory/prelude'
import { parseMetadata, parseMetadataLines } from '@utils/metadata.js'

describe('parseMetadata', () => {
  describe('@name', () => {
    test('valid', () => {
      const code = dedent`
      // @name Hello World
      `

      const result = parseMetadata(code)

      expect(result).toMatchObject({
        name: 'Hello World'
      })
    })

    test('invalid', () => {
      const code = dedent`
      // @name  
      `

      const result = parseMetadata(code)

      expect(result).toMatchObject({
        name: null
      })
    })
  })

  test('@match', () => {
    const code = dedent`
    // @match <all_urls>
    `

    const result = parseMetadata(code)

    expect(result).toMatchObject({
      matches: ['<all_urls>']
    })
  })

  test('@update-url', () => {
    const code = dedent`
    // @update-url http://example.com
    `

    const result = parseMetadata(code)

    expect(result).toMatchObject({
      updateURLs: ['http://example.com']
    })
  })

  describe('@world', () => {
    test('valid', () => {
      const code = dedent`
      // @world MAIN
      `

      const result = parseMetadata(code)

      expect(result).toMatchObject({
        world: 'MAIN'
      })
    })

    test('invalid', () => {
      const code = dedent`
      // @world main
      `

      const result = parseMetadata(code)

      expect(result).toMatchObject({
        world: null
      })
    })
  })
})

test('parseMetadataLines', () => {
  const code = dedent`
    // @key1 foo bar 

    // @key2

    // @key3  baz
  `

  const iter = parseMetadataLines(code)
  const result = toArray(iter)

  expect(result).toStrictEqual([
    { key: 'key1', value: 'foo bar' }
  , { key: 'key3', value: 'baz' }
  ])
})
