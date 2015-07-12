import toastr from 'toastr';
import {onAuth} from './appState';
import firebase from '../common/firebase';
import {encodeHtml} from '../common/utils';

toastr.options = {
  positionClass: 'toast-bottom-full-width'
};

let unbind;

function onLogin(userId) {
  const notifications = firebase.child(`users/${userId}/notifications`);
  notifications.on('child_added', snapshot => {
    const notification = snapshot.val();
    switch (notification.type) {
      case 'success':
        toastr.success(encodeHtml(notification.message));
        break;
      case 'error':
        toastr.error(encodeHtml(notification.message));
        break;
    }
    snapshot.ref().remove();
  });

  unbind = () => notifications.off('child_added');
}

function onLogout() {
  if(unbind) { unbind(); }
  unbind = null;
}

onAuth(onLogin, onLogout);
