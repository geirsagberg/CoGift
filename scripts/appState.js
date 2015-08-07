import immstruct from 'immstruct';

export const structure = immstruct('CoGift', {
  pages: [
    { title: 'My list' },
    { title: 'Shared lists' }
  ]
});

export function onUpdate(callback) {
	structure.on('next-animation-frame', callback);
}

export const userRef = structure.reference('user');

export const stateRef = structure.reference('state');

export function onAuth(loginCallback, logoutCallback) {
  const userIdRef = structure.reference(['user', 'userId']);
  userIdRef.observe('add', () => {
    loginCallback(userIdRef.cursor().deref());
  });
  userIdRef.observe('delete', () => {
    logoutCallback(userIdRef.cursor().deref());
  });
}

export default { onUpdate, userRef, stateRef, structure };
