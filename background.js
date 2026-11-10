chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const url = new URL(tab.url);
  if (!url.hostname.endsWith("youtube.com") || url.pathname !== "/watch") return;

  chrome.tabs.sendMessage(tabId, {
    type: "NEW",
    videoId: url.searchParams.get("v"),
  }, () => 
    void chrome.runtime.lastError;
  });
});
