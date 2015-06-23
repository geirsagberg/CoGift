import React from 'react';
import dialog from 'vex.dialog';

export default React.createClass({
    onShareList() {
      dialog.prompt({
        message: 'Share list with:',
        placeholder: 'Email addresses, comma-separated',
        callback: this.props.onShareList
      });
    },

    render() {
      return <button type='button' onClick={this.onShareList}>Share list</button>;
    }
});
