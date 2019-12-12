
export const findFolder = (folders=[], folderid) =>
  folders.find(folder => folder.folderid == folderid)

export const findNote = (notes=[], noteid) =>
  notes.find(note => note.id == noteid)

export const getNotesForFolder = (notes=[], folderid) => (
  (!folderid)
    ? notes
    : notes.filter(note => note.folderid == folderid)
)

export const countNotesForFolder = (notes=[], folderid) =>
  
  notes.filter(note => note.folderid == folderid).length
  
