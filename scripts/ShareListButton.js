import component from 'omniscient';
import dialog from 'vex.dialog';
import firebase from '../common/firebase';
import {userRef} from './appState';
import {sendMail} from './jobs';

function shareList(value) {
  if (!value) {
    return;
  }

  const tokenRef = firebase.child('tokens').push();
  tokenRef.set(userRef.cursor('userId').deref());
  const token = tokenRef.key();
  const emails = value.split(',').map(e => e.trim());
  emails.forEach(email => {
    sendMail({to: email, token});
  });
}

function shareListDialog() {
  dialog.prompt({
    message: 'Share list with:',
    placeholder: 'Email addresses, comma-separated',
    callback: shareList
  });
}

export default component(() => <button type='button' className='btn' onClick={shareListDialog}>Share list</button>).jsx;
