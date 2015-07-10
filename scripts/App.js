import LogInButton from './LogInButton';
import LogOutButton from './LogOutButton';
import component from 'omniscient';
import LoadingSpinner from './LoadingSpinner';
import './firebaseAuth';
import * as utils from './utils';
import MyList from './MyList';
import SharedList from './SharedList';

const App = component(({user, state}) => {
  const isSharedList = state.get('listId');
  const isLoggedIn = utils.isLoggedIn(user);
  const isOwner = utils.isOwner(user, state);

  return state.get('isInitialized') ?
    <div>
      {isSharedList && !isLoggedIn &&
      <div>To see {state.get('listOwner')}'s list, please log in.</div>}
      {isLoggedIn &&
      <LogOutButton />}
      {isLoggedIn ? isOwner ?
      <MyList user={user} state={state} /> :
      <SharedList state={state} /> :
      <LogInButton />}
    </div> :
    <LoadingSpinner />;
}).jsx;

export default App;
