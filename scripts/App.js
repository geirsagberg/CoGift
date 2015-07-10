import List from './List';
import Login from './Login';
import ShareListButton from './ShareListButton';
import firebase from '../common/firebase';
import component from 'omniscient';
import LoadingSpinner from './LoadingSpinner';
import './firebaseAuth';
import * as utils from './utils';

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
  const isLoggedIn = utils.isLoggedIn(user);
  const isOwner = utils.isOwner(user, state);
  const gifts = state.cursor('gifts');
  const userName = !isOwner && state.get('listOwner');

  return state.get('isInitialized') ?
    <div>
      {isOwner && <ShareListButton />}
      {!isLoggedIn &&
      <div>To see {userName}´s list, please log in.</div>}
      <Login user={user} />
      {isLoggedIn &&
      <div className='listWrapper'>
        {isOwner ?
        <form onSubmit={e => onSubmit(e, user, state)}>
          <input className='giftInput' onChange={e => state.set('text', e.currentTarget.value)} value={state.get('text')} />
        </form> :
        <div>{userName}´s wish list</div>}
        <List gifts={gifts} selectedGift={state.cursor('selectedGift')} />
      </div>}
    </div> :
    <LoadingSpinner />;
}).jsx;

export default App;
