import component from 'omniscient';
import firebase from './firebase';
import {structure, userRef} from './appState';
import {bindArrayToCursor} from './firebaseCursor';

const userIdRef = structure.reference(['user', 'userId']);
var unbind;

userIdRef.observe('add', () => {
  var userId = userIdRef.cursor().deref();
  let giftsRef = firebase.child(`users/${userId}/gifts`);
  unbind = bindArrayToCursor(giftsRef, userRef.cursor('gifts'));
});

userIdRef.observe('delete', () => {
  if(unbind) {
    unbind();
  }
  unbind = null;
});

export default component(({gifts, selectedGift}) =>
    <ul className="list">
		{
      gifts.deref() && gifts.deref().map((gift, index) =>
        <li className="gift { selectedGift === gift && 'selected'}" key={ index } onClick={ () => selectedGift.update(() => gift) }>{ gift.title }</li>)
		}
		</ul>
).jsx;
