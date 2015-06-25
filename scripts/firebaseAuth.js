import firebase from './firebase';
import {userRef, structure} from './appState';

firebase.onAuth(authData => {
  const userCursor = userRef.cursor();
  const userAuthenticated = !!authData;
  if (userAuthenticated) {
    // Find existing user by provider-spesific uid
    firebase.child(`userMappings/${authData.uid}`).once('value', snapshot => {
      structure.cursor('state').set('isInitialized', true);
      let userId = snapshot.val();
      if (!userId) {
        // User does not exist in Firebase; Add new user mapped to provider
        const user = firebase.child(`users`).push();
        userId = user.key();
        user.child(`userMappings/${authData.provider}`).set(authData.uid);
        firebase.child(`userMappings/${authData.uid}`).set(userId);
      }
      userCursor.set('authData', authData);
      userCursor.set('userId', userId);
    });
  } else {
    // User is not logged in
    structure.cursor('state').set('isInitialized', true);
    userCursor.delete('authData');
    userCursor.delete('userId');
  }
});