import component from 'omniscient';
import firebase from './firebase';
import { userRef, structure } from './appState';

firebase.onAuth(authData => {
  const userCursor = userRef.cursor();
  if (authData) {
    // Find existing user by provider-spesific uid
    firebase.child(`userMappings/${authData.uid}`).once('value', value => {
      structure.cursor('state').set('isInitialized', true);
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
    structure.cursor('state').set('isInitialized', true);
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
  let isLoggedIn = user.has('authData');
  return (
    <button className='btn btn-login' type='button' onClick={isLoggedIn ? logOut : logIn}>
        {isLoggedIn ? 'Log out' : 'Log in with Google'}
    </button>
  );
}).jsx;
