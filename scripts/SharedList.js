import component from 'omniscient';
import List from './List';

export default component(({state}) => {
  return (
  <div className='listWrapper'>
    <div>{state.get('listOwner')}'s wish list</div>
    <List gifts={state.cursor('gifts')} selectedGift={state.cursor('selectedGift')} />
  </div>
  );
}).jsx;
