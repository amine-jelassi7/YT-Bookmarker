# YT-Bookmarker

A lightweight browser extension that lets you save timestamped bookmarks directly on YouTube videos and access them anytime—even after closing your browser tab.

---

## Features

- **Timestamped Bookmarks:** Save your current playback position with a single click.
- **Persistent Storage:** Bookmarks stay saved locally across browser restarts.
- **Direct Navigation:** Jump straight to any saved point in a video.
- **Cross-Browser Support:** Dedicated branches for Chromium (Chrome, Edge, Brave) and Mozilla (Firefox).

---

## Installation

### 1. Chromium Browsers (Chrome, Edge, Brave, Opera)

1. Clone the `main` branch:
   ```bash
   git clone -b main https://github.com/amine-jelassi7/YT-Bookmarker.git
   ```
2. Open your browser's extensions management page (`chrome://extensions` or `edge://extensions`).
3. Enable **Developer mode** (toggle in the top right or left sidebar).
4. Click **Load unpacked** and select the cloned project folder containing `manifest.json`.

---

### 2. Mozilla Firefox

1. Clone the `Mozilla` branch:
   ```bash
   git clone -b Mozilla https://github.com/amine-jelassi7/YT-Bookmarker.git
   ```
2. Open Firefox and navigate to `about:debugging`.
3. Click **This Firefox** on the left menu.
4. Click **Load Temporary Add-on...**
5. Select the `manifest.json` file inside the cloned project folder.

---

## How to Use

1. Navigate to any video on [YouTube](https://www.youtube.com).
2. Click the **YT-Bookmarker** icon in your browser toolbar to open the popup.
3. Click **Bookmark Current Time** (or the **+** button) to save your timestamp.
4. Click any saved bookmark in your list to jump directly to that timestamp in the video.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/amine-jelassi7/YT-Bookmarker/issues).

---

## License

This project is [MIT](LICENSE) licensed.
