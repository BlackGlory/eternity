# Elden

Modern ECMAScript loader.

## Metadata

Example:
```js
// @name Hack
// @match https://www.google.com/*
// @match https://github.com/*

console.log('hacked!')
```

### @name

The userscript name.

### @match

The url pattern.

The extension uses [micromatch](https://www.npmjs.com/package/micromatch) internally for url matching.
For backward compatibility (upgrade to [chrome.declarativeContent] or [browser.userScripts]),
only the basic `*` wildcard is recommended.

[chrome.declarativeContent]: https://developer.chrome.com/docs/extensions/reference/declarativeContent/
[browser.userScripts]: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/userScripts

## CDN

- [UNPKG](https://unpkg.com/)
- [jsDelivr](https://www.jsdelivr.com/)
- [Skypack](https://www.skypack.dev/)
