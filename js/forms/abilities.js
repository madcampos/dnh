import { character } from '../character.js';

export function abilitiesFormHandling() {
	// @ts-expect-error
	document.addEventListener('dnd-next-step', (/** @type {CustomEvent} */ evt) => {
		const nextForm = evt.detail;

		if (nextForm === 'abilities') {
			// TODO: apply asi changes
		}
	});
}
