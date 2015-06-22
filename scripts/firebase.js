/* global Firebase:false */
import 'firebase';
import {toArray} from '../common/utils';

function _bind(firebaseRef, setValue, isArray) {
  var key = firebaseRef.key();
  firebaseRef.on('value', dataSnapshot => {
    let value = dataSnapshot.val();
    if (isArray) {
      value = toArray(value);
    }
    setValue(value);
  });
  return key;
}

export function unbind(firebaseRef) {
  if(firebaseRef){
    firebaseRef.off('value');
  }
}

export function bindAsArray(firebaseRef, setValue) {
  return _bind(firebaseRef, setValue, true);
}

export function bindAsObject(firebaseRef, setValue) {
  return _bind(firebaseRef, setValue, false);
}

export default new Firebase('https://intense-heat-531.firebaseio.com/');
