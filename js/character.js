/**
 * @typedef {'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'} Attribute
 */

/**
 * @typedef {'small' | 'medium' | 'large'} Size
 */

/**
 * @typedef {Object} Weapon
 *
 * @prop {string} name
 * @prop {string} damage
 * @prop {string} description
 */

/**
 * @typedef {Object} Armor
 *
 * @prop {string} name
 * @prop {string} ac
 * @prop {string} description
 */

/**
 * @typedef {Object} Equipment
 *
 * @prop {string} name
 * @prop {string} description
 */

/**
 * @typedef {Object} RacialFeature
 *
 * @prop {string} name
 * @prop {string} description
 */

/**
 * @typedef {Object} ClassFeature
 *
 * @prop {string} name
 * @prop {number} level
 * @prop {string} description
 */

/**
 * @typedef {Object} SpellLevel
 *
 * @prop {number} knownSpells
 * @prop {number} spellSlot
 * @prop {string[]} spells
 */

/**
 * @typedef {Object} Spell
 *
 * @prop {string} name
 * @prop {number} level
 * @prop {string} school
 * @prop {boolean} hasConcentration
 * @prop {string} range
 * @prop {string} time
 * @prop {string} description
 */

/**
 * @typedef {Object} Character
 *
 * @prop {string} race
 * @prop {RacialFeature[]} [racialFeatures]
 * @prop {number} speed
 * @prop {Size} size
 * @prop {number} minAge
 * @prop {number} maxAge
 * @prop {number} minHeight
 * @prop {number} maxHeight
 * @prop {number} minWeight
 * @prop {number} maxWeight
 *
 * @prop {string[]} [languageProficiencies]
 * @prop {string[]} [toolProficiencies]
 * @prop {string[]} [skillProficiencies]
 * @prop {string[]} [weaponProficiencies]
 * @prop {string[]} [armorProficiencies]
 *
 * @prop {string} class
 * @prop {ClassFeature[]} classFeatures
 * @prop {Attribute[]} [asi]
 *
 * @prop {number} [rage]
 * @prop {number} [kiPoints]
 * @prop {string} [martialArts]
 * @prop {string} [sneakAttack]
 * @prop {number} [sorceryPoints]
 * @prop {number} [invocationsKnown]
 *
 * @prop {number} str
 * @prop {number} dex
 * @prop {number} con
 * @prop {number} int
 * @prop {number} wis
 * @prop {number} cha
 *
 * @prop {string} name
 * @prop {string} playerName
 * @prop {string} alignment
 * @prop {string} [deity]
 * @prop {string} [picture]
 * @prop {string} [hair]
 * @prop {string} [skin]
 * @prop {string} [eyes]
 * @prop {string} [height]
 * @prop {string} [weight]
 * @prop {string} [age]
 * @prop {string} [pronouns]
 *
 * @prop {string} background
 * @prop {string} [traits]
 * @prop {string} [ideals]
 * @prop {string} [bonds]
 * @prop {string} [flaws]
 *
 * @prop {Weapon[]} weapons
 * @prop {Armor[]} armor
 * @prop {Equipment[]} equipment
 *
 * @prop {SpellLevel} [spellLvl0]
 * @prop {SpellLevel} [spellLvl1]
 * @prop {SpellLevel} [spellLvl2]
 * @prop {SpellLevel} [spellLvl3]
 * @prop {SpellLevel} [spellLvl4]
 * @prop {SpellLevel} [spellLvl5]
 * @prop {SpellLevel} [spellLvl6]
 * @prop {SpellLevel} [spellLvl7]
 * @prop {SpellLevel} [spellLvl8]
 * @prop {SpellLevel} [spellLvl9]
 * @prop {Spell[]} [spellList]
 */

const LIST_PROPERTIES = /** @type {const} */ ([
	'racialFeatures',
	'languageProficiencies',
	'toolProficiencies',
	'skillProficiencies',
	'weaponProficiencies',
	'armorProficiencies',
	'classFeatures',
	'asi',
	'weapons',
	'armor',
	'equipment',
	'spellList'
]);

const OBJECT_PROPERTIES = /** @type {const} */ ([
	'spellLvl0',
	'spellLvl1',
	'spellLvl2',
	'spellLvl3',
	'spellLvl4',
	'spellLvl5',
	'spellLvl6',
	'spellLvl7',
	'spellLvl8',
	'spellLvl9'
]);

const NUMERIC_PROPERTIES = /** @type {const} */ ([
	'speed',
	'minAge',
	'maxAge',
	'minHeight',
	'maxHeight',
	'minWeight',
	'maxWeight',
	'rage',
	'kiPoints',
	'sorceryPoints',
	'invocationsKnown',
	'str',
	'dex',
	'con',
	'int',
	'wis',
	'cha'
]);

function getAllForms() {
	const formelectors = [
		'#race form',
		'#class form',
		'#abilities form',
		'#description form',
		'#equipment form',
		'#spells form'
	];

	const combinedFormData = formelectors.reduce((formData, id) => {
		const form = /** @type {HTMLFormElement} */ (document.querySelector(id));
		const currentFormData = new FormData(form);

		currentFormData.forEach((value, key) => {
			formData.append(key, value);
		});

		return formData;
	}, new FormData());

	return combinedFormData;
}
export function getAsi() {
	return /** @type {string[]} */ ([...getAllForms().getAll('asi')]);
}

/**
 * @param {File} picture
 * @returns {Promise<string>}
 */
export async function encodePictureToURL(picture) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.addEventListener('load', () => {
			resolve(/** @type {string} */ (fileReader.result));
		}, { once: true });

		fileReader.addEventListener('error', () => {
			reject(new Error(fileReader.error?.message));
		}, { once: true });

		fileReader.readAsDataURL(picture);
	});
}

/**
 * @param {File} file
 */
export async function updatePicture(file) {
	const picture = await encodePictureToURL(file);

	localStorage.setItem('picture', picture);

	return picture;
}

export function getPicture() {
	return localStorage.getItem('picture') ?? '';
}

export async function updateCharacter() {
	const formData = getAllForms();

	await Promise.all([...new Set(formData.keys())].map(async (name) => {
		const value = /** @type {string} */ (formData.get(name));

		if (LIST_PROPERTIES.includes(/** @type {typeof LIST_PROPERTIES[number]} */ (name))) {
			const oldValue = JSON.parse(localStorage.getItem(name) ?? '[]');
			const newValue = [...formData.getAll(name)];

			localStorage.setItem(name, JSON.stringify([...oldValue, ...newValue]));
		} else if (OBJECT_PROPERTIES.includes(/** @type {typeof OBJECT_PROPERTIES[number]} */ (name))) {
			const oldValue = JSON.parse(localStorage.getItem(name) ?? '{}');
			const newValue = JSON.parse(value);

			localStorage.setItem(name, JSON.stringify({ ...oldValue, ...newValue }));
		} else if (NUMERIC_PROPERTIES.includes(/** @type {typeof NUMERIC_PROPERTIES[number]} */ (name))) {
			const parsedNumber = Number.parseInt(value);

			if (!Number.isNaN(parsedNumber)) {
				localStorage.setItem(name, value.toString());
			}
		} else if (name === 'picture') {
			const file = /** @type {File} */ (formData.get('picture'));
			const mimes = ['image/jpeg', 'image/png', 'image/webp'];

			if (file && mimes.includes(file.type)) {
				await updatePicture(file);
			}
		} else {
			localStorage.setItem(name, value);
		}
	}));
}
