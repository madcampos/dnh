export function classFormHandling() {
	const classContainer = /** @type {HTMLDialogElement} */ (document.querySelector('#class'));

	classContainer.dataset.jsUpdateLevel = '';

	const startingLevel = /** @type {HTMLInputElement | null} */ (document.querySelector('[name="level"]'))?.value ?? '1';

	classContainer.dataset.currentLevel = startingLevel;

	// Handle class features enabling
	const selectedClass = /** @type {HTMLInputElement | null} */ (document.querySelector('[name="class"]:checked'));

	if (selectedClass) {
		// @ts-expect-error
		/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
			document.querySelectorAll(`#class-features-${selectedClass.value} :is(input, select)`)
		).forEach((element) => {
			element.disabled = false;
		});
	}

	document.querySelector('[name="level"]')?.addEventListener('input', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		classContainer.dataset.currentLevel = target.value;

		// @ts-expect-error
		/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
			document.querySelectorAll('.class-features :is(input, select)')
		).forEach((element) => {
			element.disabled = true;
		});

		const currentLevel = Number.parseInt(/** @type {HTMLInputElement | null} */ (document.querySelector('[name="level"]'))?.value ?? '1');
		const levelsSelector = new Array(currentLevel).fill(undefined).map((_, index) => `[data-level="${index + 1}"]`).join(', ');

		// @ts-expect-error
		/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
			document.querySelectorAll(`#class-features-${target.value} :is(${levelsSelector}) :is(input, select)`)
		).forEach((element) => {
			element.disabled = false;
		});
	});

	document.querySelector('#class')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('[name="class"]')) {
			// @ts-expect-error
			/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
				document.querySelectorAll('.class-features :is(input, select)')
			).forEach((element) => {
				element.disabled = true;
			});

			const currentLevel = Number.parseInt(/** @type {HTMLInputElement | null} */ (document.querySelector('[name="level"]'))?.value ?? '1');
			const levelsSelector = new Array(currentLevel).fill(undefined).map((_, index) => `[data-level="${index + 1}"]`).join(', ');

			// @ts-expect-error
			/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
				document.querySelectorAll(`#class-features-${target.value} :is(${levelsSelector}) :is(input, select)`)
			).forEach((element) => {
				element.disabled = false;
			});
		}

		if (target.matches('select:is([name="skillProficiencies"], [name="toolProficiencies"], [name="languageProficiencies"])')) {
			const selectedClass = /** @type {HTMLInputElement} */ (document.querySelector('[name="class"]:checked'));
			const relatedSelects = /** @type {HTMLSelectElement[]} */ ([...document.querySelectorAll(`#class-features-${selectedClass.value} select[name="${target.name}"]`)]);
			const selectedValues = relatedSelects.map((select) => select.value);

			relatedSelects.forEach((select) => {
				[...select.options].forEach((option) => {
					option.disabled = false;

					const optionValue = option.value || option.innerText;

					if (select.value !== optionValue && selectedValues.includes(optionValue)) {
						option.disabled = true;
					}
				});
			});
		}
	});
}
