import component from 'omniscient';
import firebase from '../common/firebase';

function logOut() {
  firebase.unauth();
}

export default component(() =>
  <button className='btn btn-login' type='button' onClick={logOut}>Log out</button>).jsx;
