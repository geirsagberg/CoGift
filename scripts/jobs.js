import firebaseRef from '../common/firebase';
import {userRef} from './appState';

export default function shareList({to, token}) {
  return firebaseRef.child('methods').push({method: 'shareMail', to, token, userId: userRef.cursor().get('userId')});
}
