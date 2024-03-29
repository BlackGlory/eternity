import '@src/globals.css'
import { createRoot } from 'react-dom/client'
import { Options } from '@components/options.jsx'
import { assert } from '@blackglory/prelude'
import { OptionsStore, OptionsStoreContext } from '@utils/options-store.js'

const main = document.querySelector('main')
assert(main, 'The main element not found')

const root = createRoot(main)
root.render(
  <OptionsStoreContext.Provider value={new OptionsStore()}>
    <Options />
  </OptionsStoreContext.Provider>
)
