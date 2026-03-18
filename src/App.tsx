import { useEffect, useState } from "react"
import { Title } from "./components/app-title"
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
import { SidebarClose } from "lucide-react"

export default function App() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    chrome.storage.local.get(["enabled"], (res) => {
      setEnabled(res.enabled as boolean)
    })
  }, [])

  const toggle = () => {
    const newValue = !enabled
    setEnabled(newValue)

    chrome.storage.local.set({ enabled: newValue })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        type: "TOGGLE_DARK",
        enabled: newValue,
      })
    })
  }

  return (
    <div className="bg-radial-primary mx-auto flex min-h-screen max-w-90 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Title className="text-foreground/90" text={chrome.i18n.getMessage("extension_name")} align="left" size="lg" />
        <div className="flex gap-2">
          <ModeToggle onClick={toggle} />
          <Button variant="ghost" size="icon" onClick={() => window.close()}>
            <SidebarClose className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  )
}
