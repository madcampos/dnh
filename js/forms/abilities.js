import { getAsi } from '../character.js';

/**
 * @param {string} ability
 */
function getAsiOutput(ability) {
	return /** @type {HTMLOutputElement} */ (document.querySelector(`#asi-${ability}`));
}

/**
 * @param {string} ability
 */
function getTotalOutput(ability) {
	return /** @type {HTMLOutputElement} */ (document.querySelector(`#base-${ability}`));
}

/**
 * @param {string} ability
 */
function getAbilityInput(ability) {
	return /** @type {HTMLInputElement} */ (document.querySelector(`#${ability}`));
}

/**
 * @param {string} ability
 */
function setAbilityTotal(ability) {
	const asiBonus = Number.parseInt(getAsiOutput(ability).value);
	const abilityScore = Number.parseInt(getAbilityInput(ability).value || '0');
	const totalOutput = getTotalOutput(ability);

	if (Number.isNaN(asiBonus) || Number.isNaN(abilityScore)) {
		totalOutput.value = '0';
	} else {
		totalOutput.value = (abilityScore + asiBonus).toString();
	}
}

const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function abilitiesFormHandling() {
	getAsi().forEach((asi) => {
		const asiOutput = getAsiOutput(asi);

		asiOutput.value = `+${(Number.parseInt(asiOutput.value) + 1)}`;
	});

	ABILITIES.forEach((ability) => {
		setAbilityTotal(ability);
	});

	// @ts-expect-error
	document.addEventListener('dnd-next-step', (/** @type {CustomEvent} */ evt) => {
		const nextForm = evt.detail;

		if (nextForm === 'abilities') {
			getAsi().forEach((asi) => {
				const asiOutput = getAsiOutput(asi);

				asiOutput.value = `+${(Number.parseInt(asiOutput.value) + 1)}`;
			});

			ABILITIES.forEach((ability) => {
				setAbilityTotal(ability);
			});
		}
	});

	document.querySelector('#abilities')?.addEventListener('input', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		setAbilityTotal(target.name);
	});
}
