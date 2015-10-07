import LogInButton from './LogInButton';
import component from 'omniscient';
import LoadingSpinner from './LoadingSpinner';
import './firebaseAuth';
import * as utils from './utils';
import MyList from './MyList';
import SharedList from './SharedList';
import NavBar from './NavBar';

const App = component(({user, state, pages}) => {
  const isSharedList = state.get('listId');
  const isLoggedIn = utils.isLoggedIn(user);
  const isOwner = utils.isOwner(user, state);

  return state.get('isInitialized') ?
    <div>{isLoggedIn &&
      <NavBar pages={pages} currentPage={state.cursor('currentPage')} />}
      {isSharedList && !isLoggedIn &&
      <div>To see {state.get('listOwner')}'s list, please log in.</div>}
      {isLoggedIn ? isOwner ?
      <MyList user={user} state={state} /> :
      <SharedList state={state} /> :
      <LogInButton />}
    </div> :
    <LoadingSpinner />;
}).jsx;

export default App;
