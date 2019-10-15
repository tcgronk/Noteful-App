import React from  'react';
import config from '../config'
import ApiContext from '../ApiContext'
import './AddFolder.css'


export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folders:[],
      id:"",
      name: "",
      hasErrors: true,
      formValid:false ,
      validationMessage: "",
      push : () => {},
      
    };
    // this.nameChanged = this.nameChanged.bind(this)
  }

  static contextType = ApiContext
 

  nameChanged = (e) => { 
            
    const name = e.target.value;
    console.log(name)
    this.setState({
        value: name,
    }, () => {this.validateEntry(name)});
}

  validateEntry(name) {
    let inputErrors="";
    let hasErrors = this.state.hasErrors;
    let length = name.trim();

    this.setState({
      validationMessage: "",
      hasErrors: hasErrors,
   })
    
    // let foldersArr=this.context.folders
    // let duplicate= false
    // for(let i=0; i<foldersArr.length; i++){
    //   if(name===foldersArr[i].name){
    //     duplicate=true;
    //   }
    
    // if(duplicate=true){
    //   inputErrors='Folder name must be unique'
    //   hasErrors=true;
    // }
    //   else duplicate=false;
    // }
      
      if (length.length < 1) {
          inputErrors = `Folder Name must be at least 1 character.`;
          hasErrors=true;
    
      }
      
     
      else {inputErrors = 'Valid Entry';
      hasErrors = false}

     
      this.setState({
          validationMessage: inputErrors,
          hasErrors: hasErrors,
      })
  }


    handleCancelAdd = () => {
      this.props.history.push(`/`)
    }
  

  handleSubmit(e) {
    e.preventDefault();
    const folder = {name:e.target['folder'].value}
    this.setState({error: null})
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
          console.log("saved")
        })
      .catch(err => {
        this.setState({
          validationMessage: err.message
        });
      });
  }
  else( this.setState({
    validationMessage: `Unable to save: ${this.state.validationMessage}`}))
}

 


  render() {
    const error = this.state.validationMessage
    

    return (
      <div className="addfolder">
        <h2>Add Folder</h2>
        { error } 
        <form className="addfolder__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="folderName">Folder Name:{" "}</label>
          <input
            required
            type="text"
            name="folder"
            id="folder"
            placeholder="Folder Name"
            value={this.state.folder}
            onChange={e => this.nameChanged(e)}/>

          <div className="addfolder__buttons">
            
          
            <button type='button' onClick={e => this.handleCancelAdd()}>Cancel</button>
            <button type="submit" disabled={this.state.formValid} >Save</button>
      
          </div>  
        </form>
      </div>
    );
  }
}

