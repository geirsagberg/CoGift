import component from 'omniscient';
import firebase from '../common/firebase';

function logIn() {
  firebase.authWithOAuthPopup('google', (error) => {
    if (error) {
      console.log('logIn failed: ', error);
    }
  }, { scope: 'email' });
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
