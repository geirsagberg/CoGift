import Firebase from 'firebase';
import Fireproof from 'fireproof';
import {map, assign} from 'lodash';
import bluebird from 'bluebird';
Fireproof.bless(bluebird);

function _bind(firebaseRef, setValue, isArray) {
  var key = firebaseRef.key();
  firebaseRef.on('value', dataSnapshot => {
    let value = dataSnapshot.val();
    if (isArray) {
      value = map(value, (obj, index) =>
        assign({ id: index }, obj));
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

export default new Fireproof(new Firebase('https://intense-heat-531.firebaseio.com/'));
