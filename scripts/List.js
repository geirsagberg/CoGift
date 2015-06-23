import component from 'omniscient';
import firebase from './firebase';
import {structure, userRef} from './appState';
import {bindArrayToCursor} from './firebaseCursor';
import classes from 'classnames';

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
      gifts.deref() && gifts.deref().map((gift) =>
        <li className={classes('gift', {selected: (gift && gift.id) === (selectedGift.deref() && selectedGift.deref().id)})} key={ gift.id } onClick={ () => selectedGift.update(() => gift) }>{ gift.title }</li>)
		}
		</ul>
).jsx;
