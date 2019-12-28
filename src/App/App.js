
import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import Note from '../Note/Note';

import ApiContext from '../ApiContext'
import config from './config'
import './App.css';
import AddNote from '../AddNote/AddNote';
import AddFolder from '../AddFolder/AddFolder';
import ErrorBoundary from '../ErrorBoundary'


class App extends Component{ 
    constructor(props){
        super(props);
        this.state = {
        notes: [],
        folders: [], 
       
        }
    };

    static contextType = ApiContext    

    handleDeleteNote = noteid => {
       
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteid )
          })
        
        }
  
   
    handleAddFolder = () => {
        fetch(`${config.API_ENDPOINT}/api/folders`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          }
        })
        .then(res => {
          if (!res.ok)
            return res.json().then(e => Promise.reject(e));
          
            return res.json()
        })
        .then(folders => {
          this.setState({folders});
        })
        .catch(error => {
          console.error({ error });
        })
      }

      handleAddNote = () => {
        fetch(`${config.API_ENDPOINT}/api/notes`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          }
        })
        .then(res => {
          if (!res.ok)
            return res.json().then(e => Promise.reject(e));
          
            return res.json()
        })
        .then(notes => {
          this.setState({notes});
        })
        .catch(error => {
          console.error({ error });
        })
      }

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/api/notes`),
            fetch(`${config.API_ENDPOINT}/api/folders`)
        ])
            .then(([notesRes, foldersRes]) => {
                if (!notesRes.ok)
                    return notesRes.json().then(e => Promise.reject(e));
                if (!foldersRes.ok)
                    return foldersRes.json().then(e => Promise.reject(e));

                return Promise.all([notesRes.json(), foldersRes.json()]);
            })
            .then(([notes, folders]) => {
                this.setState({notes, folders});

            })
            .catch(error => {
                console.error({error});
            });
        
    }



    renderNavRoutes() {
        return (
            <>
                {['/', '/folders/:folderid'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route exact path="/api/folders/:folderid" component={NotePageNav} />
                <Route exact path="/api/notes/:noteid" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/api/folders/:folderid'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}

                <ErrorBoundary >
                {/* {['/api/notes/:noteid', '/api/folders/api/notes/:noteid'].map(path => ( */}
                {['/api/notes/:noteid', '/api/folders/api/notes/:noteid'].map(path => (
                <Route key={path} path={path} component={NotePageMain} />

                ))}
                </ErrorBoundary>
                <Route path="/add-folder" component={AddFolder} />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    render() {
        return (
            <ApiContext.Provider value={{
                notes: this.state.notes,
                folders: this.state.folders,
                deleteNote: this.handleDeleteNote,
                handleAddFolder: this.handleAddFolder,
                handleAddNote: this.handleAddNote
            }}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Notes</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        </ApiContext.Provider>
        );
    }
}

export default App;
