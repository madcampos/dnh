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

const LIST_PROPERTIES = [
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
];

const OBJECT_PROPERTIES = [
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
];

const NUMERIC_PROPERTIES = [
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
];

export const character = /** @type {Character} */ ({});

export function loadCharacter() {
	character.race = localStorage.getItem('race') ?? '';
	character.racialFeatures = JSON.parse(localStorage.getItem('racialFeatures') ?? 'null');
	character.speed = Number.parseInt(localStorage.getItem('speed') ?? '0');
	character.size = /** @type {Size | null} */ (localStorage.getItem('size')) ?? 'medium';
	character.minAge = Number.parseInt(localStorage.getItem('minAge') ?? '0');
	character.maxAge = Number.parseInt(localStorage.getItem('maxAge') ?? '0');
	character.minHeight = Number.parseInt(localStorage.getItem('minHeight') ?? '0');
	character.maxHeight = Number.parseInt(localStorage.getItem('maxHeight') ?? '0');
	character.minWeight = Number.parseInt(localStorage.getItem('minWeight') ?? '0');
	character.maxWeight = Number.parseInt(localStorage.getItem('maxWeight') ?? '0');

	character.languageProficiencies = JSON.parse(localStorage.getItem('languageProficiencies') ?? 'null');
	character.toolProficiencies = JSON.parse(localStorage.getItem('toolProficiencies') ?? 'null');
	character.skillProficiencies = JSON.parse(localStorage.getItem('skillProficiencies') ?? 'null');
	character.weaponProficiencies = JSON.parse(localStorage.getItem('weaponProficiencies') ?? 'null');
	character.armorProficiencies = JSON.parse(localStorage.getItem('armorProficiencies') ?? 'null');

	character.class = localStorage.getItem('class') ?? '';
	character.classFeatures = JSON.parse(localStorage.getItem('classFeatures') ?? '[]');
	character.asi = JSON.parse(localStorage.getItem('asi') ?? 'null');

	character.rage = localStorage.getItem('rage') ? Number.parseInt(localStorage.getItem('rage') ?? '0') : undefined;
	character.kiPoints = localStorage.getItem('kiPoints') ? Number.parseInt(localStorage.getItem('kiPoints') ?? '0') : undefined;
	character.martialArts = localStorage.getItem('martialArts') ?? undefined;
	character.sneakAttack = localStorage.getItem('sneakAttack') ?? undefined;
	character.sorceryPoints = localStorage.getItem('sorceryPoints') ? Number.parseInt(localStorage.getItem('sorceryPoints') ?? '0') : undefined;
	character.invocationsKnown = localStorage.getItem('invocationsKnown') ? Number.parseInt(localStorage.getItem('invocationsKnown') ?? '0') : undefined;

	character.str = Number.parseInt(localStorage.getItem('str') ?? '0');
	character.dex = Number.parseInt(localStorage.getItem('dex') ?? '0');
	character.con = Number.parseInt(localStorage.getItem('con') ?? '0');
	character.int = Number.parseInt(localStorage.getItem('int') ?? '0');
	character.wis = Number.parseInt(localStorage.getItem('wis') ?? '0');
	character.cha = Number.parseInt(localStorage.getItem('cha') ?? '0');

	character.name = localStorage.getItem('name') ?? '';
	character.playerName = localStorage.getItem('playerName') ?? '';
	character.alignment = localStorage.getItem('alignment') ?? '';
	character.deity = localStorage.getItem('deity') ?? undefined;
	character.picture = localStorage.getItem('picture') ?? undefined;
	character.hair = localStorage.getItem('hair') ?? undefined;
	character.skin = localStorage.getItem('skin') ?? undefined;
	character.eyes = localStorage.getItem('eyes') ?? undefined;
	character.height = localStorage.getItem('height') ?? undefined;
	character.weight = localStorage.getItem('weight') ?? undefined;
	character.age = localStorage.getItem('age') ?? undefined;
	character.pronouns = localStorage.getItem('pronouns') ?? undefined;

	character.background = localStorage.getItem('background') ?? '';
	character.traits = localStorage.getItem('traits') ?? undefined;
	character.ideals = localStorage.getItem('ideals') ?? undefined;
	character.bonds = localStorage.getItem('bonds') ?? undefined;
	character.flaws = localStorage.getItem('flaws') ?? undefined;

	character.weapons = JSON.parse(localStorage.getItem('weapons') ?? 'null');
	character.armor = JSON.parse(localStorage.getItem('armor') ?? 'null');
	character.equipment = JSON.parse(localStorage.getItem('equipment') ?? 'null');

	character.spellLvl0 = JSON.parse(localStorage.getItem('spellLvl0') ?? 'null');
	character.spellLvl1 = JSON.parse(localStorage.getItem('spellLvl1') ?? 'null');
	character.spellLvl2 = JSON.parse(localStorage.getItem('spellLvl2') ?? 'null');
	character.spellLvl3 = JSON.parse(localStorage.getItem('spellLvl3') ?? 'null');
	character.spellLvl4 = JSON.parse(localStorage.getItem('spellLvl4') ?? 'null');
	character.spellLvl5 = JSON.parse(localStorage.getItem('spellLvl5') ?? 'null');
	character.spellLvl6 = JSON.parse(localStorage.getItem('spellLvl6') ?? 'null');
	character.spellLvl7 = JSON.parse(localStorage.getItem('spellLvl7') ?? 'null');
	character.spellLvl8 = JSON.parse(localStorage.getItem('spellLvl8') ?? 'null');
	character.spellLvl9 = JSON.parse(localStorage.getItem('spellLvl9') ?? 'null');
	character.spellList = JSON.parse(localStorage.getItem('spellList') ?? 'null');
}

export async function updateCharacter(/** @type {FormData} */ formData) {
	await Promise.all([...new Set(formData.keys())].map(async (name) => {
		const value = /** @type {string} */ (formData.get(name));

		if (LIST_PROPERTIES.includes(name)) {
			const oldValue = character[name] ?? [];
			const newValue = [...oldValue, ...formData.getAll(name)];

			character[name] = newValue;
			localStorage.setItem(name, JSON.stringify(newValue));
		} else if (OBJECT_PROPERTIES.includes(name)) {
			const oldValue = character[name] ?? {};
			const newValue = { ...oldValue, ...JSON.parse(value) };

			character[name] = newValue;
			localStorage.setItem(name, JSON.stringify(newValue));
		} else if (NUMERIC_PROPERTIES.includes(name)) {
			character[name] = Number.parseInt(value);
			localStorage.setItem(name, value.toString());
		} else if (name === 'picture') {
			const picture = await encodePictureToURL(/** @type {File} */ (formData.get('picture')));

			character.picture = picture;
			localStorage.setItem('picture', picture);
		} else {
			character[name] = value;
			localStorage.setItem(name, value);
		}
	}));
}

export function encodePictureToURL(/** @type {File} */ picture) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();

		fileReader.addEventListener('load', () => {
			resolve(fileReader.result);
		}, { once: true });

		fileReader.addEventListener('error', () => {
			reject(fileReader.error);
		}, { once: true });

		fileReader.readAsDataURL(picture);
	});
}
