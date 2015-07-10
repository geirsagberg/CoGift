import 'babel/polyfill';
import React from 'react';
import App from './App';
import toastr from 'toastr';
import Pace from 'pace';
import page from 'page';
import { onUpdate, userRef, stateRef } from './appState';
import { bindMyList, bindSharedList, bindListOwner } from './bindings';

// Make React DevTools work
window.React = React;

require('vex').defaultOptions.className = 'vex-theme-default';

toastr.options = {
  positionClass: 'toast-bottom-full-width'
};
Pace.options = {
  ajax: {
    trackMethods: ['GET', 'POST', 'DELETE', 'PUT']
  }
};
Pace.start();

function render() {
  React.render(<App user={userRef.cursor()}
    state={stateRef.cursor()} />, document.getElementById('main'));
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
page('/*', render);
page.start();
