import { test, expect } from 'vitest'
import { dedent } from 'extra-tags'
import { toArray } from '@blackglory/prelude'
import { parseMetadata, parseMetadataLines } from '@utils/metadata.js'

test('parseMetadata', () => {
  const codes = dedent`
  // @name Hello World
  // @match <all_urls>
  // @update-url http://example.com
  `

  const result = parseMetadata(codes)

  expect(result).toEqual({
    name: 'Hello World'
  , matches: ['<all_urls>']
  , updateURLs: ['http://example.com']
  })
})

test('parseMetadataLines', () => {
  const codes = dedent`
    // @key1 value1

    // @key2 value2
  `

  const iter = parseMetadataLines(codes)
  const result = toArray(iter)

  expect(result).toEqual([
    { key: 'key1', value: 'value1' }
  , { key: 'key2', value: 'value2' }
  ])
})
