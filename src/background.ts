chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: false })
})

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error))

chrome.tabs.query({}, (tabs) => {
  for (const tab of tabs) {
    if (!tab.id || !tab.url) continue
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) continue

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })
  }
})
