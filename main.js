document.addEventListener('DOMContentLoaded', async () => {
	// Download other forms
	await Promise.all(['class.html', 'abilities.html', 'description.html', 'equipment.html', 'spells.html', 'summary.html'].map(async (page) => {
		const response = await fetch(page);
		const text = await response.text();
		const parser = new DOMParser();
		const newDocument = parser.parseFromString(text, 'text/html');
		const formDialog = /** @type {HTMLDialogElement} */ (newDocument.querySelector('dialog'));

		document.body.insertAdjacentElement('beforeend', formDialog);
	}));

	// Get data from local storage
	// @ts-expect-error
	/** @type {(HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[]} */ (document.querySelectorAll(':is(input, select, textarea):not([disabled])')).forEach((element) => {
		const savedItem = localStorage.getItem(`${element.name}`);

		if (savedItem) {
			if (element.type === 'radio') {
				const selectedElement = /** @type {HTMLInputElement} */ (
					/** @type {HTMLInputElement[]} */ (
						[...document.querySelectorAll(`input[type="radio"][name="${element.name}"]`)]
					).find((
						radio
					) => radio.value === savedItem)
				);

				selectedElement.checked = true;
			} else {
				element.value = savedItem;
			}
		}
	});

	// Update all dialogs to be closed and all forms to use dialogs as targets.
	document.querySelectorAll('dialog').forEach((dialog, index) => {
		if (index !== 0) {
			dialog.open = false;
		}

		const form = /** @type {HTMLFormElement} */ (dialog.querySelector('form'));

		form.method = 'dialog';
	});

	// Switch to next form when submitting a form
	document.addEventListener('submit', (evt) => {
		const form = /** @type {HTMLFormElement} */ (evt.target);
		const submitterButton = /** @type { HTMLButtonElement} */ (evt.submitter);
		const nextForm = /** @type {HTMLDialogElement} */ (document.getElementById(submitterButton.dataset.target ?? ''));

		console.log(Object.fromEntries((new FormData(form)).entries()));

		/** @type {HTMLDialogElement} */ (form.parentElement).open = false;
		nextForm.open = true;
	});

	// Save to local storage when updating a field
	document.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} */ (evt.target);

		localStorage.setItem(target.name, target.value);
	});

	// Handle racial features enabling
	const selectedRace = /** @type {HTMLInputElement | null} */ (document.querySelector('[name="race"]:checked'));

	if (selectedRace) {
		// @ts-expect-error
		/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
			document.querySelectorAll(`#race-details-${selectedRace.value} :is(input, select)`)
		).forEach((element) => {
			element.disabled = false;
		});
	}

	document.querySelector('#race')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('[name="race"]')) {
			// @ts-expect-error
			/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
				document.querySelectorAll('.race-details :is(input, select)')
			).forEach((element) => {
				element.disabled = true;
			});

			// @ts-expect-error
			/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
				document.querySelectorAll(`#race-details-${target.value} :is(input, select)`)
			).forEach((element) => {
				element.disabled = false;
			});
		}
	});
});
