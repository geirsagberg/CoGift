import component from 'omniscient';
import firebase from '../common/firebase';

const options = { scope: 'openid,email,profile' };

function logIn() {
  firebase.authWithOAuthPopup('google', (error) => {
    if (error) {
      console.log('logIn failed: ', error);
    }
  }, options);
}

function logOut() {
  firebase.unauth();
}

export default component(({user}) => {
  const isLoggedIn = user.has('authData');
  return (
    <button className='btn btn-login' type='button' onClick={isLoggedIn ? logOut : logIn}>
        {isLoggedIn ? 'Log out' : 'Log in with Google'}
    </button>
  );
}).jsx;
