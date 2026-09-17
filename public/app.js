const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const spotlightContent = document.getElementById('spotlightContent');
const filePill = document.getElementById('filePill');
const fileName = document.getElementById('fileName');
const clearFile = document.getElementById('clearFile');
const textInput = document.getElementById('textInput');
const roastBtn = document.getElementById('roastBtn');
const roastBtnLabel = document.getElementById('roastBtnLabel');
const errorMsg = document.getElementById('errorMsg');
const results = document.getElementById('results');
const scoreValue = document.getElementById('scoreValue');
const headline = document.getElementById('headline');
const roastPoints = document.getElementById('roastPoints');
const realTalk = document.getElementById('realTalk');
const rewriteList = document.getElementById('rewriteList');
const againBtn = document.getElementById('againBtn');

let selectedFile = null;

const LOADING_LINES = [
  'Warming up the mic...',
  'Reading between the bullet points...',
  'Counting how many times you wrote "synergy"...',
  'Sharpening one-liners...',
  'Checking if "detail-oriented" has a typo nearby...',
];

// --- File selection ------------------------------------------------------

function setFile(file) {
  selectedFile = file;
  textInput.value = '';
  fileName.textContent = file.name;
  filePill.hidden = false;
  spotlightContent.querySelector('.spotlight__label').textContent = 'Got it.';
}

function clearSelectedFile() {
  selectedFile = null;
  fileInput.value = '';
  filePill.hidden = true;
  spotlightContent.querySelector('.spotlight__label').textContent = 'Drop your resume here';
}

browseBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) setFile(fileInput.files[0]);
});

clearFile.addEventListener('click', clearSelectedFile);

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('is-dragover');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('is-dragover');
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

textInput.addEventListener('input', () => {
  if (textInput.value.trim().length > 0 && selectedFile) clearSelectedFile();
});

// --- Submit ---------------------------------------------------------------

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
}

function hideError() {
  errorMsg.hidden = true;
}

function setLoading(isLoading) {
  roastBtn.disabled = isLoading;
  if (!isLoading) {
    roastBtnLabel.textContent = 'Roast me';
    return;
  }
  let i = 0;
  roastBtnLabel.textContent = LOADING_LINES[0];
  roastBtn._interval = setInterval(() => {
    i = (i + 1) % LOADING_LINES.length;
    roastBtnLabel.textContent = LOADING_LINES[i];
  }, 1400);
}

function stopLoadingAnimation() {
  clearInterval(roastBtn._interval);
}

async function submitRoast() {
  hideError();

  if (!selectedFile && textInput.value.trim().length < 40) {
    showError('Give me a bit more to work with — paste your resume or drop a file.');
    return;
  }

  setLoading(true);

  try {
    let response;
    if (selectedFile) {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      response = await fetch('/api/roast', { method: 'POST', body: formData });
    } else {
      response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput.value }),
      });
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The roast fizzled out. Try again.');

    renderResults(data);
  } catch (err) {
    showError(err.message);
  } finally {
    stopLoadingAnimation();
    setLoading(false);
  }
}

roastBtn.addEventListener('click', submitRoast);

// --- Render -----------------------------------------------------------

function renderResults(data) {
  scoreValue.textContent = data.score ?? '--';
  headline.textContent = data.headline || '';

  roastPoints.innerHTML = '';
  (data.roast_points || []).forEach((point) => {
    const card = document.createElement('div');
    card.className = 'cuecard';
    card.innerHTML = `
      <p class="cuecard__area">${escapeHtml(point.quote_or_area || '')}</p>
      <p class="cuecard__roast">${escapeHtml(point.roast || '')}</p>
    `;
    roastPoints.appendChild(card);
  });

  realTalk.textContent = data.real_talk || '';

  rewriteList.innerHTML = '';
  (data.rewrite_suggestions || []).forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    rewriteList.appendChild(li);
  });

  results.hidden = false;
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

againBtn.addEventListener('click', () => {
  results.hidden = true;
  clearSelectedFile();
  textInput.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
