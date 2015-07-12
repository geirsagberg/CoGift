import {sendMail} from './mailService';
import firebaseRef from '../common/firebase';
import {serverUrl} from './config';
import urlJoin from 'url-join';

const jobs = firebaseRef.child('jobs');

function shareList({to, userId}, jobRef) {
  const userRef = firebaseRef.child(`users/${userId}`);
  const notifications = userRef.child('notifications');
  userRef.once('value')
    .then(data => {
      const user = data.val();
      const name = user.displayName;
      const subject = `${name} has shared a wish list with you`;
      const listUrl = urlJoin(serverUrl, 'list', userId);
      const body = `${name} has shared a wish list with you.\n\nGo to ${listUrl} to see the list.`;
      return jobRef.update({status: 'inProgress'})
      .then(() => sendMail({to: to, subject, body}));
    })
    .then(() => jobRef.update({status: 'completed'}))
    .then(() => notifications.push({type: 'success', message: 'Wish list shared with ' + to}))
    .catch(error => {
      console.log('Error when handling job: ', error);
      return jobRef.update({status: 'failed', error})
      .then(() => notifications.push({type: 'error', message: `Failed to share wish list with ${to}: ${error.toString()}`}));
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
    jobs.off('child_added', handleJob);
  } else {
    jobs.on('child_added', handleJob);
  }
});
