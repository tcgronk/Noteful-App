import React from  'react';
import config from '../config'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types';


export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      push : () => {},
      note: {
      title: "",
      content: "",
      folderId:"",
      formValid: false, 
      titleValid: false, 
      contentValid: false, 
      folderSelectValid: false,
      validationMessage: ''
      }
    };
  }

  static contextType = ApiContext



  updateFormEntry(e) {       
    const name = e.target.folderSelect;
    const value = e.target.value;
    let id;
    if (e.target.selectedOptions) {
        id = e.target.selectedOptions[0].id;
        this.setState({
            'folderId': id 
        })
    }
    this.setState({
        [e.target.name]: e.target.value,
        
    }, () => {this.validateEntry(name, value)});
}

validateEntry(name, value) {
    let hasErrors = false;

    value = value.trim();
    if((name === 'title') || (name === 'content')) {
        if (value.length < 1) {
            hasErrors = true
        } 

        else {
            hasErrors = false
        }
    }
    
    else if((name === 'folderSelect') && (value === 'Select')) {
        hasErrors = true
    }
    
    else {
        hasErrors = false
    }
    
    this.setState({
        [`${name}Valid`]: !hasErrors,
    }, this.formValid() );
}

formValid() {
    const { titleValid, contentValid, folderSelectValid } = this.state;
    if (titleValid && contentValid && folderSelectValid === true){
        this.setState({
            formValid: true,
            validationMessage: "Note Saved"
        });
    }
    else {this.setState({
        formValid: !this.formValid,
        validationMessage: 'All fields are required.'
    })}
  }
 

  handleSubmit(e) {
    e.preventDefault();
    const { title, content, folderId } = this.state;
    const note = {
        title: title,
        content: content,
        folder_id: folderId,
        modified: new Date()
    }
    this.setState({error: null})
    const url =`${config.API_ENDPOINT}/notes`
    const options = {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
      }
    };

    fetch(url, options)
      .then(res => {
        if(!res.ok) {
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
      .then(data => {
        this.context.addNote(data);
      })
      .catch(err => {
        this.setState({
          error: err.message
        });
      });
  }

  

   

  handleCancelAdd = () => {
    this.props.history.push(`/`)
  }

  render() {
    const folders = this.context.folders
    const message = this.state.validationMessage
    const options = folders.map((folder) => {
      return(
        <option
          key= {folder.id}
          id = {folder.id}>
          {folder.name}
        </option>
      )
    })
    const error = this.state.error
          ? <div className="error">{this.state.error}</div>
          : "";

    return (
      <div className="addnote">
        <h2>Add Note</h2>
        { error }
        <form className="addnote__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="noteName">Note Name:{" "}</label>
          <input
            type="text"
            name="note"
            id="note"
            placeholder="Note Name"
            onChange={e => this.updateFormEntry(e)}/>
          <label htmlFor="content"><br />Note: {" "}<br/></label>
            <textarea 
                className="field"
                name="content" 
                id="content"
                placeholder="Note content"
                onChange={e => this.updateFormEntry(e)}/>
          <label htmlFor="folder-select"><br/>Folder:{" "}<br/></label>
            <select
            type='text'
            className='field'
            name='folderSelect'
            id='folderSelect'
            ref={this.folderSelect}
            onChange={e => this.updateFormEntry(e)}>
                <option>Select Folder</option>
                { options }
            </select>
          <div className="addnote__buttons">
            <button type='button' onClick={e => this.handleCancelAdd()}>Cancel</button>
            <button type="submit"  disabled={this.state.formValid} >Save</button>
          {message}
          </div>  
        </form>
      </div>
    );
  }
}

AddNote.propTypes ={
  title: PropTypes.string,
  content: PropTypes.string,
  folder_id: PropTypes.string,
  formValid: PropTypes.bool,
  titleValid: PropTypes.bool,
  contentValid: PropTypes.bool,
  folderSelectValid:PropTypes.bool,
  validationMessage: PropTypes.string
}