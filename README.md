# Roblox 2016 Classic for Chrome

Chrome extension for the Roblox website with a 2016 style, local Larpblox cosmetics, avatar previews, names, and game sync.

## Install and update

1. Open `chrome://extensions`, turn on Developer mode, and choose **Load unpacked**.
2. Select the folder containing `manifest.json`.
3. After updating the files, click the extension's **Reload** button and refresh Roblox.

The current extension version is **1.20.0**. It runs on `https://www.roblox.com/` only. Website appearance and Larp mode are controlled in the Robux menu.

## Local game connection

Run the Larpblox desktop app and use its connection wizard, then open Roblox. The extension pairs with the local helper automatically and retries when it restarts. **Reconnect** resumes after an intentional **Disconnect**. The extension keeps the local bearer code in the background worker's memory; it stores only the per-account disconnect preference. Pairing and outfit sync are scoped to the signed-in Roblox account. Install/run the connected Larpblox game version to exchange cosmetic state. The extension does not execute game code or send code/executor commands through the bridge.

## Shared Larp appearances

When Larp mode is on, the extension checks the public relay for the Roblox profile IDs currently linked on the visible page. It skips the signed-in account, validates peer snapshots and names, and accepts peer portraits only from Roblox CDN image hosts. Shared appearances are temporary and disappear when a peer is no longer active, the page changes, Larp mode is turned off, or the relay cannot be read. Your own browser/game appearance is read from local browser and game state; it is not loaded from the public relay.

## Privacy

The extension has no analytics and loads no remote executable code. It has no cookies permission and does not read or store Roblox cookie values. Roblox page content and cosmetic state remain in the browser/local helper; the extension fetches peer appearance records from `https://larp.3xjn.dev` for visible profile IDs. The local helper listens on loopback. Chrome's extension permission notice reflects the Roblox page styling and localhost/relay connections.

## Checks

Run the focused protocol and worker fixtures with:

```sh
node tests/bridge-check.cjs
node tests/background-check.cjs
node tests/shared-users-check.cjs
```

See [REFERENCES.md](REFERENCES.md) for research and asset attribution, [THEME-LICENSE.txt](THEME-LICENSE.txt) for theme rules, and `assets/FONT-LICENSE.txt` for bundled fonts.
