import {sendMail} from './mailService';
import firebaseRef from '../common/firebase';
import {serverUrl} from '../config';
import urlJoin from 'url-join';

const methodsRef = firebaseRef.child('methods');
function handleMethod(snapshot) {
  const methodCall = snapshot.val();
  const userRef = firebaseRef.child(`users/${methodCall.userId}`);
  if (!methodCall.status && !methodCall.status !== 'failed') {
    switch(methodCall.method) {
      case 'shareList':
        userRef.once('value')
          .then(data => {
            userRef.update({status: 'inProgress'});
            const user = data.val();
            const name = `${user.firstName} ${user.lastName}`;
            const subject = `${name} has shared a wishlist with you`;
            const listUrl = urlJoin(serverUrl, 'list', methodCall.token);
            const body = `${name} has shared a wishlist with you.\n\nGo to ${listUrl} to see the list.`;
            return sendMail({to: methodCall.to, subject, body});
          })
          .then(() => userRef.update({status: 'completed'}))
          .catch(error => {
            console.log('Error when handling method: ' + error);
            userRef.update({status: 'failed', error});
          });
        break;
      default:
        console.log('Unknown method: ' + methodCall.method);
        break;
    }
  }
}

firebaseRef.onAuth(authData => {
  if (!authData) {
    methodsRef.off('child_added');
  } else {
    methodsRef.on('child_added', handleMethod);
  }
});
