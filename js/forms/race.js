import { disableChildInputs, disableSelectedProficiency, enableChildInputs } from './utils.js';

function getSelectedRace() {
	return /** @type {HTMLInputElement | null} */ (document.querySelector('[name="race"]:checked'))?.value ?? '';
}

export function raceFormHandling() {
	enableChildInputs(`#race-details-${getSelectedRace()}`);

	document.querySelector('#race')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('[name="race"]')) {
			disableChildInputs('.race-details');
			enableChildInputs(`#race-details-${target.value}`);
		}

		const selectedRace = /** @type {HTMLInputElement} */ (document.querySelector('[name="race"]:checked'));
		disableSelectedProficiency(target, `#race-details-${selectedRace.value}`);
	});
}
