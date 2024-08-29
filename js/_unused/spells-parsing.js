/* eslint-disable no-case-declarations, id-length */

/**
 * @typedef {Object} JSONGenericEntry
 *
 * @prop {'entries'} type
 * @prop {string} name
 * @prop {JSONEntry[]} entries
 */

/**
 * @typedef {Object} JSONListEntry
 *
 * @prop {'list'} type
 * @prop {string[]} items
 */

/**
 * @typedef {Object} JSONTableEntry
 *
 * @prop {'table'} type
 * @prop {string} [caption]
 * @prop {string[]} colLabels
 * @prop {string[][]} rows
 */

/**
 * @typedef {JSONListEntry | JSONTableEntry | JSONGenericEntry | string} JSONEntry
 */

/**
 * @typedef {Object} SpellComponent
 *
 * @prop {true} [v]
 * @prop {true} [s]
 * @prop {string} [m]
 */

/**
 * @typedef {Object} SpellRange
 *
 * @prop {string} type
 * @prop {{ amount: number, type: string }} distance
 */

/**
 * @typedef {Object} SpellDuration
 *
 * @prop {string} type
 * @prop {Object} [duration]
 * @prop {string} duration.type
 * @prop {number} duration.amount
 * @prop {true} [concentration]
 */

/**
 * @typedef {Object} SpellTime
 *
 * @prop {number} number
 * @prop {string} unit
 */

/**
 * @typedef {Object} Spell
 *
 * @prop {string} name
 * @prop {number} level
 * @prop {string} school
 * @prop {SpellRange} range
 * @prop {SpellTime[]} time
 * @prop {SpellComponent} components
 * @prop {SpellDuration[]} duration
 * @prop {string[]} entries
 */

/**
 * @typedef {{ spell: Spell[] }} SpellsJSON
 */

const magicSchoolsMap = new Map([
	['A', 'Abjuration'],
	['C', 'Conjuration'],
	['D', 'Divination'],
	['E', 'Enchantment'],
	['V', 'Evocation'],
	['I', 'Illusion'],
	['N', 'Necromancy'],
	['T', 'Transmutation']
]);

function generateSpellRange(/** @type {SpellRange} */ range) {
	if (range.type === 'special') {
		return 'Special';
	}

	if (range.distance.type === 'self') {
		return 'Self';
	}

	if (range.distance.type === 'touch') {
		return 'Touch';
	}

	if (range.distance.type === 'sight') {
		return 'Sight';
	}

	if (range.distance.type === 'unlimited') {
		return '&mdash;';
	}

	let rangeString = range.distance.amount.toString();

	rangeString += ` ${range.distance.type}`;

	switch (range.type) {
		case 'radius':
			rangeString += ' radius';
			break;
		case 'sphere':
			rangeString += ' sphere';
			break;
		case 'cone':
			rangeString += ' cone';
			break;
		case 'line':
			rangeString += ' line';
			break;
		case 'hemisphere':
			rangeString += ' hemisphere';
			break;
		case 'cube':
			rangeString += ' cube';
			break;
		case 'point':
			break;
		default:
	}

	return rangeString;
}

function generateSpellComponents(/** @type {SpellComponent} */ { v, s, m }, /** @type {number} */ index) {
	let componentsString = '';

	if (v) {
		componentsString += '<abbr class="spell-component" data-component="verbal" title="Verbal">V</abbr>';
	}

	if (s) {
		componentsString += '<abbr class="spell-component" data-component="somatic" title="Somatic">S</abbr>';
	}

	if (m) {
		componentsString += `<button popovertarget="spell-component-material-${index}"><abbr class="spell-component" data-component="material" title="Material">M</abbr></button>`;
		componentsString += `<article popover id="spell-component-material-${index}" class="spell-component-popover">${m}</article>`;
	}

	return componentsString;
}

function generateSpellDuration(/** @type {SpellDuration} */ duration) {
	if (duration.type === 'instant') {
		return 'Instant';
	}

	if (duration.type === 'special') {
		return 'Special';
	}

	if (duration.type === 'permanent') {
		return 'Permanent';
	}

	let durationString = duration.duration?.amount.toString() ?? '';

	durationString += `${duration.duration?.type}${(duration.duration?.amount ?? 0) > 1 ? 's' : ''}`;

	return durationString;
}

function generateSpellTime(/** @type {SpellTime[]} */ time) {
	const timeStrings = /** @type {string[]} */ ([]);

	time.forEach(({ number, unit }) => {
		timeStrings.push(`${number} ${unit}${number > 1 ? 's' : ''}`);
	});

	return timeStrings.join(' / ');
}

function normalizeEntryText(/** @type {any} */ text) {
	if (typeof text !== 'string') {
		return text;
	}

	return text
		.replaceAll("'", '&apos;')
		.replaceAll(/\{@(?:damage|condition|status|spell|creature|skill|dice|action|sense|hit) (.+?)\}/igu, '<var>$1</var>')
		.replaceAll(/\{@(?:quickref|item|classFeature) (.+?)\|.*?\}/igu, '<var>$1</var>')
		.replaceAll(/\{@(?:book|filter) (.+?)\|.*?\}/igu, '$1')
		.replaceAll(/\{@chance (.+?)\|.*?\}/igu, '$1%');
}

function generateEntries(/** @type {JSONEntry[]} */ entries, level = 0) {
	const ENTRIES_MAX_DEPTH = 10;

	let entriesString = '';

	entries.forEach((entry) => {
		if (typeof entry !== 'string') {
			switch (entry.type) {
				case 'list':
					const list = document.createElement('ul');

					entry?.items?.forEach((item) => {
						const li = document.createElement('li');

						li.textContent = normalizeEntryText(item);
						list.appendChild(li);
					});

					entriesString += list.outerHTML;
					break;
				case 'table':
					const table = document.createElement('table');
					const thead = document.createElement('thead');
					const headerRow = document.createElement('tr');
					const tbody = document.createElement('tbody');

					entry.colLabels?.forEach((headerLabel) => {
						const th = document.createElement('th');

						th.textContent = normalizeEntryText(headerLabel);
						headerRow.appendChild(th);
					});

					thead.appendChild(headerRow);
					table.appendChild(thead);

					entry.rows.forEach((row) => {
						const tr = document.createElement('tr');

						row.forEach((cellValue) => {
							const td = document.createElement('td');

							td.textContent = normalizeEntryText(cellValue);
							tr.appendChild(td);
						});

						tbody.appendChild(tr);
					});

					table.appendChild(tbody);

					if (entry.caption) {
						const caption = document.createElement('caption');

						caption.textContent = normalizeEntryText(entry.caption);
						table.appendChild(caption);
					}

					entriesString += table.outerHTML;

					break;
				case 'entries':
					if (level > ENTRIES_MAX_DEPTH) {
						throw new Error('Entries too nested');
					}

					const details = document.createElement('details');
					const summary = document.createElement('summary');

					summary.textContent = normalizeEntryText(entry.name);

					details.appendChild(summary);
					details.insertAdjacentHTML('beforeend', generateEntries(entry.entries, level + 1));

					entriesString += details.outerHTML;

					break;
				default:
					// NOOP
			}
		} else {
			const paragraph = document.createElement('p');

			paragraph.textContent = normalizeEntryText(entry);
			entriesString += paragraph.outerHTML;
		}
	});

	return entriesString;
}

export async function generateSpellsHTML() {
	const spells = /** @type {SpellsJSON} */ (JSON.parse(await ((await fetch('/data/spells/spells-phb.json')).text())));
	const spellsPerClass = Object.fromEntries(
		Object.entries(/** @type {Record<string, { class: { name: String }[] }>} */ (JSON.parse(await ((await fetch('/spells-per-class.json')).text())))).map((
			[name, { class: classes }]
		) => [name, classes.map(({ name: cName }) => cName.toLowerCase())])
	);

	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const spellLevels = new Array(10).fill(null).map((_, index) => {
		const dd = document.createElement('dd');

		dd.id = `spell-list-${index}`;

		return dd;
	});

	spells.spell.forEach(({ name, components, duration, entries, level, range, school, time }, index) => {
		const spellClasses = spellsPerClass[name] ?? [];
		const spellData = /** @type {import('../character.js').Spell} */ ({
			name,
			level,
			school: magicSchoolsMap.get(school) ?? '',
			hasConcentration: duration[0]?.concentration ?? false,
			range: generateSpellRange(range),
			duration: generateSpellDuration(/** @type {SpellDuration} */ (duration[0])),
			components: {
				hasSomatic: components.s ?? false,
				hasVerbal: components.v ?? false,
				...(components.m && { material: components.m })
			},
			castingTime: generateSpellTime(time),
			description: generateEntries(entries)
		});

		const dt = document.createElement('dt');
		const input = document.createElement('input');
		const label = document.createElement('label');

		input.id = `spell-${level}-${index}`;
		input.type = 'checkbox';
		input.ariaDescription = 'Check to mark it as a known spell';
		input.title = input.ariaDescription;

		label.id = `spell-label-${level}-${index}`;
		label.htmlFor = input.id;
		label.innerText = name;

		input.value = JSON.stringify(spellData);

		dt.dataset['classes'] = spellClasses.join(' ');

		dt.appendChild(input);
		dt.appendChild(label);

		const dd = document.createElement('dd');
		const section = document.createElement('section');
		const details = document.createElement('details');

		details.insertAdjacentHTML('afterbegin', `<summary>Spell description<span class="visually-hidden"> for "${name}"</span></summary>`);
		details.insertAdjacentHTML('beforeend', spellData.description);

		section.insertAdjacentHTML(
			'beforeend',
			`<span class="spell-components"><label for="spell-component-${index}">Components: </label><output id="spell-component-${index}" aria-live="off">${
				generateSpellComponents(components, index)
			}</output></span>`
		);

		section.insertAdjacentHTML(
			'beforeend',
			`<span class="spell-range"><label for="spell-range-${index}">Range: </label><output id="spell-range-${index}" aria-live="off">${spellData.range}</output></span>`
		);

		section.insertAdjacentHTML(
			'beforeend',
			`<span class="spell-duration"><label for="spell-duration-${index}">Duration: </label><output id="spell-duration-${index}" aria-live="off">${spellData.duration}</output></span>`
		);

		if (duration[0]?.concentration) {
			section.insertAdjacentHTML('beforeend', `<span class="spell-concentration">Requires Concentration</span>`);
		}

		section.insertAdjacentHTML(
			'beforeend',
			`<span class="spell-casting-time"><label for="spell-casting-time-${index}">Casting time: </label><output id="spell-casting-time-${index}" aria-live="off">${spellData.castingTime}</output></span>`
		);

		section.insertAdjacentHTML(
			'beforeend',
			`<span class="spell-magic-school"><label for="spell-magic-school-${index}">Magic school: </label><output id="spell-magic-school-${index}" aria-live="off">${spellData.school}</output></span>`
		);

		dd.dataset['classes'] = spellClasses.join(' ');

		dd.appendChild(section);
		dd.appendChild(details);

		spellLevels[level]?.appendChild(dt);
		spellLevels[level]?.appendChild(dd);
	});

	console.log(spellLevels[9]?.outerHTML);
}
