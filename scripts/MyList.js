import component from 'omniscient';
import firebase from '../common/firebase';
import ShareListButton from './ShareListButton';
import List from './List';

function onSubmit(e, user, state) {
  e.preventDefault();
  var text = state.get('text');
  if (text) {
    firebase.child(`users/${user.get('userId')}/gifts`).push({
      title: text
    });
    state.set('text', '');
  }
}

export default component(({user, state}) => {
  return (
  <div className='listWrapper'>
    <form onSubmit={e => onSubmit(e, user, state)}>
      <input className='giftInput' onChange={e => state.set('text', e.currentTarget.value)} value={state.get('text')} />
    </form>
    <List gifts={state.cursor('gifts')} selectedGift={state.cursor('selectedGift')} />
  </div>
  );
}).jsx;
