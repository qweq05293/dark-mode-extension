import { ThemeProvider, useTheme, type Theme } from "./components/theme-provider"
import { Toaster } from "./components/ui/sonner"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {children}
        <Toaster theme={theme as Theme} position="bottom-center" />
      </ThemeProvider>
    </>
  )
}
