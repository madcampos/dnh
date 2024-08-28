/* eslint-disable id-length */
/* eslint-disable no-case-declarations */
const damageTypeMap = new Map([
	['P', 'Piercing'],
	['B', 'Bludgeoning'],
	['S', 'Slashing']
]);

const typeMap = new Map([
	['G', 'Adventuring Gear'],
	['A', 'Ammunition'],
	['AT', "Artisan's Tools"],
	['FD', 'Food & Drink'],
	['GS', 'Gaming Set'],
	['HA', 'Heavy Armor'],
	['INS', 'Instrument'],
	['LA', 'Light Armor'],
	['M', 'Melee Weapon'],
	['R', 'Ranged Weapon'],
	['MA', 'Medium Armor'],
	['MNT', 'Mount'],
	['S', 'Shield'],
	['SCF', 'Spellcasting Focus'],
	['TAH', 'Tack and Harness'],
	['T', 'Tools'],
	['TG', 'Trade Goods'],
	['$C', 'Treasure'],
	['VEH', 'Vehicle']
]);

export async function generateEquipmentHtml() {
	const equipment = JSON.parse(await ((await fetch('/items.json')).text()));

	const armorList = document.createElement('ul');
	const weaponList = document.createElement('ul');
	const equipmentList = document.createElement('ul');

	/** @type {any[]} */ (equipment).forEach(({ name, type, weight, entries, value, dmg1, dmg2, dmgType, weapon, armor, ac }, index) => {
		/** @type {Partial<import('../character.js').Equipment & import('../character.js').Armor & import('../character.js').Weapon>} */
		const equipmentData = {
			name,
			type: typeMap.get(type),
			description: '',
			weight,
			value
		};

		entries?.forEach(
			(/** @type {{type: string, entries?: string[], items?: string[], name?: string, caption?: string, colLabels?: string[], rows: string[][]} | string} */ entry) => {
				if (typeof entry !== 'string') {
					switch (entry.type) {
						case 'list':
							const list = document.createElement('ul');

							entry?.items?.forEach((item) => {
								const li = document.createElement('li');

								li.textContent = item;
								list.appendChild(li);
							});

							equipmentData.description += list.outerHTML;
							break;
						case 'table':
							const table = document.createElement('table');
							const thead = document.createElement('thead');
							const headerRow = document.createElement('tr');
							const tbody = document.createElement('tbody');

							entry.colLabels?.forEach((headerLabel) => {
								const th = document.createElement('th');

								th.textContent = headerLabel;
								headerRow.appendChild(th);
							});

							thead.appendChild(headerRow);
							table.appendChild(thead);

							entry.rows.forEach((row) => {
								const tr = document.createElement('tr');

								row.forEach((cellValue) => {
									const td = document.createElement('td');

									td.textContent = cellValue;
									tr.appendChild(td);
								});

								tbody.appendChild(tr);
							});

							table.appendChild(tbody);

							if (entry.caption) {
								const caption = document.createElement('caption');

								caption.textContent = entry.caption;
								table.appendChild(caption);
							}

							equipmentData.description += table.outerHTML;

							break;
						default:
							// NOOP
					}
				} else {
					const paragraph = document.createElement('p');

					paragraph.textContent = entry;
					equipmentData.description += paragraph.outerHTML;
				}
			}
		);

		const input = document.createElement('input');
		const label = document.createElement('label');
		const listItem = document.createElement('li');

		input.id = `item-${index}`;
		input.type = 'checkbox';

		label.id = `input-label-${index}`;
		label.htmlFor = input.id;
		label.innerText = name;

		listItem.appendChild(input);
		listItem.appendChild(label);

		if (equipmentData.description) {
			const infoButton = document.createElement('button');
			const infoPopover = document.createElement('aside');
			const infoPopoverHeader = document.createElement('header');

			infoButton.type = 'button';
			infoButton.textContent = 'ℹ️';
			infoButton.ariaLabel = `More info about ${name}`;
			infoButton.setAttribute('popovertarget', `item-info-${index}`);

			infoPopoverHeader.textContent = `Info: ${name}`;
			infoPopoverHeader.id = `item-info-label-${index}`;
			infoPopover.appendChild(infoPopoverHeader);

			infoPopover.id = `item-info-${index}`;
			infoPopover.setAttribute('aria-labeledby', `item-info-label-${index}`);
			infoPopover.popover = 'auto';
			infoPopover.insertAdjacentHTML('beforeend', equipmentData.description ?? '');

			listItem.appendChild(infoButton);
			listItem.appendChild(infoPopover);
		}

		if (weapon) {
			input.name = 'weapon';
			equipmentData.damage = `${dmg1}${dmg2 ? ` / ${dmg2}` : ''} (${damageTypeMap.get(dmgType)})`;

			weaponList.appendChild(listItem);
		} else if (armor) {
			input.name = 'armor';
			equipmentData.ac = ac;

			armorList.appendChild(listItem);
		} else {
			input.name = 'equipment';
			label.dataset['type'] = typeMap.get(type);

			equipmentList.appendChild(listItem);
		}

		input.value = JSON.stringify(equipmentData);
	});

	console.log(armorList.outerHTML);
	console.log(weaponList.outerHTML);
	console.log(equipmentList.outerHTML);
}
