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

export default component(({gifts}) =>
    <ul className="list">
		{
      gifts.deref() && gifts.deref().map((gift, index) =>
        <li className="gift" key={ index }>{ gift.title }</li>)
		}
		</ul>
).jsx;
