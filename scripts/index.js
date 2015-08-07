import 'babel/polyfill';
import React from 'react';
import App from './App';
import Pace from 'pace';
import page from 'page';
import { onUpdate, userRef, stateRef, structure } from './appState';
import { bindMyList, bindSharedList, bindListOwner } from './bindings';
import './registerToasts';
import $ from 'jquery';
import attachFastClick from 'fastclick';

// Make React DevTools work
window.React = React;

require('vex').defaultOptions.className = 'vex-theme-top';

//$(() => attachFastClick(document.body));

Pace.options = {
  ajax: {
    trackMethods: ['GET', 'POST', 'DELETE', 'PUT']
  }
};
Pace.start();

function render() {
  React.render(<App user={userRef.cursor()} state={stateRef.cursor()} pages={structure.cursor('pages')} />,
    document.getElementById('app'));
}
onUpdate(render);

page('/list/:id', context => {
  bindSharedList();
  bindListOwner(context.params.id);
  stateRef.cursor().set('listId', context.params.id);
});
page('/', () => {
  bindMyList();
});
page.start();

render();
