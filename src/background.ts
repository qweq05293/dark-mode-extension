chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: false })
})

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error))
