import { isURLString } from 'extra-utils'

export interface Metadata {
  name: string
  matches: string[]
  updateURLs: string[]
}

export function parseMetadata(code: string): Metadata {
  let name: string | null = null
  const matches: string[] = []
  const updateURLs: string[] = []

  for (const { key, value } of parseMetadataLines(code)) {
    switch (key) {
      case 'name': {
        name = parseNameValue(value)
        break
      }
      case 'match': {
        const match = parseMatchValue(value)
        if (match) matches.push(match)
        break
      }
      case 'update-url': {
        const updateURL = parseUpdateURLValue(value)
        if (updateURL) updateURLs.push(updateURL)
        break
      }
    }
  }

  if (name === null) throw new Error('The userscript needs a name.')

  return {
    name
  , matches
  , updateURLs
  }
}

function parseNameValue(value: string): string {
  return value
}

function parseMatchValue(value: string): string | null {
  const re = /^(?<pattern>\S+)\s*$/
  const matched = value.match(re)
  if (!matched) return null

  const { pattern } = matched.groups!
  return pattern
}

function parseUpdateURLValue(value: string): string | null {
  if (isURLString(value)) {
    return value
  } else {
    return null
  }
}

export function* parseMetadataLines(code: string): Iterable<{
  key: string
  value: string
}> {
  const re = /^\/\/ @(?<key>[\w-]+)[\s^\n]+(?<value>.*?)[\s^\n]*$/gm
  for (const { groups } of code.matchAll(re)) {
    const { key, value } = groups!
    yield { key, value }
  }
}
