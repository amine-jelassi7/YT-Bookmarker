(() => {
  let currentVideo = "";
  let youtubePlayer = null;
  let controlsObserver = null;

  const getTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    return [hours, minutes, remainingSeconds]
      .map((part) => String(part).padStart(2, "0"))
      .join(":");
  };

  const getVideoId = () => new URL(window.location.href).searchParams.get("v");

  const ensureBookmarkButton = () => {
    const controls = document.querySelector(".ytp-left-controls");
    const player = document.querySelector("video.html5-main-video");
    if (!controls || !player || !currentVideo) return false;

    youtubePlayer = player;
    if (!controls.querySelector(".bookmark-btn")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ytp-button bookmark-btn";
      button.title = "Bookmark current timestamp";
      button.setAttribute("aria-label", button.title);
      button.style.width = "48px";
      button.style.background = `center / 20px no-repeat url("${chrome.runtime.getURL("assets/bookmark.png")}")`;
      button.addEventListener("click", async () => {
        if (!youtubePlayer || !currentVideo) return;
        const videoId = currentVideo;
        const currentTime = youtubePlayer.currentTime;
        const key = videoId;
        chrome.storage.sync.get([key], (data) => {
          const bookmarks = data[key] ? JSON.parse(data[key]) : [];
          bookmarks.push({ time: currentTime, desc: `Bookmark at ${getTime(currentTime)}` });
          bookmarks.sort((a, b) => a.time - b.time);
          chrome.storage.sync.set({ [key]: JSON.stringify(bookmarks) });
        });
      });
      controls.appendChild(button);
    }
    return true;
  };

  const setCurrentVideo = (videoId) => {
    currentVideo = videoId || "";
    if (!currentVideo) return;
    if (!ensureBookmarkButton() && !controlsObserver) {
      controlsObserver = new MutationObserver(() => {
        if (ensureBookmarkButton()) {
          controlsObserver.disconnect();
          controlsObserver = null;
        }
      });
      controlsObserver.observe(document.documentElement, { childList: true, subtree: true });
    }
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "NEW") {
      setCurrentVideo(message.videoId);
    } else if (message.type === "PLAY") {
      youtubePlayer = document.querySelector("video.html5-main-video");
      if (youtubePlayer) youtubePlayer.currentTime = Number(message.value);
    } else if (message.type === "DELETE" && currentVideo) {
      const key = currentVideo;
      chrome.storage.sync.get([key], (data) => {
        const bookmarks = data[key] ? JSON.parse(data[key]) : [];
        const remaining = bookmarks.filter((bookmark) => Number(bookmark.time) !== Number(message.value));
        chrome.storage.sync.set({ [key]: JSON.stringify(remaining) }, () => sendResponse(remaining));
      });
      return true;
    }
  });

  const syncVideoFromUrl = () => setCurrentVideo(getVideoId());
  document.addEventListener("yt-navigate-finish", syncVideoFromUrl);
  syncVideoFromUrl();
})();
