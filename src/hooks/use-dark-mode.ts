import { useMediaQuery } from './use-media-query.js'

export function useDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}
