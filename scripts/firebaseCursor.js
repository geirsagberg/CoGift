import firebase, {bindAsArray, bindAsObject, unbind} from '../common/firebase';

function bindCursorOnAuth(firebaseRef, cursor, bind) {
  firebase.onAuth(authData => {
    if(authData){
      bind(firebaseRef, cursor);
    } else {
      unbind(firebaseRef);
    }
  });
}

function bindArray(firebaseRef, cursor) {
  bindAsArray(firebaseRef, array => cursor.update(() => array));
}

export function bindArrayToCursor(firebaseRef, cursor) {
  bindCursorOnAuth(firebaseRef, cursor, bindArray);
}

function bindObject(firebaseRef, cursor) {
  bindAsObject(firebaseRef, obj => cursor.update(() => obj));
}

export function bindObjectToCursor(firebaseRef, cursor) {
  bindObject(firebaseRef, cursor, bindObject);
}
