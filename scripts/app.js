/* global Firebase:false */
import React from 'react';
import List from './List';
import Login from './Login';
import ShareListButton from './ShareListButton';
// import Firebase from 'client-firebase';
import 'firebase';
import sendMail from './mail';
import ReactFireMixin from 'reactfire';
import toastr from 'toastr';
toastr.options = {
  positionClass: 'toast-bottom-full-width'
};
import {encodeHtml} from '../common/utils';
import Pace from 'pace';
require('vex').defaultOptions.className = 'vex-theme-default';

Pace.options = {
  ajax: {
    trackMethods: ['GET', 'POST', 'DELETE', 'PUT']
  }
};
Pace.start();

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
            user: authData
          });
          this.bindAsArray(this.giftData, 'gifts');
        });
      }
    });
  },

  getUserRef() {
    return this.state.user && this.firebase.child(`users/${this.state.user.uid}`);
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
  onShareList(value) {
    if (value) {
      // var token = Math.random().toString(36).substr(6);
      var tokenRef = this.firebase.child('tokens').push();
      tokenRef.set(this.state.user.uid);
      var token = tokenRef.key();
      var emails = value.split(',').map(e => e.trim());
      const subject = 'Shared list';
      const body = `${this.state.user.google.displayName} has shared a list with you!\n\n` +
      `Go to ${window.location.href}${token} to see the list.`;
      emails.forEach(email => {
        sendMail({
            to: email,
            subject,
            body
          })
          .then(() => {
            toastr.success('Email sent to ' + encodeHtml(email));
          })
          .catch(error => {
            toastr.error(`Email not sent to ${encodeHtml(email)}: ${error}`);
          });
      });
    }
  },
  render() {
    var list = (
      <div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
        </form>
        <List gifts={this.state.gifts} />
        <ShareListButton onShareList={this.onShareList} />
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
