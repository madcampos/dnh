/**
 * @param {string} step
 */
export function saveStep(step) {
	localStorage.setItem('step', step);
}

export function getCurrentStep() {
	return localStorage.getItem('step') ?? 'race';
}

export async function loadForms() {
	document.querySelectorAll('dialog').forEach((dialog) => {
		dialog.remove();
	});

	(await Promise.all([
		'01-race.html',
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

		return /** @type {HTMLDialogElement} */ (newDocument.querySelector('dialog'));
	}))).forEach((dialog) => {
		document.body.insertAdjacentElement('beforeend', dialog);
	});

	// Update all dialogs to be closed and all forms to use dialogs as targets.
	document.querySelectorAll('dialog').forEach((dialog) => {
		const savedStep = getCurrentStep();

		dialog.open = dialog.id === savedStep;

		const form = /** @type {HTMLFormElement} */ (dialog.querySelector('form'));

		form.method = 'dialog';
	});
}

/**
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} element
 */
export function loadValue(element) {
	if (!element.id) {
		return;
	}

	if (element.type === 'file') {
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

/**
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} element
 */
export function updateValue(element) {
	if (!element.id) {
		return;
	}

	if (element.type === 'file') {
		return;
	}

	if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
		document.querySelectorAll(`input[name="${element.name}"]`).forEach((curEl) => {
			localStorage.setItem(`#${curEl.id}`, 'false');
		});

		localStorage.setItem(`#${element.id}`, element.checked ? 'true' : 'false');
	} else {
		localStorage.setItem(`#${element.id}`, element.value);
	}
}

/**
 * @param {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} element
 */
export function clearValue(element) {
	if (!element.id) {
		return;
	}

	localStorage.removeItem(`#${element.id}`);
}
