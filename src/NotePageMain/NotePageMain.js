import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote } from '../notes-helpers'
import PropTypes from 'prop-types'
import './NotePageMain.css'
import config from '../config'

export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    },

  }
  static contextType = ApiContext;

  
  handleDeleteNote = noteid => {
    this.props.history.push(`/`)
  }

  render() {
  
    const { notes } =this.context
    const  noteId  = this.props.match.params
    const noteid = parseInt(noteId.noteid,10)
    const note = findNote(notes, noteid) || { content: '' }
    return (
      <section className='NotePageMain'>
        <Note
          id={noteid}
          name={note.notename}
          modified={note.modified}
          onDeleteNote={this.handleDeleteNote}
        />
       
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
    
      </section>
    )
  }
}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}
NotePageMain.propType = {
  push: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired

};