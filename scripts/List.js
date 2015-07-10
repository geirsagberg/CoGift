import component from 'omniscient';
import classes from 'classnames';

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
