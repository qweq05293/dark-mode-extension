const STYLE_ID = "darkify-style"

function applyDarkMode() {
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    html, body {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }

    img, video {
      filter: brightness(0.8) contrast(1.2);
    }

    * {
      border-color: #333 !important;
    }
  `

  document.head.appendChild(style)
}

function removeDarkMode() {
  const style = document.getElementById(STYLE_ID)
  if (style) style.remove()
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_DARK") {
    if (msg.enabled) {
      applyDarkMode()
    } else {
      removeDarkMode()
    }
  }
})
