# Elden
Modern ECMAScript loader.

## Why
I need [ES modules] and I don't care about [Greasemonkey API].

[ES modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[Greasemonkey API]: https://wiki.greasespot.net/Greasemonkey_Manual:API

## Example
```js
// @name Hollowing
// @match https://github.com/*
// @match https://www.reddit.com/r/*
import { addStyleSheet } from 'https://unpkg.com/userstyle@0.1.1/dist/es2018/index.min.mjs'

addStyleSheet(`
  *:before {
    content: 'OHHH'
  }

  *:after {
    content: 'ELDEN RING'
  }
`)
```

## Metadata
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
- [jsDelivr](https://www.jsdelivr.com/)
- [Skypack](https://www.skypack.dev/)
- [esm.sh](https://esm.sh/)
