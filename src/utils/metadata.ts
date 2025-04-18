import { isURLString } from 'extra-utils'

export interface Metadata {
  name: string | null
  matches: string[]
  updateURLs: string[]
  world: chrome.userScripts.ExecutionWorld | null
}

export function parseMetadata(code: string): Metadata {
  let name: string | null = null
  let world: chrome.userScripts.ExecutionWorld | null = null
  const matches: string[] = []
  const updateURLs: string[] = []

  for (const { key, value } of parseMetadataLines(code)) {
    switch (key) {
      case 'name': {
        const parsedName = parseNameValue(value)
        if (parsedName) name = parsedName
        break
      }
      case 'match': {
        const parsedMatch = parseMatchValue(value)
        if (parsedMatch) matches.push(parsedMatch)
        break
      }
      case 'update-url': {
        const parsedUpdateURL = parseUpdateURLValue(value)
        if (parsedUpdateURL) updateURLs.push(parsedUpdateURL)
        break
      }
      case 'world': {
        const parsedWorld = parseWorldValue(value)
        if (parsedWorld) world = parsedWorld
        break
      }
    }
  }

  return {
    name
  , matches
  , updateURLs
  , world
  }
}

function parseNameValue(value: string): string {
  return value.trim()
}

function parseMatchValue(value: string): string | null {
  const re = /^(?<pattern>\S+)\s*$/
  const matched = value.match(re)
  if (!matched) return null

  const { pattern } = matched.groups!
  return pattern
}

function parseUpdateURLValue(value: string): string | null {
  return isURLString(value)
       ? value
       : null
}

function parseWorldValue(value: string): chrome.userScripts.ExecutionWorld | null {
  switch (value.trim()) {
    case 'MAIN': return 'MAIN'
    case 'USER_SCRIPT': return 'USER_SCRIPT'
    default: return null
  }
}

export function* parseMetadataLines(code: string): Iterable<{
  key: string
  value: string
}> {
  const re = /^\/\/ @(?<key>[\w-]+) +(?<value>.+?) *$/gm

  for (const { groups } of code.matchAll(re)) {
    const { key, value } = groups!
    yield { key, value }
  }
}
