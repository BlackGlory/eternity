# Eternity
![eternity-logo]

A minimalist JavaScript user script loader and manager for modern browsers.

In order to use this extension, you need Chrome 120 or above, and [developer mode] enabled.

[developer mode]: https://developer.chrome.com/docs/extensions/reference/userScripts/#developer-mode-for-extension-users
[eternity-logo]: src/assets/images/icon-128.png

## Supported browsers and platforms
- [x] Chrome

## When do you need this?
When you want to load normal JavaScript scripts as user scripts, and
- You need [ES modules].
- You don't need [Greasemonkey API].
- You always want user scripts to run as early as possible.

[ES modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[Greasemonkey API]: https://wiki.greasespot.net/Greasemonkey_Manual:API

## Example
```js
// @name Hello World
// @match <all_urls>
import { addStyleSheet } from 'https://esm.sh/userstyle@0.2.1'

addStyleSheet(`
  *:before {
    content: 'Hello'
  }

  *:after {
    content: 'World'
  }
`)
```

## Metadata
You need to write the metadata as comments at the beginning of the script,
refer to the example for the format.

### @name
The name of the user script.

### @match
Specifies which pages this user script will be injected into.

See [Chrome Extensions match patterns].

[Chrome Extensions match patterns]: https://developer.chrome.com/docs/extensions/mv3/match_patterns/

You can specify multiple patterns via multiple `@match`.

### @update-url
The update URL of the user script.
It is optional, Eternity accesses the URL to keep the user script up to date.

You can specify multiple update URLs via multiple `@update-url`.
Eternity will check them one by one in order until a usable user script is found.
