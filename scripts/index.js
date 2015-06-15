/* global Firebase:false */
import React from 'react';
import App from './App';
// import Firebase from 'client-firebase';
import 'firebase';
import toastr from 'toastr';
import Pace from 'pace';
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

// Make React DevTools work
window.React = React;

var firebase = new Firebase('https://intense-heat-531.firebaseio.com/');

React.render(<App firebase={firebase} />, document.getElementById('main'));
