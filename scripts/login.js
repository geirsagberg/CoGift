import React from 'react';

export default React.createClass({
  logIn() {
      this.props.firebase.authWithOAuthPopup('google', (error, authData) => {
        if (error) {
          console.log('logIn failed: ', error);
        }
      }, {
        scope: "email"
      });
    },
    logOut() {
      this.props.firebase.unauth();
    },
    render() {
      return (
        this.props.user ?
        <button type='button' onClick={this.logOut}>
          Log out
        </button> :
        <button type='button' onClick={this.logIn}>
          Log in with Google
        </button>
      );
    }
});
