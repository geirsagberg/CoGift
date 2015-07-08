import firebaseRef from '../common/firebase';

export default function sendMail({to, subject, body}) {
  return firebaseRef.child('mails').push({to, subject, body});
}
