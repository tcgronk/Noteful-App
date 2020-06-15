import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApiContext from '../ApiContext'
import config from '../config'
import './Note.css'

export default class Note extends React.Component {
  constructor(props){
    super(props);
    this.state={
      link: this.props.link
    }
  }
  static defaultProps ={
    onDeleteNote: () => {},
  }
  static contextType = ApiContext;

  handleClickDelete = e => {
    e.preventDefault()
    const noteid = this.props.id
    fetch(`${config.API_ENDPOINT}/api/notes/${noteid}`, {
      method: 'DELETE',
      
      headers: {
        'content-type': 'application/json'
      },
    })
  
      .then(res => {
        if(!res.ok) {
          return res.json().then(e => Promise.reject(e))
        }
      })
      .then(() => {
        
        this.context.deleteNote(noteid)
        this.props.onDeleteNote(noteid)
        
      })
      .catch(error => {
        console.error({ error })
      })

  }


  disableLink=()=>{
    if(this.state.link===true){
      this.setState({link: false})
    }
    else(this.setState({link: true}))
  }


  render() {
    console.log(this.state.link)
    const { name,id, modified,link } = this.props
    return (
      <div className='Note'>
       
          {(this.state.link===true)
           ?  <h2 className='Note__title'><Link to={`api/notes/${id}`} onClick={this.disableLink}>{name}</Link></h2>
           :  <h2 className='Note__title'>{name}</h2>
          }
        
        
        <button
          className='Note__delete'
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
      </div>
    )
  }
} 

