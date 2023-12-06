import { IUserScriptListItem } from '@src/contract.js'
import { Store, createStoreContext } from 'extra-react-store'

interface IState {
  userScripts: IUserScriptListItem[]
  nameFilter: string
}

export class OptionsStore extends Store<IState> {
  constructor() {
    super({
      userScripts: []
    , nameFilter: ''
    })
  }
}

export const OptionsStoreContext = createStoreContext<IState>()
