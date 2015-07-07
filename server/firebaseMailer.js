import {sendMail} from './mailService';
import firebaseRef from '../common/firebase';

const secret = process.env.COGIFT_FIREBASE_SECRET;
if(!secret){
  throw new Error('process.env.COGIFT_FIREBASE_SECRET is missing!');
}

export function init() {
  firebaseRef.authWithCustomToken(secret, err => {
    if (err) {
      throw err;
    } else {
      firebaseRef.child('mails').on('child_added', snapshot => {
        var mail = snapshot.val();
        sendMail({
          to: mail.to,
          subject: mail.subject,
          text: mail.body
        });
      });
    }
  });
}

export default {init};
