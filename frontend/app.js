// Screen Navigation
function navigateToHome() {
  showScreen('home-screen');
  updateNavigation('home-nav-btn');
}

function navigateToUpload() {
  showScreen('upload-screen');
  updateNavigation(null);
  clearForm();
  clearPreview();
}

function navigateToWardrobe() {
  showScreen('wardrobe-screen');
  updateNavigation('wardrobe-nav-btn');
  loadWardrobe();
}

function showScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  // Show selected screen
  const selectedScreen = document.getElementById(screenId);
  if (selectedScreen) {
    selectedScreen.classList.add('active');
  }
}

function updateNavigation(activeBtn) {
  const homeNavBtn = document.getElementById('home-nav-btn');
  const wardrobeNavBtn = document.getElementById('wardrobe-nav-btn');

  homeNavBtn.classList.remove('active');
  wardrobeNavBtn.classList.remove('active');

  if (activeBtn === 'home-nav-btn') {
    homeNavBtn.classList.add('active');
  } else if (activeBtn === 'wardrobe-nav-btn') {
    wardrobeNavBtn.classList.add('active');
  }
}

// File Upload & Preview
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewContainer = document.getElementById('preview-container');
const previewImage = document.getElementById('preview-image');
const metadataForm = document.getElementById('metadata-form');

// Drag and drop
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);

function handleDragOver(e) {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
}

function handleDragLeave() {
  uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      displayImagePreview(file);
    } else {
      alert('Please upload an image file');
    }
  }
}

// File input change
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    displayImagePreview(e.target.files[0]);
  }
});

function displayImagePreview(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewContainer.classList.remove('hidden');
    metadataForm.classList.remove('hidden');
    uploadArea.style.display = 'none';

    // Store file data for submission
    window.currentFile = {
      name: file.name,
      data: e.target.result
    };
  };

  reader.readAsDataURL(file);
}

function clearPreview() {
  previewContainer.classList.add('hidden');
  metadataForm.classList.add('hidden');
  uploadArea.style.display = 'flex';
  previewImage.src = '';
  fileInput.value = '';
  window.currentFile = null;
}

// Form Submission
metadataForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  const wardrobeItem = {
    id: Date.now(),
    image: window.currentFile.data,
    category: document.getElementById('category').value,
    color: document.getElementById('color').value,
    season: document.getElementById('season').value,
    styleTags: document.getElementById('style-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
  };

  // Save to localStorage
  let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];
  wardrobe.push(wardrobeItem);
  localStorage.setItem('wardrobe', JSON.stringify(wardrobe));

  // Confirmation feedback
  alert('Item added to your wardrobe!');

  // Navigate to wardrobe
  navigateToWardrobe();
});

function clearForm() {
  metadataForm.reset();
  clearPreview();
  document.getElementById('file-input').value = '';
}

// Wardrobe Display
function loadWardrobe() {
  const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];
  const wardrobeGrid = document.getElementById('wardrobe-grid');
  const wardrobeCount = document.getElementById('wardrobe-count');

  // Update count
  wardrobeCount.textContent = `${wardrobe.length} item${wardrobe.length !== 1 ? 's' : ''}`;

  // Clear grid
  wardrobeGrid.innerHTML = '';

  if (wardrobe.length === 0) {
    // Show empty state
    wardrobeGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👔</div>
        <p class="empty-text">Your wardrobe is empty</p>
        <p class="empty-subtext">Start by uploading your first clothing item</p>
        <button class="btn btn-primary" onclick="navigateToUpload()">Upload First Item</button>
      </div>
    `;
  } else {
    // Display items
    wardrobe.forEach(item => {
      const card = createWardrobeCard(item);
      wardrobeGrid.appendChild(card);
    });
  }
}

function createWardrobeCard(item) {
  const card = document.createElement('div');
  card.className = 'wardrobe-item';

  // Build tags HTML
  const tagsHtml = item.styleTags && item.styleTags.length > 0
    ? item.styleTags.map(tag => `<span class="item-tag">${tag}</span>`).join('')
    : '';

  card.innerHTML = `
    <div class="item-image-container">
      <img src="${item.image}" alt="${item.category}" class="item-image" />
    </div>
    <div class="item-metadata">
      <div class="item-label">
        <span class="item-badge category">${item.category}</span>
        <span class="item-badge">${item.color}</span>
      </div>
      <div class="item-tags">
        ${tagsHtml}
      </div>
    </div>
  `;

  return card;
}

// Initialize: Show home screen on page load
document.addEventListener('DOMContentLoaded', () => {
  navigateToHome();
});
