import {bindAsArray, bindAsObject, unbind} from '../common/firebase';

export function bindArrayToCursor(firebaseRef, cursor) {
  bindAsArray(firebaseRef, array => cursor.update(() => array));
  return () => unbind(firebaseRef);
}

export function bindObjectToCursor(firebaseRef, cursor) {
  bindAsObject(firebaseRef, obj => cursor.update(() => obj));
  return () => unbind(firebaseRef);
}
