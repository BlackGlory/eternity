import { javascript } from 'extra-tags'

export function esm(code: string): string {
  return javascript`
    loadESMScript(${code})

    async function loadESMScript(script) {
      const blob = new Blob([script], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      await import(url)
      URL.revokeObjectURL(url)
    }
  `
}
