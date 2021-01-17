import * as React from 'react'
import { useState, useLayoutEffect } from 'react'
import { Editor } from './editor'
import * as DAO from '@shared/dao'

interface IEditingScript {
  id?: DAO.IUserScript['id']
  name: DAO.IUserScript['name']
  code: DAO.IUserScript['code']
}

export const Options: React.FC = () => {
  const [list, setList] = useState<DAO.IUserScript[]>([])
  const [editingScript, setEditingScript] = useState<IEditingScript>()

  useLayoutEffect(() => {
    loadUserScripts()
  }, [])

  return (
    <div>
      <div>
        <button onClick={setEditingNewScript}>New</button>
      </div>
      <ul>
        {list.map(script =>
          <li key={script.id}>
            <input type="checkbox" checked={script.enabled} onChange={() => toggleScriptEnabled(script)} />
            <span>{script.name}</span>
            <button onClick={() => setEditingExistScript(script)}>Edit</button>
            <button onClick={() => deleteUserScriptById(script.id)}>Delete</button>
          </li>
        )}
      </ul>
      {editingScript &&
        <Editor
          name={editingScript.name}
          code={editingScript.code}
          onSave={newCode => saveUserScript(editingScript, newCode)}
          onCancel={() => setEditingScript(undefined)}
        />
      }
    </div>
  )

  async function toggleScriptEnabled(script: DAO.IUserScript) {
    if (script.enabled) {
      await DAO.disableUserScript(script.id)
    } else {
      await DAO.enableUserScript(script.id)
    }
    await loadUserScripts()
  }

  function setEditingExistScript(script: DAO.IUserScript) {
    setEditingScript({
      id: script.id
    , name: script.name
    , code: script.code
    })
  }

  function setEditingNewScript() {
    setEditingScript({
      name: 'New'
    , code: ''
    })
  }

  async function saveUserScript(script: IEditingScript, newCode: string) {
    if (script.id === undefined) {
      await DAO.insertUserScript(newCode)
    } else {
      await DAO.updateUserScript(script.id, newCode)
    }
    setEditingScript(undefined)
    await loadUserScripts()
  }

  async function deleteUserScriptById(id: number) {
    await DAO.deleteUserScript(id)
    await loadUserScripts()
  }

  async function loadUserScripts() {
    const scripts = await DAO.listAllUserScripts()
    setList(scripts)
  }
}
