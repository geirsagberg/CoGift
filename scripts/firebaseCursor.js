import {bindAsArray, unbind} from '../common/firebase';

export function bindArrayToCursor(firebaseRef, cursor) {
  bindAsArray(firebaseRef, array => cursor.update(() => array));
  return () => unbind(firebaseRef);
}
