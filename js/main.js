import { loadCharacter, updateCharacter } from './character.js';
import { clearValue, loadForms, loadValue, saveStep, shouldUpdateCharacter, updateValue } from './forms.js';
import { raceFormHandling } from './forms/race.js';

document.addEventListener('DOMContentLoaded', async () => {
	loadCharacter();
	await loadForms();

	/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (
		document.querySelectorAll('input, select, textarea')
	).forEach((element) => {
		loadValue(element);
	});

	// Save to local storage when updating a field
	document.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ (evt.target);

		updateValue(target);
	});

	// Switch to next form when submitting a form
	document.addEventListener('submit', async (evt) => {
		const form = /** @type {HTMLFormElement} */ (evt.target);
		const submitterButton = /** @type { HTMLButtonElement} */ (evt.submitter);
		const nextForm = /** @type {HTMLDialogElement} */ (document.getElementById(submitterButton.dataset.target ?? ''));

		if (shouldUpdateCharacter(nextForm.id)) {
			await updateCharacter(new FormData(form));
			saveStep(nextForm.id);
		}

		/** @type {HTMLDialogElement} */ (form.parentElement).open = false;
		nextForm.open = true;
	});

	// Clear saved data on reset
	document.addEventListener('reset', (evt) => {
		const form = /** @type {HTMLFormElement} */ (evt.target);

		/** @type {NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */ (
			form.querySelectorAll('input, select, textarea')
		).forEach((element) => {
			clearValue(element);
		});
	});

	raceFormHandling();
});
