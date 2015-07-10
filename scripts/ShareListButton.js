import component from 'omniscient';
import dialog from 'vex.dialog';
import * as jobs from './jobs';

function shareList(value) {
  if (!value) {
    return;
  }
  const emails = value.split(',').map(e => e.trim());
  emails.forEach(email => {
    jobs.shareList({to: email});
  });
}

function shareListDialog() {
  dialog.prompt({
    message: 'Share list with:',
    placeholder: 'Email addresses, comma-separated',
    callback: shareList
  });
}

export default component(() => <button type='button' className='btn' onClick={shareListDialog}>Share list</button>).jsx;
