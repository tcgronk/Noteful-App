import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';


class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          hasError: false
        };
      }


    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    render() {
        console.log(this.state.hasError)
        if (this.state.hasError) {      
            return (
                <>
                <p className="err_msg">
                    <strong>Oops, looks like something went wrong!</strong>
                </p>
                <Route
                    path='/'
                   
                />
                
                </>
            );
          }
          return this.props.children;
    }
}

export default ErrorBoundary

ErrorBoundary.propTypes = {
    hasError: PropTypes.bool
};