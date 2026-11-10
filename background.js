chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  const url = new URL(tab.url);
  if (!url.hostname.endsWith("youtube.com") || url.pathname !== "/watch") return;

  chrome.tabs.sendMessage(tabId, {
    type: "NEW",
    videoId: url.searchParams.get("v"),
  }, () => {
    // A navigation may complete before the content script is ready. The content
    // script also reads the current URL and handles YouTube's in-page navigation.
    void chrome.runtime.lastError;
  });
});
