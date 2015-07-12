import firebaseRef from '../common/firebase';
import NProgress from 'nprogress';
import {userRef} from './appState';
const jobs = firebaseRef.child('jobs');

export function shareList({to}) {
  NProgress.start();
  const job = {name: 'shareList', to, userId: userRef.cursor().get('userId')};
  return jobs.push(job);
}
