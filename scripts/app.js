import React from 'react';
import List from './List';
import Login from './Login';
import ShareListButton from './ShareListButton';
import sendMail from './mail';
import ReactFireMixin from 'reactfire';
import toastr from 'toastr';
import {encodeHtml} from '../common/utils';
import firebase from './firebase';
import component from 'omniscient';

function onSubmit(e, user, state) {
  e.preventDefault();
  var text = state.get('text');
  if (text) {
    firebase.child(`users/${user.get('userId')}/gifts`).push({
      title: text
    });
    state.set('text', '');
  }
}

const App = component(({user, state}) =>
  <div>
    <Login user={user} />
    {user.get('authData') &&
    <div>
      <div>Welcome, {user.get('authData').google.displayName}!</div>
      <form onSubmit={e => onSubmit(e, user, state)}>
        <input onChange={e => state.set('text', e.currentTarget.value)} value={state.get('text')} />
      </form>
      <List gifts={user.cursor('gifts')} />
    </div>}
  </div>
).jsx;

const App2 = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount() {
    firebase.onAuth(authData => {
      if (authData === null) {
        this.setState({
          user: null
        });
      } else {
        firebase.child(`userMappings/${authData.uid}`).once('value', value => {
          var userId = value.val();
          if (!userId) {
            var user = firebase.child(`users`).push();
            userId = user.key();
            user.child(`userMappings/${authData.provider}`).set(authData.uid);
            firebase.child(`userMappings/${authData.uid}`).set(userId);
          }
          this.giftData = firebase.child(`users/${userId}/gifts`);

          this.setState({
            user: authData
          });
          this.bindAsArray(this.giftData, 'gifts');
        });
      }
    });
  },
  addGift(title) {
    if(!this.state.user) {
      throw new Error('User must be logged in to add gifts.');
    }
    var userId = this.getUserRef().key();
    firebase.child(`users/${userId}/gifts`);
  },
  getUserRef() {
    return this.state.user && firebase.child(`users/${this.state.user.uid}`);
  },
  componentWillUnmount() {
    firebase.off();
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
      var tokenRef = firebase.child('tokens').push();
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
        <Login firebase={firebase} user={this.state.user} />
        {this.state.user && list}
      </div>
    );
  }
});

export default App;
