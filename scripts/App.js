import List from './List';
import Login from './Login';
import ShareListButton from './ShareListButton';
import firebase from '../common/firebase';
import component from 'omniscient';
import LoadingSpinner from './LoadingSpinner';
import './firebaseAuth';

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

const App = component(({user, state}) => {
  const isLoggedIn = !!user.get('authData');
  const isOwner = isLoggedIn && (!state.get('listId') || state.get('listId') === user.get('userId'));
  const gifts = state.cursor('gifts');

  return state.get('isInitialized') ?
    <div>
      {isLoggedIn && <ShareListButton />}
      <Login user={user} />
      {isLoggedIn &&
      <div className='listWrapper'>
        {isOwner &&
        <form onSubmit={e => onSubmit(e, user, state)}>
          <input className='giftInput' onChange={e => state.set('text', e.currentTarget.value)} value={state.get('text')} />
        </form>}
        <List gifts={gifts} selectedGift={state.cursor('selectedGift')} />
      </div>}
    </div> :
    <LoadingSpinner />;
}).jsx;

export default App;
