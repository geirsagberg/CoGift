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
import Cookies from 'cookies-js';

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
        this.setState({
          user: authData.uid
        });
        this.giftData = this.firebase.child(`users/${authData.uid}`);
        this.bindAsArray(this.giftData, 'gifts');
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
          <button type='button' onClick={this.logOut}>
            Log out
          </button>
					<form onSubmit={this.onSubmit}>
						<input onChange={this.onChange} value={this.state.text} />
					</form>
					<List gifts={this.state.gifts} />
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
