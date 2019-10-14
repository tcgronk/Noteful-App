import React from 'react'

export default React.createContext({
  notes: [],
  folders: [],
  handleAddFolder: () => {},
  handleAddNote: () => {},
  handleDeleteNote: () => {},
  setShowAddForm: () => {}
})