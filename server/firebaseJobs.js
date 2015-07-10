import {sendMail} from './mailService';
import firebaseRef from '../common/firebase';
import {serverUrl} from './config';
import urlJoin from 'url-join';

const jobs = firebaseRef.child('jobs');

function shareList({to, userId}, jobRef) {
  const userRef = firebaseRef.child(`users/${userId}`);
  userRef.once('value')
    .then(data => {
      jobRef.update({status: 'inProgress'});
      const user = data.val();
      const name = user.displayName;
      const subject = `${name} has shared a wishlist with you`;
      const listUrl = urlJoin(serverUrl, 'list', userId);
      const body = `${name} has shared a wishlist with you.\n\nGo to ${listUrl} to see the list.`;
      return sendMail({to: to, subject, body});
    })
    .then(() => {
      return jobRef.update({status: 'completed'});
    })
    .catch(error => {
      console.log('Error when handling job: ' + error);
      jobRef.update({status: 'failed', error});
    });
}

function handleJob(snapshot) {
  const job = snapshot.val();
  if (!job.status) {
    switch(job.name) {
      case 'shareList':
        shareList(job, snapshot.ref());
        break;
      default:
        console.log('Unknown job: ' + job.name);
        break;
    }
  }
}

firebaseRef.onAuth(authData => {
  if (!authData) {
    jobs.off('child_added');
  } else {
    jobs.on('child_added', handleJob);
  }
});
