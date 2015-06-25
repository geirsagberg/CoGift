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
  if (unbind) {
    unbind();
  }
  unbind = null;
});

export default component(({gifts, selectedGift}) => {
  const isSelected = gift => (gift && gift.id) === (selectedGift.deref() && selectedGift.deref().id);
  return <ul className="list">
    {
      gifts.deref() && gifts.deref().map((gift) =>
        <li className={classes('gift', {selected: isSelected(gift)})}
          key={gift.id}
          onClick={() => selectedGift.update(() => isSelected(gift) ? undefined : gift)}>
          {gift.title}
        </li>)
    }
  </ul>;
}).jsx;
