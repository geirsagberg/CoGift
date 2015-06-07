import React from 'react';
import vex from 'vex-js';
import vexDialog from 'vex-js/js/vex.dialog';
vex.defaultOptions.className = 'vex-theme-default';

export default React.createClass({
  shareListResult(value) {
    if (value) {
      var emails = value.split(',').map(email => email.trim());
      console.dir(emails);
    }
  },

  shareList() {
    vexDialog
  .prompt({
      message: 'Share list',
      placeholder: 'father@family.com,friend@relations.com',
      callback: this.shareListResult
    });
  },

  render() {
    return <button type='button' onClick={this.shareList}>Share list</button>;
  }
});
