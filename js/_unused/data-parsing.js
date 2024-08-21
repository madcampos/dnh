/* eslint-disable */
// @ts-nocheck
const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });

const suffixes = new Map([
	['one', 'st'],
	['two', 'nd'],
	['few', 'rd'],
	['other', 'th']
]);
const formatOrdinals = (n) => {
	const rule = pr.select(n);
	const suffix = suffixes.get(rule);
	return `${n}${suffix}`;
};

export async function generateClasses() {
	const classes = await Promise.all([
		'/data/class/class-barbarian.json',
		'/data/class/class-bard.json',
		'/data/class/class-cleric.json',
		'/data/class/class-druid.json',
		'/data/class/class-fighter.json',
		'/data/class/class-monk.json',
		'/data/class/class-paladin.json',
		'/data/class/class-ranger.json',
		'/data/class/class-rogue.json',
		'/data/class/class-sorcerer.json',
		'/data/class/class-warlock.json',
		'/data/class/class-wizard.json'
	].map(async (file) => JSON.parse(await ((await fetch(file)).text()))));

	const classesHTML = classes.map((data) => {
		const { class: [charClass], classFeature } = data;
		const className = charClass.name;

		console.log(charClass);

		const classFeaturesMap = new Map();

		charClass.classFeatures.forEach((classFeature) => {
			if (typeof classFeature !== 'string') {
				classFeature = classFeature.classFeature;
			}

			const [featureName, , , levelString] = classFeature.split('|');
			const level = Number.parseInt(levelString);

			if (!classFeaturesMap.has(level)) {
				classFeaturesMap.set(level, []);
			}

			classFeaturesMap.set(level, [...classFeaturesMap.get(level), featureName]);
		});

		const weaponProficiencies = charClass.startingProficiencies.weapons?.map((item) => `<input type="hidden" name="weaponProficiencies" value="${item}" disabled/>`).join('') ??
			'';
		const armorProficiencies = charClass.startingProficiencies.armor?.map((item) => `<input type="hidden" name="weaponProficiencies" value="${item}" disabled/>`).join('') ??
			'';

		const skillProficiencies = charClass.startingProficiencies.skills?.map((proficiency, index) => {
			let results = '';

			if (proficiency.choose) {
				for (let i = 0; i < proficiency.choose.count; i++) {
					results += `
							<p>
								<label for="class-features-${className.toLowerCase()}-skill-proficiency${index + 1}">Select a skill</label>
								<select name="skillProficiencies" id="class-features-${className.toLowerCase()}-skill-proficiency${index + 1}" required disabled>
									<option value="" disabled selected>Select an option</option>
									${proficiency.choose.from.map((skill) => `<option value="${skill.toLowerCase()}">${skill}</option>`).join('')}
								</select>
							</p>
						`;
				}
			} else {
				for (let i = 0; i < proficiency.any; i++) {
					results += `
							<p>
								<label for="class-features-${className.toLowerCase()}-skill-proficiency${index + 1}">Select a skill</label>
								<select name="skillProficiencies" id="class-features-${className.toLowerCase()}-skill-proficiency${index + 1}" required disabled>
									<option value="" disabled selected>Select an option</option>
									<option value="acrobatics">Acrobatics</option>
									<option value="animal handling">Animal Handling</option>
									<option value="arcana">Arcana</option>
									<option value="athletics">Athletics</option>
									<option value="deception">Deception</option>
									<option value="history">History</option>
									<option value="insight">Insight</option>
									<option value="intimidation">Intimidation</option>
									<option value="investigation">Investigation</option>
									<option value="medicine">Medicine</option>
									<option value="nature">Nature</option>
									<option value="perception">Perception</option>
									<option value="performance">Performance</option>
									<option value="persuasion">Persuasion</option>
									<option value="religion">Religion</option>
									<option value="sleight of hand">Sleight of Hand</option>
									<option value="stealth">Stealth</option>
									<option value="survival">Survival</option>
								</select>
							</p>
						`;
				}
			}

			return results;
		}).join('');

		return `
			<div class="class-features" id="class-features-${className.toLowerCase()}">
				<output name="hitDie" hidden aria-live="off">d${charClass.hd.faces}</output>
				${weaponProficiencies}
				${armorProficiencies}
				<pre>${JSON.stringify([charClass.startingProficiencies.toolProficiencies, charClass.startingProficiencies.tools])}</pre>
				<details open>
					<summary>Summary</summary>
					<table>
						<thead>
							<tr>
								<th scope="col">Level</th>
								<th scope="col">Features</th>
								${charClass.classTableGroups?.map((tableGroups) => tableGroups.colLabels.map((label) => `<th scope="col">${label}</th>`)).flat().join('')}
							<tr>
						</thead>
						<tbody>
							${
			[...new Array(20).fill(undefined).keys()].map((level) => `
										<tr>
											<td>${formatOrdinals(level + 1)}</td>
											<td>
											${
				classFeaturesMap.get(level + 1)?.map((feature) =>
					`<a href="#class-feature-${className.toLowerCase()}-${feature.toLowerCase().replaceAll(' ', '-')}">${feature}</a>`
				)
					.join(', ') ?? ''
			}
											</td>
											${
				charClass.classTableGroups?.map((tableGroups) =>
					(tableGroups.rows || tableGroups.rowsSpellProgression)[level].map((row) => `<td>${typeof row === 'string' ? row : JSON.stringify(row)}</td>`)
				).flat()
					.join('') ?? ''
			}
										</tr>
								`).join('')
		}
						</tbody>
					</table>
				</details>
				<details>
					<summary>Skill proficiencies</summary>
					${skillProficiencies}
				</details>

		${
			classFeature.map((feature) => `
				<details data-level="${feature.level}" id="class-feature-${className.toLowerCase()}-${feature.name.toLowerCase().replaceAll(' ', '-')}">
					<summary>${feature.name}</summary>
					${
				feature.entries.map((entry) => {
					if (typeof entry !== 'string') {
						if (entry.type === 'list') {
							return `<ul>${entry.items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
						}

						if (['entries', 'options', 'inset'].includes(entry.type)) {
							return `<!-- TODO: fix this! --><pre>${JSON.stringify(entry, null, '\t')}</pre>`;
						}

						if (['refClassFeature', 'abilityDc'].includes(entry.type)) {
							return '';
						}

						if (entry.type === 'table') {
							return `
								<table>
									<thead>
										<tr>
											${entry.colLabels.map((label) => `<th scope="col">${label}</th>`).join('')}
										</tr>
									</thead>
									<tbody>
										${
								entry.rows.map((row) => `
											<tr>
												${row.map((item) => `<td>${item}</td>`).join('')}
											</tr>
										`)
							}
									</tbody>
									<caption>${entry.caption}</caption>
								</table>
							`;
						}

						debugger;
					}

					return `<p>${entry}</p>`;
				}).join('')
			}
				</details>
			`).join('')
		}
			</div>
		`;
	}).join('');

	const output = document.createElement('textarea');

	output.innerText = classesHTML;

	document.body.insertAdjacentElement('afterbegin', output);
}
