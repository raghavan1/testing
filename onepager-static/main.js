const form = document.getElementById('gen-form');
const promptInput = document.getElementById('prompt');
const fileInput = document.getElementById('image');
const statusEl = document.getElementById('status');
const gridEl = document.getElementById('grid');

function setStatus(text) {
	statusEl.textContent = text || '';
}

function setLoading(isLoading) {
	const btn = document.getElementById('submit');
	btn.disabled = isLoading;
	btn.textContent = isLoading ? 'Generating…' : 'Generate 10 images';
}

function createCard(node) {
	const card = document.createElement('div');
	card.className = 'card';
	card.appendChild(node);
	return card;
}

function clearGrid() {
	gridEl.innerHTML = '';
}

function renderPlaceholder(idx, label) {
	const div = document.createElement('div');
	div.style.color = '#777';
	div.style.fontSize = '12px';
	div.textContent = label ? `${idx+1}: ${label}` : `${idx+1}`;
	return createCard(div);
}

async function blobFromFile(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function generateImages(prompt, file) {
	clearGrid();
	setStatus('Generating 10 images (stub)…');

	let seedDataUrl = null;
	if (file) {
		seedDataUrl = await blobFromFile(file);
	}

	for (let i = 0; i < 10; i++) {
		const container = document.createElement('div');
		container.style.width = '100%';
		container.style.height = '100%';
		container.style.display = 'grid';
		container.style.placeItems = 'center';
		container.style.position = 'relative';

		if (seedDataUrl) {
			const img = document.createElement('img');
			img.src = seedDataUrl;
			container.appendChild(img);
		} else {
			container.appendChild(renderPlaceholder(i, prompt));
		}

		const meta = document.createElement('div');
		meta.className = 'meta';
		meta.textContent = `#${i+1}`;
		container.appendChild(meta);

		gridEl.appendChild(createCard(container));
	}

	setStatus('Done. This is a stub — connect an API to get real images.');
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const prompt = promptInput.value.trim();
	const file = fileInput.files && fileInput.files[0];
	if (!prompt) {
		setStatus('Please enter a prompt.');
		return;
	}
	setLoading(true);
	try {
		await generateImages(prompt, file || null);
	} catch (err) {
		console.error(err);
		setStatus('Something went wrong.');
	} finally {
		setLoading(false);
	}
});