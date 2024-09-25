import { describe, test, expect } from 'vitest'
import { dedent } from 'extra-tags'
import { toArray } from '@blackglory/prelude'
import { parseMetadata, parseMetadataLines } from '@utils/metadata.js'

describe('parseMetadata', () => {
  test('with valid name', () => {
    const code = dedent`
    // @name Hello World
    // @match <all_urls>
    // @update-url http://example.com
    `

    const result = parseMetadata(code)

    expect(result).toEqual({
      name: 'Hello World'
    , matches: ['<all_urls>']
    , updateURLs: ['http://example.com']
    })
  })

  test('without valid name', () => {
    const code = dedent`
    // @name  
    // @match <all_urls>
    // @update-url http://example.com
    `

    const result = parseMetadata(code)

    expect(result).toEqual({
      name: null
    , matches: ['<all_urls>']
    , updateURLs: ['http://example.com']
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

  expect(result).toEqual([
    { key: 'key1', value: 'foo bar' }
  , { key: 'key3', value: 'baz' }
  ])
})
