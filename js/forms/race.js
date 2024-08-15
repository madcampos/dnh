export function raceFormHandling() {
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

		if (target.matches('select:is([name="skillProficiencies"], [name="toolProficiencies"], [name="languageProficiencies"])')) {
			const selectedRace = /** @type {HTMLInputElement} */ (document.querySelector('[name="race"]:checked'));
			const relatedSelects = /** @type {HTMLSelectElement[]} */ ([...document.querySelectorAll(`#race-details-${selectedRace.value} select[name="${target.name}"]`)]);
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
