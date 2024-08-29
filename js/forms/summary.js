import { getAllForms, getCharacterObject, getPicture } from '../character.js';

/**
 * @param {string} dataUrl
 */
function displayPicture(dataUrl) {
	if (!dataUrl) {
		return;
	}

	const pictureDisplay = /** @type {HTMLOutputElement} */ (document.querySelector('#summary output[name="picture"]'));
	const image = document.createElement('img');

	image.role = 'presentation';
	image.alt = 'Character picture.';
	image.width = 100;
	image.height = 100;
	image.src = dataUrl;

	pictureDisplay.replaceChildren(image);
}

/**
 * @param {string} ability
 * @param {string} value
 */
function loadAbilityModifier(ability, value) {
	const modifierOutput = /** @type {HTMLOutputElement} */ (document.querySelector(`#summary output[name="${ability}-mod"]`));
	const parsedValue = Number.parseInt(value);
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const modifier = Math.floor((parsedValue - 10) / 2);

	modifierOutput.innerHTML = `${modifier > 0 ? '+' : ''}${modifier}`;

	return modifier;
}

/**
 * @param {string} level
 */
function loadSkillProficiency(level) {
	const parsedLevel = Number.parseInt(level);

	if (Number.isNaN(parsedLevel)) {
		return 0;
	}

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const proficiency = Math.ceil(1 + (parsedLevel / 4));
	const proficiencyOutput = /** @type {HTMLOutputElement} */ (document.querySelector('#summary output[name="proficiency"]'));

	proficiencyOutput.innerHTML = `+${proficiency}`;

	return proficiency;
}

/**
 * @param {string[]} skillProficiencies
 * @param {number} proficiency
 * @param {Record<string, number>} modifiers
 */
function loadSkills(skillProficiencies, proficiency, modifiers) {
	/** @type {NodeListOf<HTMLOutputElement>} */ (document.querySelectorAll('#summary-skills output')).forEach((skillOutput) => {
		const skill = skillOutput.name;
		const attribute = skillOutput.htmlFor.value;
		const modifier = /** @type {number} */ (modifiers[attribute]);
		let proficiencyBonus = 0;

		if (skillProficiencies.includes(skill)) {
			proficiencyBonus = proficiency;
			skillOutput.dataset['proficient'] = '';
		} else {
			delete skillOutput.dataset['proficient'];
		}

		const skillTotal = modifier + proficiencyBonus;

		skillOutput.innerHTML = `${skillTotal > 0 ? '+' : ''}${skillTotal}`;
	});
}

/**
 * @param {HTMLOutputElement} output
 * @param {string} value
 */
function loadFeature(output, value) {
	const list = output.querySelector('dl') ?? document.createElement('dl');
	const title = document.createElement('dt');
	const content = document.createElement('dd');
	const { name, description, level } = JSON.parse(value);

	title.innerHTML = name;
	content.innerHTML = description;

	if (level) {
		title.dataset['level'] = level;
	}

	list.append(title, content);
	output.replaceChildren(list);
}

/**
 * @param {HTMLOutputElement} output
 * @param {string} value
 */
function loadGear(output, value) {
	const list = output.querySelector('dl') ?? document.createElement('dl');
	const title = document.createElement('dt');
	const content = document.createElement('dd');
	const { name, description } = JSON.parse(value);

	title.innerHTML = name;
	content.innerHTML = description;

	list.append(title, content);
	output.replaceChildren(list);
}

/**
 * @param {HTMLOutputElement} output
 * @param {string} value
 */
function loadProficiency(output, value) {
	const list = output.querySelector('ul') ?? document.createElement('ul');
	const listItem = document.createElement('li');

	listItem.innerHTML = value;

	list.append(listItem);
	output.replaceChildren(list);
}

/**
 * @param {import('../character.js').SpellComponents} components
 * @param {string} name
 */
function generateSpellComponents({ hasSomatic, hasVerbal, material }, name) {
	let componentsString = '';

	if (hasVerbal) {
		componentsString += '<abbr class="spell-component" data-component="verbal" title="Verbal">V</abbr>';
	}

	if (hasSomatic) {
		componentsString += '<abbr class="spell-component" data-component="somatic" title="Somatic">S</abbr>';
	}

	if (material) {
		componentsString +=
			`<button type="button" popovertarget="spell-component-material-${name}"><abbr class="spell-component" data-component="material" title="Material">M</abbr></button>`;
		componentsString += `<article popover id="spell-component-material-${name}" class="spell-component-popover">${material}</article>`;
	}

	return componentsString;
}

/**
 * @param {HTMLOutputElement} output
 * @param {string} value
 */
function loadSpellList(output, value) {
	const list = output.querySelector('dl') ?? document.createElement('dl');
	const title = document.createElement('dt');
	const content = document.createElement('dd');
	const section = document.createElement('section');
	const details = document.createElement('details');

	const { name, description, castingTime, components, duration, hasConcentration, level, range, school } = /** @type {import('../character.js').Spell} */ (JSON.parse(value));

	title.innerHTML = name;

	details.insertAdjacentHTML('afterbegin', `<summary>Spell description<span class="visually-hidden"> for "${name}"</span></summary>`);
	details.insertAdjacentHTML('beforeend', description);

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-level"><label for="spell-level-${name}">Spell Level: </label><output id="spell-level-${name}" aria-live="off">${
			level === 0 ? 'Cantrip' : level
		}</output></span>`
	);

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-components"><label for="spell-component-${name}">Components: </label><output id="spell-component-${name}" aria-live="off">${
			generateSpellComponents(components, name)
		}</output></span>`
	);

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-range"><label for="spell-range-${name}">Range: </label><output id="spell-range-${name}" aria-live="off">${range}</output></span>`
	);

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-duration"><label for="spell-duration-${name}">Duration: </label><output id="spell-duration-${name}" aria-live="off">${duration}</output></span>`
	);

	if (hasConcentration) {
		section.insertAdjacentHTML('beforeend', `<span class="spell-concentration">Requires Concentration</span>`);
	}

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-casting-time"><label for="spell-casting-time-${name}">Casting time: </label><output id="spell-casting-time-${name}" aria-live="off">${castingTime}</output></span>`
	);

	section.insertAdjacentHTML(
		'beforeend',
		`<span class="spell-magic-school"><label for="spell-magic-school-${name}">Magic school: </label><output id="spell-magic-school-${name}" aria-live="off">${school}</output></span>`
	);

	content.append(section, details);
	list.append(title, content);
	output.replaceChildren(list);
}

function loadSummary() {
	const formData = getAllForms();
	const modifiers = /** @type {Record<string, number>} */ ({});

	document.querySelectorAll(
		'output:is([name="languageProficiencies"], [name="toolProficiencies"], [name="weaponProficiencies"], [name="armorProficiencies"], [name="racialFeatures"], [name="classFeatures"], [name="equipment"], [name="weapon"], [name="armor"], [name="spellList"])'
	).forEach((output) => {
		output.replaceChildren('');
	});

	[...formData.entries()].forEach(([key, value]) => {
		const output = /** @type {HTMLOutputElement | null} */ (document.querySelector(`#summary output[name="${key}"]`));

		if (output) {
			if (key === 'picture') {
				displayPicture(getPicture());
				return;
			}

			if (key === 'spellList') {
				loadSpellList(output, /** @type {string} */ (value));
				return;
			}

			if (['languageProficiencies', 'toolProficiencies', 'weaponProficiencies', 'armorProficiencies'].includes(key)) {
				loadProficiency(output, /** @type {string} */ (value));
				return;
			}

			if (['racialFeatures', 'classFeatures'].includes(key)) {
				loadFeature(output, /** @type {string} */ (value));
				return;
			}

			if (['equipment', 'armor', 'weapon'].includes(key)) {
				loadGear(output, /** @type {string} */ (value));
				return;
			}

			if (['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(key)) {
				modifiers[key] = loadAbilityModifier(key, /** @type {string} */ (value));
			}

			output.innerHTML = /** @type {string} */ (value);
		}
	});

	const proficiency = loadSkillProficiency(/** @type {string} */ (formData.get('level')));

	loadSkills(/** @type {string[]} */ ([...formData.getAll('skillProficiencies')]), proficiency, modifiers);
}

async function exportCharacter() {
	const characterString = JSON.stringify(getCharacterObject(), undefined, '\t');

	if ('showSaveFilePicker' in window) {
		try {
			// @ts-expect-error
			const fileHandler = await window.showSaveFilePicker({
				id: 'charFile',
				startIn: 'downloads',
				suggestedName: 'character.json',
				excludeAcceptAllOption: true,
				types: [{ description: 'JSON Files', accept: { 'text/json': ['.json'] } }]
			});
			const file = await fileHandler.createWritable();

			await file.truncate(0);
			await file.write(characterString);
			await file.close();
		} catch (err) {
			console.error(err);
		}
	} else {
		const link = document.createElement('a');
		const file = new File([...characterString], 'character.json', { type: 'text/json' });
		const fileReader = new FileReader();

		fileReader.addEventListener('load', () => {
			link.download = 'character.json';
			link.href = /** @type {string} */ (fileReader.result);
			link.click();
		});

		fileReader.readAsDataURL(file);
	}
}

export function summaryFormHandling() {
	loadSummary();

	// @ts-expect-error
	document.addEventListener('dnd-next-step', (/** @type {CustomEvent} */ evt) => {
		const nextForm = evt.detail;

		if (nextForm === 'summary') {
			loadSummary();
		}
	});

	document.querySelector('#export-button')?.addEventListener('click', async () => exportCharacter());
}
