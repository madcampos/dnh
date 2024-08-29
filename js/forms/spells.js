import { getCharacterObject } from '../character.js';

function updateAvailableSpells() {
	const spellsList = /** @type {HTMLDivElement} */ (document.querySelector('#spells-list'));
	const currentClass = getCharacterObject().class;

	spellsList.dataset['class'] = currentClass;
}

function clearOtherClassesSpells() {
	const currentClass = getCharacterObject().class;

	/** @type {NodeListOf<HTMLInputElement>}*/ (document.querySelectorAll(`#spell-list dt:not([data-classes~="${currentClass}"]) input`)).forEach((input) => {
		input.checked = false;
	});
}

export function spellsFormHandling() {
	updateAvailableSpells();
	clearOtherClassesSpells();

	// @ts-expect-error
	document.addEventListener('dnd-next-step', (/** @type {CustomEvent} */ evt) => {
		const nextForm = evt.detail;

		if (nextForm === 'spells') {
			updateAvailableSpells();
			clearOtherClassesSpells();
		}
	});
}
