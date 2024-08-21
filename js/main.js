import { updateCharacter } from './character.js';
import { clearValue, loadForms, loadValue, saveStep, updateValue } from './forms.js';
import { abilitiesFormHandling } from './forms/abilities.js';
import { classFormHandling } from './forms/class.js';
import { descriptionFormHandling } from './forms/description.js';
import { raceFormHandling } from './forms/race.js';
import { summaryFormHandling } from './forms/summary.js';

document.addEventListener('DOMContentLoaded', async () => {
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
		const nextForm = /** @type {HTMLDialogElement} */ (document.getElementById(submitterButton.dataset['target'] ?? ''));

		await updateCharacter();
		saveStep(nextForm.id);

		/** @type {HTMLDialogElement} */ (form.parentElement).open = false;
		nextForm.open = true;

		document.dispatchEvent(new CustomEvent('dnd-next-step', { detail: nextForm.id }));
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
	classFormHandling();
	abilitiesFormHandling();
	descriptionFormHandling();
	summaryFormHandling();
});
