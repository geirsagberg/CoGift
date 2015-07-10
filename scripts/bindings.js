import {structure, stateRef} from './appState';
import firebase from '../common/firebase';
import {bindArrayToCursor, bindObjectToCursor} from './firebaseCursor';

const listIdRef = structure.reference(['state', 'listId']);
const userIdRef = structure.reference(['user', 'userId']);

function bindList(ref) {
  let unbind;
  ref.observe('add', () => {
    const userId = ref.cursor().deref();
    const giftsRef = firebase.child(`users/${userId}/gifts`);
    unbind = bindArrayToCursor(giftsRef, stateRef.cursor('gifts'));
  });

  ref.observe('delete', () => {
    if (unbind) { unbind(); }
    unbind = null;
  });
}

export function bindMyList(){
  bindList(userIdRef);
}

export function bindSharedList(){
  bindList(listIdRef);
}

export function bindListOwner(userId){
  const listOwnerRef = firebase.child(`users/${userId}/displayName`);
  bindObjectToCursor(listOwnerRef, stateRef.cursor('listOwner'));
}
