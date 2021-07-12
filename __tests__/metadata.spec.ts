import { dedent } from 'extra-tags'
import { parseMetadata, parseMetadataLines } from '@utils/metadata'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('parseMetadata(code: string): Metadata', () => {
  it('return Metadata', () => {
    const codes = dedent`
    // @name blackglory.me
    // @match *://www.blackglory.me/*
    `

    const result = parseMetadata(codes)

    expect(result).toEqual({
      name: 'blackglory.me'
    , urlPatterns: ['*://www.blackglory.me/*']
    })
  })
})

describe('parseMetadataLines(code: string): Iterable<{ key: stirng, value: string }>', () => {
  it('return Iterable', () => {
    const codes = dedent`
      // @key1 value1

      // @key2 value2
    `

    const result = parseMetadataLines(codes)
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toEqual([
      { key: 'key1', value: 'value1' }
    , { key: 'key2', value: 'value2' }
    ])
  })
})
