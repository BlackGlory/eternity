import * as DAO from '@shared/dao'
import { IIFE } from '@blackglory/code-tags'
import { isMatch } from 'micromatch'

browser.webNavigation.onCommitted.addListener(async details => {
  const matchedScripts = await DAO.filterEnabledUserScripts(script => {
    return matchAnyOfUrlPatterns(details.url, script.urlPatterns)
  })

  if (matchedScripts.length > 0) {
    injectContentScript(
      details.tabId
    , details.frameId
    , createESMContentScript(...matchedScripts.map(x => x.code))
    )
  }
})

function createESMContentScript(...scripts: string[]): string {
  const loaders = scripts.map(script => IIFE`loadESMScript(${script})`).join('\n')

  return `
    ${loaders}

    async function loadESMScript(script) {
      const blob = new Blob([script], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      await import(url)
      URL.revokeObjectURL(url)
    }
  `
}

async function injectContentScript(tabId: number, frameId: number, script: string): Promise<void> {
  await browser.tabs.executeScript(
    tabId
  , {
      frameId
      // Bypass restrictions of Chrome extension scripts
    , code: IIFE`
        const script = document.createElement('script')
        script.text = ${script}
        document.head.append(script)
      `
    , runAt: 'document_start'
    }
  )
}

function matchAnyOfUrlPatterns(url: string, patterns: string[]): boolean {
  return patterns.some(pattern => matchUrlPattern(url, pattern))
}

function matchUrlPattern(url: string, pattern: string): boolean {
  return isMatch(url, pattern, { bash: true })
}
