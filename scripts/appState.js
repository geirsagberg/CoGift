import immstruct from 'immstruct';

export const structure = immstruct('CoGift', {});

export function onUpdate(callback) {
	structure.on('next-animation-frame', callback);
}

export const userRef = structure.reference('user');

export const stateRef = structure.reference('state');

export default { onUpdate, userRef, stateRef, structure };
