import React from  'react';
import config from '../config'
import ApiContext from '../ApiContext'
import './AddFolder.css'


export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      hasErrors: true,
      formValid:false ,
      validationMessage: "",
      push : () => {},
      
    };
  }

  static contextType = ApiContext


  validateEntry(e) {
    let name=e.target.value
    let length = name.trim();
    let folders=this.context.folders
    for(let i=0; i<folders.length; i++){
      if(name===folders[i].name){
        this.setState({
          validationMessage:`Folder Name must be at least 1 character.`,
          hasErrors:true,
          formValid:false
        })
      }
    }

    if (length.length < 1 ) {
      this.setState({
        validationMessage:`Folder Name must be at least 1 character.`,
        hasErrors:true,
        formValid:false
      })
    }

    else this.setState({
        validationMessage: 'Valid Entry',
        hasErrors: false,
        formValid:true
    })

  }
  
  handleCancelAdd = () => {
      this.props.history.push(`/`)
  }
  

  handleSubmit(e) {
    e.preventDefault();
    const folder = {name:e.target['folder'].value}
    const url =`${config.API_ENDPOINT}/folders`
    const options = {
      method: 'POST',
      body: JSON.stringify(folder),
      headers: {
        "Content-Type": "application/json",
      }
    };
    
    if(this.state.hasErrors===false){
    fetch(url, options)
      .then(console.log(url,options))
      .then(res => {
        if(!res.ok) {
          throw new Error('Something went wrong, please try again later');
        }
        return res.json();
      })
     
      .then(folder => {
          this.context.handleAddFolder(folder);
          this.props.history.push(`/folder/${folder.id}`)
          this.setState({
            validationMessage: 'Saved!'
          });
        })
      .catch(err => {
        this.setState({
          validationMessage: 'Unable to save folder, please try again'
        });
      });
  }
  else this.setState({
    validationMessage: 'Unable to save folder'
  })
}

 


  render() {
    const error = this.state.validationMessage
    const folders=[]
    for (let i=0; i<this.context.folders.length; i++){
      folders.push(this.context.folders[i].name)
    }
    const foldersArray=folders.map((folder)=> {
    return(<li>{folder}</li>)})
  

    return (
      <div className="addfolder">
        <h2>Add Folder</h2>
        { error } 
        <br/>
        <form className="addfolder__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="folderName">Folder Name:{" "}</label>
          <input
            required
            type="text"
            name="folder"
            id="folder"
            placeholder="Folder Name"
            value={this.state.folder}
            onChange={e => this.validateEntry(e)}/>

          <div className="addfolder__buttons">
            <br/>
          
            <button type='button' onClick={e => this.handleCancelAdd()}>Cancel</button>
            <span>{" "}</span>
            <button type="submit" disabled={!this.state.formValid} >Save</button>
            
          </div>
          <br/>
          <ul> Existing Folders:<br/><br/>
            {foldersArray}
          </ul>

        </form>
      </div>
    );
  }
}

