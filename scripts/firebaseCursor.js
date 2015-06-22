import {bindAsArray, unbind} from './firebase';

export function bindArrayToCursor(firebaseRef, cursor) {
  bindAsArray(firebaseRef, array => cursor.update(() => array));
  return () => unbind(firebaseRef);
}
