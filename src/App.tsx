import { useEffect, useState } from "react";

export default function App() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["enabled"], (res) => {
      setEnabled(res.enabled as boolean);
    });
  }, []);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);

    chrome.storage.local.set({ enabled: newValue });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        type: "TOGGLE_DARK",
        enabled: newValue
      });
    });
  };

  return (
    <div style={{ padding: 16, minWidth: 200 }}>
      <h3>Darkify Lite</h3>
      <button onClick={toggle}>
        {enabled ? "Disable" : "Enable"}
      </button>
    </div>
  );
}