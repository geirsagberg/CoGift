import firebase from '../common/firebase';
import {firebaseSecret} from './config.js';

firebase.authWithCustomToken(firebaseSecret, err => {
  if(err) {
    throw err;
  }
});
