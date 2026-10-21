/* global chrome */
// No page UI: wake the loader if Chrome has not registered the cached script yet.
chrome.runtime.sendMessage({type:'larpblox-website-update', action:'start'}).catch(() => {});
