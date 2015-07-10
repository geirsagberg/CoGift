export function isLoggedIn(user) {
  return !!user.get('authData');
}

export function isOwner(user, state) {
  return isLoggedIn(user) && (!state.get('listId') || state.get('listId') === user.get('userId'));
}
