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

export default component(() =>
    <button className='btn btn-login' type='button' onClick={logIn}>
        Log in with Google
    </button>
).jsx;

