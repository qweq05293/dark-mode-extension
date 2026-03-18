import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle({ onClick }: { onClick?: () => void }) {
  const { setTheme, theme } = useTheme()

  function hanleClick() {
    if (theme === "light" || theme === "system") {
      setTheme("dark")
    }
    if (theme === "dark") {
      setTheme("light")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        hanleClick()
        if (onClick) onClick()
      }}
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 text-primary transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 text-primary transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  )
}
