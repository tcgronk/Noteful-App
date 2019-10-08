
import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import ApiContext from '../ApiContext'
import config from './config'
import './App.css';
import AddNote from '../AddNote/AddNote';
import AddFolder from '../AddFolder/AddFolder';
import ErrorBoundary from '../ErrorBoundary'


class App extends Component {
    state = {
        notes: [{"name": 'note1',  "modified": '6 Oct 2019',"id":"a2", "content":'hi',"folderId":"a1"}],
        folders: [{"id":"a1", "name":"Tess"}], 
        showAddForm: false,
        errorBoundaryKey: 0,

    };

    setShowAddForm(show) {
        this.setState({
          showAddForm: show
        });
      }

    addFolder(folder){
        this.setState({
            folders: [...this.state.folders, folder],
            showAddForm: true
            
        })
    };

    addNote = note => {
        this.setState({
          notes: [...this.state.notes, note]
        });
      };

    

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        });
    };


    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
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
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route exact path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}

                <ErrorBoundary key={this.state.errorBoundaryKey}>
                <Route path="/note/:noteId" component={NotePageMain} />
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
                addFolder: this.addFolder,
            }}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
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
