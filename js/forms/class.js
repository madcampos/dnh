import { disableChildInputs, disableSelectedProficiency, enableChildInputs } from './utils.js';

function getCurrentLevel() {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-magic-numbers
	return Math.max(1, Math.min(Number.parseInt(/** @type {HTMLInputElement | null} */ (document.querySelector('[name="level"]'))?.value || '1'), 20));
}

function getLevelSelector() {
	const currentLevel = getCurrentLevel();

	return new Array(currentLevel).fill(undefined).map((_, index) => `[data-level="${index + 1}"]`).join(', ');
}

function getSelectedClass() {
	return /** @type {HTMLInputElement | null} */ (document.querySelector('[name="class"]:checked'))?.value ?? '';
}

export function classFormHandling() {
	const classContainer = /** @type {HTMLDialogElement} */ (document.querySelector('#class'));

	classContainer.dataset['currentLevel'] = getCurrentLevel().toString();
	enableChildInputs(`#class-features-${getSelectedClass()} :is(${getLevelSelector()})`);

	document.querySelector('[name="level"]')?.addEventListener('input', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		classContainer.dataset['currentLevel'] = target.value;

		disableChildInputs('.class-features');
		enableChildInputs(`#class-features-${getSelectedClass()} :is(${getLevelSelector()})`);
	});

	document.querySelector('#class')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('[name="class"], [name="level"]')) {
			disableChildInputs('.class-features');
			enableChildInputs(`#class-features-${getSelectedClass()} :is(${getLevelSelector()})`);
		}

		disableSelectedProficiency(target, `#class-features-${getSelectedClass()}`);
	});
}
