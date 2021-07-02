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

// Drop CSP headers for loading ESM content scirpts
// Other solutions: https://github.com/BlackGlory/Elden/issues/1
browser.webRequest.onHeadersReceived.addListener(
  details => {
    const responseHeaders = details.responseHeaders!.filter(x => {
      return x.name.toLowerCase() !== 'content-security-policy'
    })

    return { responseHeaders }
  }
, {
    urls: ['<all_urls>']
  , types: ['main_frame', 'sub_frame']
  }
, ['blocking', 'responseHeaders']
)

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
        // wait for document.head
        setTimeout(() => {
          const script = document.createElement('script')
          script.text = ${script}
          document.head.append(script)
        }, 0)
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
