'use strict';
import $ from 'jquery';
window.$ = window.jQuery = $; // Necessary for bootstrap.js
require('bootstrap');
require('bootstrap-select')
import React from 'react-with-addons';
import List from './views/list';
// import Firebase from 'client-firebase';
import 'firebase';
import ReactFireMixin from 'reactfire';

// Make React DevTools work
window.React = React;

var App = React.createClass({
	mixins: [ReactFireMixin],
  componentWillMount() {
    this.firebase = new Firebase('https://intense-heat-531.firebaseio.com/');
    this.firebase.onAuth(authData => {
      if(authData === null){
        this.setState({
          user: null
        });
      } else {
        this.firebase.child(`userMappings/${authData.uid}`).once('value', value => {
          var userId = value.val();
          if (!userId) {
            var user = this.firebase.child(`users`).push();
            var userId = user.key();
            user.child(`userMappings/${authData.provider}`).set(authData.uid);
            this.firebase.child(`userMappings/${authData.uid}`).set(userId);
          }
          this.giftData = this.firebase.child(`users/${userId}/gifts`);

          this.setState({
            user: userId
          });
          this.bindAsArray(this.giftData, 'gifts');
        });
      }
    });
    var authData = this.firebase.getAuth();
  },

  componentWillUnmount() {
    this.firebase.off();
  },

  getInitialState() {
    return {
      text: '',
      gifts: []
    };
  },

  logIn() {
  	this.firebase.authWithOAuthPopup('google', (error, authData) => {
  		if(error){
  			console.log('logIn failed: ', error);
  		}
  	}, {
      scope: "email"
    });
  },

  logOut() {
    this.firebase.unauth();
  },

  onChange(e) {
    this.setState({
      text: e.target.value
    });
  },

  onSubmit(e) {
    e.preventDefault();
    this.giftData.push({
    	title: this.state.text
    });
    this.setState({
      text: ''
    });
  },

  render() {
  	if (this.state.user) {
	  	return (
	      <div>
          <button type='button' onClick={this.logOut}>Log out</button>
					<form onSubmit={this.onSubmit}>
						<input onChange={this.onChange} value={this.state.text} />
					</form>
					<List gifts={this.state.gifts} />
          <button type='button' onClick={this.shareList}>Share list</button>
				</div>
	    );
  	} else {
  		return (
  			<div>
  				<button type='button' onClick={this.logIn}>
  					Log in with Google
  				</button>
  			</div>
  		);
  	}
    
  }
});

React.render(<App />, document.getElementById('main'));
