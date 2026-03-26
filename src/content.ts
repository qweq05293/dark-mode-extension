declare global {
  interface Window {
    HAS_DARKIFY_INJECTED?: boolean;
  }
}

// Проверка, чтобы не инициализировать скрипт дважды
if (window.HAS_DARKIFY_INJECTED) {
  // Если скрипт уже есть, просто выходим, он сам поймает сообщение или прочитает сторедж
} else {
  window.HAS_DARKIFY_INJECTED = true;

  let isEnabled = false;
  const STYLE_ID = "darkify-style";

// =========================
// INIT (при загрузке)
// =========================
init()

function init() {
  chrome.storage.local.get(["enabled"], (res) => {
    isEnabled = Boolean(res.enabled)

    // if (isEnabled && !isPageAlreadyDark()) {
    if (isEnabled  ) {

      applyDarkMode()
    }
  })
}

// =========================
// LISTEN STORAGE (sync между вкладками)
// =========================
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.enabled) return

  isEnabled = Boolean(changes.enabled.newValue)

  if (isEnabled) {
    applyDarkMode()
  } else {
    removeDarkMode()
  }
})

// =========================
// MESSAGE LISTENER (popup)
// =========================
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_DARK") {
    isEnabled = Boolean(msg.enabled)

    if (isEnabled) {
      applyDarkMode()
    } else {
      removeDarkMode()
    }
  }
})

// =========================
// APPLY DARK MODE
// =========================
function applyDarkMode() {
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement("style")
  style.id = STYLE_ID

  style.textContent = `
    html {
      filter: invert(1) hue-rotate(180deg) !important;
      background: #111 !important;
    }

    /* Media compensation */
    img,
    video,
    picture {
      filter: invert(1) hue-rotate(180deg) !important;
    }

        /* Иконки (SVG) обычно НЕ нужно инвертировать второй раз, 
       так как они должны менять цвет вместе с текстом */
    svg:not(:has(image)) {
      filter: none !important;
    }

    /* Если в SVG есть встроенное растровое изображение — его инвертируем */
    svg:has(image) {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Fix images inside background */
    [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /* Optional: improve contrast */
    body {
      background-color: #111 !important;
    }
    
    iframe {
  filter: invert(1) hue-rotate(180deg) !important;
}
  `

  document.head.appendChild(style)
}

// =========================
// REMOVE
// =========================
function removeDarkMode() {
  const style = document.getElementById(STYLE_ID)
  if (style) style.remove()
}

// =========================
// DETECT DARK PAGE
// =========================
// function isPageAlreadyDark() {
//   const bgColor = window.getComputedStyle(document.body).backgroundColor
//   const rgb = bgColor.match(/\d+/g)
//   if (!rgb) return false

//   const [r, g, b] = rgb.map(Number)

//   const brightness = Math.sqrt(
//     0.299 * r ** 2 +
//     0.587 * g ** 2 +
//     0.114 * b ** 2
//   )

//   return brightness < 128
// }

// =========================
// SPA SUPPORT (React/Vue сайты)
// =========================
  const observer = new MutationObserver(() => {
    if (!isEnabled) return;
    if (!document.getElementById(STYLE_ID)) {
      applyDarkMode();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}