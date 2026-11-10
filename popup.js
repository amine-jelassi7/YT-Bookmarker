import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";

  if (currentBookmarks.length > 0) {
    for (let i = 0; i < currentBookmarks.length; i++) {
      const bookmark = currentBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();
  if (!activeTab?.id) return;

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: Number(bookmarkTime),
  }, () => {
    void chrome.runtime.lastError;
  });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  if (!activeTab?.id) return;
  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: Number(bookmarkTime),
  }, (remainingBookmarks) => {
    if (chrome.runtime.lastError) return;
    viewBookmarks(remainingBookmarks || []);
  });
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  if (!activeTab?.url) {
    viewBookmarks([]);
    return;
  }
  const url = new URL(activeTab.url);
  const currentVideo = url.searchParams.get("v");

  if (url.hostname.endsWith("youtube.com") && url.pathname === "/watch" && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      let currentVideoBookmarks = [];
      try {
        currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
      } catch (error) {
        console.error("Could not read saved YouTube bookmarks", error);
      }

      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }
});
