import { useEffect, useState } from "react"
import { Title } from "./components/app-title"
import { Button } from "./components/ui/button"
import {  SidebarClose } from "lucide-react"

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
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.id ) return;
  const isRestricted = activeTab?.url?.startsWith("chrome://") || 
                        activeTab?.url?.startsWith("edge://") || 
                        activeTab?.url?.startsWith("https://chrome.google.com");

    if (isRestricted) {
      console.warn("Cannot run extension on internal chrome pages");
      return;
    }
    // Пытаемся отправить сообщение
    chrome.tabs.sendMessage(activeTab.id, { type: "TOGGLE_DARK", enabled: newValue }, () => {
      // Если получили ошибку (скрипта нет), внедряем его
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id  as number},
          files: ["content.js"]
        }, () => {
          // После внедрения скрипт сам прочитает storage в init() и включится
          console.log("Content script injected");
        });
      }
    });
  });
}

  return (
    <div className="bg-radial-primary mx-auto flex min-h-screen max-w-90 flex-col items-center justify-start gap-4 p-4 ">
      <div className="flex  w-full  items-center justify-between">
        <Title className="text-foreground/90" text={chrome.i18n.getMessage("extension_name")} align="left" size="lg" />
        <div className="  flex gap-2 items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => window.close()}>
            <SidebarClose className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>
      <Button variant="destructive" size="lg" className="w-full h-10 text-foreground" onClick={toggle}>
        {enabled ? chrome.i18n.getMessage("disable_theme_change") : chrome.i18n.getMessage("enable_theme_change")}
      </Button>
    </div>
  )
}
