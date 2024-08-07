export async function loadForms() {
	await Promise.all([
		'02-class.html',
		'03-abilities.html',
		'04-description.html',
		'05-equipment.html',
		'06-spells.html',
		'summary.html'
	].map(async (page) => {
		const response = await fetch(page);
		const text = await response.text();
		const parser = new DOMParser();
		const newDocument = parser.parseFromString(text, 'text/html');
		const formDialog = /** @type {HTMLDialogElement} */ (newDocument.querySelector('dialog'));

		document.body.insertAdjacentElement('beforeend', formDialog);
	}));

	// Update all dialogs to be closed and all forms to use dialogs as targets.
	document.querySelectorAll('dialog').forEach((dialog) => {
		const savedStep = localStorage.getItem('step') ?? 'race';

		dialog.open = dialog.id === savedStep;

		const form = /** @type {HTMLFormElement} */ (dialog.querySelector('form'));

		form.method = 'dialog';
	});
}

export function loadValue(/** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ element) {
	if (!element.id) {
		return;
	}

	const savedValue = localStorage.getItem(`#${element.id}`);

	if (savedValue) {
		if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
			element.checked = savedValue === 'true';
		} else {
			element.value = savedValue;
		}
	}
}

export function updateValue(/** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ element) {
	if (!element.id) {
		return;
	}

	if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
		localStorage.setItem(`#${element.id}`, element.checked ? 'true' : 'false');
	} else {
		localStorage.setItem(`#${element.id}`, element.value);
	}
}

export function clearValue(/** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ element) {
	if (!element.id) {
		return;
	}

	localStorage.removeItem(`#${element.id}`);
}

export function saveStep(/** @type {string} */ step) {
	const previousSteps = JSON.parse(localStorage.getItem('step') ?? '[]');
	const updatedSteps = [...new Set([...previousSteps, step])];

	localStorage.setItem('step', JSON.stringify(updatedSteps));
}

export function shouldUpdateCharacter(/** @type {string} */ step) {
	const steps = JSON.parse(localStorage.getItem('step') ?? '[]');

	return !steps.includes(step);
}
