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
    this.listData = new Firebase('https://intense-heat-531.firebaseio.com/');
  },

  componentWillUnmount() {
    this.listData.off();
  },

  getInitialState() {
    return {
      text: '',
      gifts: []
    };
  },

  login() {
  	this.listData.authWithOAuthPopup('google', (error, authData) => {
  		if(error){
  			console.log('Login failed: ', error);
  		} else {
  			this.giftData = this.listData.child(`users/${authData.uid}`);
  			this.bindAsArray(this.giftData, 'gifts');
  			this.setState({
  				user: authData.uid
  			});
  		}
  	});
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
					<form onSubmit={this.onSubmit} >
						<input onChange={this.onChange} value={this.state.text} />
					</form>
					<List gifts={this.state.gifts} />
				</div>
	    );
  	} else {
  		return (
  			<div>
  				<button type='button' onClick={this.login} >
  					Log in with Google
  				</button>
  			</div>
  		);
  	}
    
  }
});

React.render(<App />, document.getElementById('main'));
