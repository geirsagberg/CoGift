import component from 'omniscient';
import dialog from 'vex.dialog';
import firebase from './firebase';
import { userRef } from './appState';
import sendMail from './mail';
import toastr from 'toastr';
import { encodeHtml } from '../common/utils';

function shareList(value) {
  if (!value) {
    return;
  }

  const tokenRef = firebase.child('tokens').push();
  tokenRef.set(userRef.cursor('userId').deref());
  const token = tokenRef.key();
  const emails = value.split(',').map(e => e.trim());
  const subject = 'Shared list';
  const body = `${userRef.cursor('authData').deref().google.displayName} has shared a list with you!\n\n` +
    `Go to ${window.location.href}${token} to see the list.`;
  emails.forEach(email => {
    sendMail({
        to: email,
        subject,
        body
      }).then(() => {
        toastr.success('Email sent to ' + encodeHtml(email));
      }).catch(error => {
        toastr.error(`Email not sent to ${encodeHtml(email)}: ${error}`);
      });
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
