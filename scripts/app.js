/* global Firebase:false */
import React from 'react';
import List from './list';
import Login from './login';
import ShareListButton from './shareListButton';
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
      if (authData === null) {
        this.setState({
          user: null
        });
      } else {
        this.firebase.child(`userMappings/${authData.uid}`).once('value', value => {
          var userId = value.val();
          if (!userId) {
            var user = this.firebase.child(`users`).push();
            userId = user.key();
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
    var list = (
      <div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
        </form>
        <List gifts={this.state.gifts} />
        <ShareListButton user={this.state.user} />
      </div>
    );
    return (
      <div>
        <Login firebase={this.firebase} user={this.state.user} />
        {this.state.user && list}
			</div>
    );
  }
});

React.render(<App />, document.getElementById('main'));
