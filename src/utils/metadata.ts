import { go } from '@blackglory/go'

export interface Metadata {
  name: string
  urlPatterns: string[]
}

export function parseMetadata(code: string): Metadata {
  let name: string | null = null
  const urlPatterns: string[] = []

  for (const { key, value } of parseMetadataLines(code)) {
    switch (key) {
      case 'name':
        name = parseNameValue(value)
        break
      case 'match':
        go(() => {
          const urlPattern = parseMatchValue(value)
          if (urlPattern) urlPatterns.push(urlPattern)
        })
        break
    }
  }

  if (name === null) throw new Error('The userscript needs a name.')

  return { name, urlPatterns }
}

function parseNameValue(value: string): string {
  return value
}

export function parseMatchValue(str: string): string | null {
  const re = /^(?<pattern>\S+)\s*$/
  const matched = str.match(re)
  if (!matched) return null

  const { pattern } = matched.groups!
  return pattern
}

export function* parseMetadataLines(code: string): Iterable<{ key: string, value: string }> {
  const re = /^\/\/ @(?<key>\w+)[\s^\n]+(?<value>.*?)[\s^\n]*$/gm
  for (const { groups } of code.matchAll(re)) {
    const { key, value } = groups!
    yield { key, value }
  }
}
