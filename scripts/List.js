import component from 'omniscient';
import firebase from '../common/firebase';
import {structure, stateRef} from './appState';
import {bindArrayToCursor} from './firebaseCursor';
import classes from 'classnames';

const userIdRef = structure.reference(['user', 'userId']);
var unbind;

//TODO: Observer listId instead
userIdRef.observe('add', () => {
  var userId = userIdRef.cursor().deref();
  let giftsRef = firebase.child(`users/${userId}/gifts`);
  unbind = bindArrayToCursor(giftsRef, stateRef.cursor('gifts'));
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
