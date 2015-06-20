import React from 'react';
import App from './App';
import toastr from 'toastr';
import Pace from 'pace';
import page from 'page';
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

page('/', context => {

});
page.start();

// Make React DevTools work
window.React = React;


React.render(<App />, document.getElementById('main'));
