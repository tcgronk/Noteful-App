import React from  'react';
import config from '../config'
import ApiContext from '../ApiContext'
import './AddFolder.css'

export default class AddFolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folder: "",
      hasErrors: true,
      formValid:false ,
      validationMessage: "",
      push : () => {},
      
    };
  }

  static contextType = ApiContext
 

  nameChanged(e) {           
    const name = e.target.folder;
    const value = e.target.value;
    this.setState({
        [e.target.name]: e.target.value
    }, () => {this.validateEntry(name, value)});
}

  validateEntry(name, value) {
      let inputErrors;
      let hasErrors = this.state.hasErrors;

      value = value.trim();
      if (value < 1) {
          inputErrors = `${name} is required.`;
    
      } 
      
      else {
          inputErrors = 'Saved';
          hasErrors = false;
      }
      this.setState({
          validationMessage: inputErrors,
          [`${name}Valid`]: !hasErrors,
          hasErrors: !hasErrors
      }, this.formValid );
  }

  formValid() {
      const { titleValid } = this.state;
      if (titleValid === true){
          this.setState({
              formValid: true
          });
      }
      else {this.setState({
          formValid: !this.formValid
          }
      )}
    }




  handleSubmit(e) {
    e.preventDefault();
    const folder = (({folder}) => ({folder}))(this.state);
    this.setState({error: null})
    const url =`${config.API_ENDPOINT}/api/folders`
    const options = {
      method: 'POST',
      body: JSON.stringify(folder),
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
        this.setState({
          name: "",
        });
        this.context.addFolder(data);
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

  //   componentDidMount() {
  //     // fake date loading from API call
  //     setTimeout(() => this.setState(dummyStore), 600);
  // }


  render() {
    const error = this.state.error
          ? <div className="error">{this.state.error}</div>
          : "";
    

    return (
      <div className="addfolder">
        <h2>Add Folder</h2>
        { error } 
        <form className="addfolder__form" onSubmit={e => this.handleSubmit(e)}>
          <label htmlFor="folderName">Folder Name:{" "}</label>
          <input
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

