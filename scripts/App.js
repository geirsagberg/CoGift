import List from './List';
import Login from './Login';
import ShareListButton from './ShareListButton';
import firebase from './firebase';
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

const App = component(({user, state}) =>
  state.get('isInitialized') ?
  <div>
    {user.get('authData') &&
    <div className='listWrapper'>
      <form onSubmit={e => onSubmit(e, user, state)}>
        <input className='giftInput' onChange={e => state.set('text', e.currentTarget.value)} value={state.get('text')} />
      </form>
      <List gifts={user.cursor('gifts')} selectedGift={state.cursor('selectedGift')} />
    </div>}
    <Login user={user} />
    <ShareListButton />
  </div> :
  <LoadingSpinner />
).jsx;

export default App;
