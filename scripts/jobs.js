import firebaseRef from '../common/firebase';
import {userRef} from './appState';
const jobs = firebaseRef.child('jobs');

export function shareList({to, token}) {
  const job = {name: 'shareList', to, token, userId: userRef.cursor().get('userId')};
  return jobs.push(job);
}
