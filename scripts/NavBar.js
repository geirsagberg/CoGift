import component from 'omniscient';
import classes from 'classnames';
import ShareListButton from './ShareListButton';
import LogOutButton from './LogOutButton';
import Page from 'page';

function navigate(url) {
  return function() {
    Page(url);
  };
}

const NavItem = component(({page, currentPage, key}) =>
  <li className={classes('navItem', {active: currentPage === key})} onClick={navigate(page.get('url'))}>
    {page.get('title')}
  </li>
);

export default component(({pages, currentPage}) =>
  <div className="navBar">
    <ul className="navList">
      {pages.map((page, key) => NavItem({page, currentPage, key}))}
    </ul>
    <div className="navButtons">
      <ShareListButton />
      <LogOutButton />
    </div>
  </div>
).jsx;