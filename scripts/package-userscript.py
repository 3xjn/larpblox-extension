"""Build a self-contained, manager-updated userscript from the extension sources."""
import json
from pathlib import Path
import runpy
root = Path(__file__).resolve().parent.parent
runpy.run_path(str(root / 'scripts/package-website.py'))
payload = json.loads((root / 'website-bundle.json').read_text(encoding='utf-8'))
version = payload['version']
base = 'https://github.com/3xjn/larpblox-extension/releases/download/main-latest/'
header = f'''// ==UserScript==
// @name         Larpblox
// @namespace    https://github.com/3xjn/larpblox-extension
// @version      {version}
// @description  Larpblox avatars, names, avatar editor and Desktop connection on Roblox.
// @match        https://www.roblox.com/*
// @run-at       document-start
// @match        http://127.0.0.1:38261/v1/pair*
// @inject-into  content
// @sandbox      DOM
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @connect      larp.3xjn.dev
// @connect      127.0.0.1
// @connect      github.com
// @connect      release-assets.githubusercontent.com
// @updateURL    {base}larpblox.meta.js
// @downloadURL  {base}larpblox.user.js
// ==/UserScript==
'''
parts = [header, "(() => { 'use strict'; if (location.origin === 'https://www.roblox.com' && window.top !== window) return; if (globalThis.__larpbloxWebsite || globalThis.__larpbloxUserscript) return; globalThis.__larpbloxUserscript = true; globalThis.__larpbloxWebsite = 'userscript';", (root/'userscript-runtime.js').read_text(encoding='utf-8').replace('__USERSCRIPT_VERSION__',json.dumps(version))]
parts.append((root/'userscript-desktop.js').read_text(encoding='utf-8'))
# Validators must exist before the background handlers start receiving requests.
parts.append((root/'larpbux-game-bridge.js').read_text(encoding='utf-8'))
background = (root/'larpbux-game-background.js').read_text(encoding='utf-8').replace("importScripts('larpbux-game-bridge.js', 'remote-loader.js');", '')
# Keep privileged requests local to the existing background implementation.
parts.append('(function(fetch) {\n' + background + '\n})(privilegedFetch);')
parts.append('if (desktopHost) { serveDesktopFrame(); return; }')
hooks = '\n;\n'.join((root/name).read_text(encoding='utf-8') for name in ['larpblox-real-avatar.js','larpbux-body-colors.js','larpblox-peer-identities.js'])
# Inline handlers include document in their name lookup: bare URL is document.URL.
# All page hooks need the browser constructor rather than that address string.
hooks = 'const URL = globalThis.URL;\n' + hooks
# Inline event handlers execute in the page realm; Roblox permits inline code.
parts.append('const installPageHooks = () => { const trigger = document.createElement("input"); trigger.type = "hidden"; trigger.setAttribute("onchange", '+json.dumps(hooks)+'); document.documentElement.append(trigger); trigger.dispatchEvent(new Event("change")); trigger.remove(); }; if(document.documentElement) installPageHooks(); else new MutationObserver((_,o)=>{if(document.documentElement){o.disconnect();installPageHooks();}}).observe(document,{childList:true});')
parts.append('const style = document.createElement("style"); style.textContent = '+json.dumps(payload['css'])+'; const mount = () => (document.head || document.documentElement).append(style); if(document.documentElement) mount(); else new MutationObserver((_,o)=>{if(document.documentElement){o.disconnect();mount();}}).observe(document,{childList:true});')
parts.extend(s['code'] for s in payload['scripts'] if s['name'] != 'larpbux-game-bridge.js')
parts.append('globalThis.LarpbloxUserscriptPopupData = '+json.dumps({key:value for key,value in {**payload['popup'],'version':version}.items() if key != 'js'})+';')
parts.append("globalThis.LarpbloxPopupContext = {root:document.createElement('div')};")
parts.append(payload['popup']['js'])
parts.append('globalThis.renderUserscriptPopup = LarpbloxPopup.renderUserscriptPopup; globalThis.LarpbloxUserscriptPopupData.userscriptInstall = userscriptInstall;')
parts.append((root/'userscript-popup.js').read_text(encoding='utf-8'))
parts.append("GM_registerMenuCommand('Open Larpblox', () => globalThis.LarpbloxUserscriptPopup.open());\n})();\n")
output = root/'website-release'
(output/'larpblox.user.js').write_text('\n;\n'.join(parts),encoding='utf-8')
(output/'larpblox.meta.js').write_text(header,encoding='utf-8')
print(f'Built Larpblox userscript {version}')
