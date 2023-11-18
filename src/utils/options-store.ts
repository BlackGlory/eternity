import { IUserScriptListItem } from '@src/contract.js'
import { Store, createStoreContext } from 'extra-react-store'

interface IState {
  userScripts: IUserScriptListItem[]
}

export class OptionsStore extends Store<IState> {
  constructor() {
    super({ userScripts: [] })
  }
}

export const OptionsStoreContext = createStoreContext<IState>()
