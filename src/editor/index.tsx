import '@src/globals.css'
import { createRoot } from 'react-dom/client'
import { Editor } from '@components/editor.jsx'
import { assert } from '@blackglory/prelude'

const main = document.querySelector('main')
assert(main, 'The main element not found')

const id = new URL(document.URL).searchParams.get('id')
assert(id)

const referrer = new URL(document.URL).searchParams.get('referrer')

const root = createRoot(main)
root.render(
  <Editor
    id={id}
    referrer={referrer ?? undefined}
  />
)
