/**
 * @param {HTMLSelectElement | HTMLInputElement} target
 * @param {string} containerSelector
 */
export function disableSelectedProficiency(target, containerSelector) {
	if (target.matches('select:is([name="skillProficiencies"], [name="toolProficiencies"], [name="languageProficiencies"])')) {
		const relatedSelects = /** @type {HTMLSelectElement[]} */ ([...document.querySelectorAll(`${containerSelector} select[name="${target.name}"]`)]);
		const selectedValues = relatedSelects.map((select) => select.value);

		relatedSelects.forEach((select) => {
			[...select.options].forEach((option) => {
				if (!option.value) {
					return;
				}

				option.disabled = false;

				const optionValue = option.value || option.innerText;

				if (select.value !== optionValue && selectedValues.includes(optionValue)) {
					option.disabled = true;
				}
			});
		});
	}
}

/**
 * @param {string} baseSelector
 */
export function enableChildInputs(baseSelector) {
	// @ts-expect-error
	/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
		document.querySelectorAll(`${baseSelector} :is(input, select)`)
	).forEach((element) => {
		element.disabled = false;
	});
}

/**
 * @param {string} baseSelector
 */
export function disableChildInputs(baseSelector) {
	// @ts-expect-error
	/** @type {(HTMLInputElement | HTMLSelectElement)[]} */ (
		document.querySelectorAll(`${baseSelector} :is(input, select)`)
	).forEach((element) => {
		element.disabled = true;
	});
}
