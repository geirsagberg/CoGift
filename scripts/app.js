'use strict';
import $ from 'jquery';
window.$ = window.jQuery = $; // Necessary for bootstrap.js
require('bootstrap');
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
    this.bindAsArray(this.listData, 'gifts');
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

  onChange(e) {
    this.setState({
      text: e.target.value
    });
  },

  onSubmit(e) {
    e.preventDefault();
    this.listData.push(this.state.text);
    this.setState({
      text: ''
    });
  },

  render() {
    return (
      <div>
				<form onSubmit={this.onSubmit} >
					<input onChange={this.onChange} value={this.state.text} />
				</form>
				<List gifts={this.state.gifts} />
			</div>
    );
  }
});

React.render(<App />, document.getElementById('main'));
