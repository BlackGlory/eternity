import { useMediaQuery } from 'extra-react-hooks'

export function useDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}
