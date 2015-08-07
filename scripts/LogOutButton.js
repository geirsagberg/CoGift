import component from 'omniscient';
import firebase from '../common/firebase';
import dialog from 'vex.dialog';

function logOut(confirmed) {
  if(confirmed) {
    firebase.unauth();
  }
}

function logOutDialog() {
  dialog.confirm({
    message: 'Are you sure you want to log out?',
    callback: logOut
  });
}

export default component(() =>
  <button className='btn btn-login' type='button' onClick={logOutDialog}>
    <span className='icon icon-exit' />Log out
  </button>).jsx;
