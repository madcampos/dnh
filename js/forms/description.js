import { getPicture, updatePicture } from '../character.js';
import { getCurrentStep } from '../forms.js';
import { disableChildInputs, disableSelectedProficiency, enableChildInputs } from './utils.js';

function getSelectedBackground() {
	return /** @type {HTMLInputElement | null} */ (document.querySelector('[name="background"]:checked'))?.value ?? '';
}

/**
 * @param {string} dataUrl
 */
function displayPicture(dataUrl) {
	if (!dataUrl) {
		return;
	}

	const pictureDisplay = /** @type {HTMLOutputElement} */ (document.querySelector('#picture-display'));
	const image = document.createElement('img');

	image.role = 'presentation';
	image.alt = 'Character picture.';
	image.src = dataUrl;

	pictureDisplay.replaceChildren(image);
}

/**
 * @param {File[]} files
 */
async function setImage(files) {
	const mimes = ['image/jpeg', 'image/png', 'image/webp'];
	const file = [...files].find((potentialFile) => mimes.includes(potentialFile.type));

	if (file) {
		displayPicture(await updatePicture(file));
	}
}

export function descriptionFormHandling() {
	enableChildInputs(`#background-proficiencies-${getSelectedBackground()}`);
	displayPicture(getPicture());

	// TODO: set min and max for age, height, and weight

	document.querySelector('#description')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('[name="background"]')) {
			disableChildInputs('.background-proficiencies');
			enableChildInputs(`#background-proficiencies-${target.value}`);
		}

		disableSelectedProficiency(target, `#background-proficiencies-${getSelectedBackground()}`);
	});

	const pictureDropArea = /** @type {HTMLLabelElement} */ (document.querySelector('#picture-drop-area'));

	document.querySelector('#picture')?.addEventListener('change', async (evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		await setImage(Array.from(/** @type {HTMLInputElement} */ (evt.target)?.files ?? []));
	});

	pictureDropArea.addEventListener('dragover', (evt) => {
		evt.preventDefault();
		pictureDropArea.classList.add('drop');
	});

	pictureDropArea.addEventListener('dragleave', () => {
		pictureDropArea.classList.remove('drop');
	});

	pictureDropArea.addEventListener('drop', async (evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		if (getCurrentStep() !== 'description') {
			return;
		}

		await setImage(Array.from(evt.dataTransfer?.files ?? []));

		pictureDropArea.classList.remove('drop');
	});

	document.addEventListener('paste', async (evt) => {
		if (getCurrentStep() !== 'description') {
			return;
		}

		await setImage(Array.from(evt.clipboardData?.files ?? []));
	});
}
