import component from 'omniscient';
import firebase from '../common/firebase';

const options = { scope: 'openid,email,profile' };

function logIn() {
  firebase.authWithOAuthPopup('google', error => {
    if (error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        // fall-back to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        firebase.authWithOAuthRedirect('google', error => {
          if (error)
            console.log('login failed: ', error);
        }, options);
      }
      console.log('logIn failed: ', error);
    }
  }, options);
}

export default component(() =>
    <button className='btn btn-login' type='button' onClick={logIn}>
        Log in with Google
    </button>
).jsx;
