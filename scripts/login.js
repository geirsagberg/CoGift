import component from 'omniscient';
import firebase from './firebase';
import { userRef } from './appState';

firebase.onAuth(authData => {
  const userCursor = userRef.cursor();
  if (authData) {
    // Find existing user by provider-spesific uid
    firebase.child(`userMappings/${authData.uid}`).once('value', value => {
      let userId = value.val();
      if (!userId) {
        // Add new user mapped to provider
        const user = firebase.child(`users`).push();
        userId = user.key();
        user.child(`userMappings/${authData.provider}`).set(authData.uid);
        firebase.child(`userMappings/${authData.uid}`).set(userId);
      }
      userCursor.set('authData', authData);
      userCursor.set('userId', userId);
    });
  } else {
    userCursor.delete('authData');
    userCursor.delete('userId');
  }
});

function logIn() {
  firebase.authWithOAuthPopup('google', (error) => {
    if (error) {
      console.log('logIn failed: ', error);
    }
  }, {
    scope: 'email'
  });
}

function logOut() {
  firebase.unauth();
}

export default component(({user}) => {
  return (
    user.has('authData') ?
    <button type='button' onClick={logOut}>
        Log out
    </button> :
    <button type='button' onClick={logIn}>
        Log in with Google
    </button>
  );
}).jsx;
