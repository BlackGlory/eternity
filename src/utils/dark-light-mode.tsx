import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"

export const getSystemColorScheme = (): 'dark' | 'light' => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type ISystemThemeContext = {
  theme: 'light' | 'dark'
}

const SystemThemeContext = createContext<ISystemThemeContext>({ theme: 'light' })

export const SystemThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setTheme(getSystemColorScheme())
  }, [])

  useEffect(() => {
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')

    const updateTheme = () => {
      setTheme(matchMedia.matches ? 'dark' : 'light')
    }

    matchMedia.addEventListener('change', updateTheme)

    return () => {
      matchMedia.removeEventListener('change', updateTheme)
    }
  }, [])

  return (
    <SystemThemeContext.Provider value={{ theme }}>
      {children}
    </SystemThemeContext.Provider>
  )
}

export const useSystemTheme = (): ISystemThemeContext['theme'] => {
  return useContext(SystemThemeContext).theme
}
