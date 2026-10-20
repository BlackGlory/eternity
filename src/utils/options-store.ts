import { IUserScriptListItem } from '@src/contract.js'
import { Store, createStoreContext } from 'extra-react-store'

interface IState {
  userScripts: IUserScriptListItem[]
  nameFilter: string
  activeTabURL: string | null
}

export class OptionsStore extends Store<IState> {
  constructor() {
    super({
      userScripts: []
    , nameFilter: ''
    , activeTabURL: null
    })
  }
}

export const OptionsStoreContext = createStoreContext<IState>()
