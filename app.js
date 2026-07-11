// Application State
let cvState = null;

// DOM Elements Container (Populated lazily)
let elements = {};

function initElements() {
  elements = {
    // Theme & Settings
    body: document.body,
    themeToggle: document.getElementById('theme-toggle'),
    templateBtns: document.querySelectorAll('.template-btn'),
    colorDots: document.querySelectorAll('.color-dot'),
    
    // Header controls
    btnDownload: document.getElementById('btn-download'),
    btnExport: document.getElementById('btn-export'),
    btnImport: document.getElementById('btn-import'),
    btnLoadDemo: document.getElementById('btn-load-demo'),
    fileInput: document.getElementById('file-input'),

    // Navigation Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    formSections: document.querySelectorAll('.form-section'),

    // Preview Page
    cvPaper: document.getElementById('cv-paper'),

    // Static Form Inputs
    fullName: document.getElementById('inp-full-name'),
    title: document.getElementById('inp-title'),
    email: document.getElementById('inp-email'),
    phone: document.getElementById('inp-phone'),
    location: document.getElementById('inp-location'),
    website: document.getElementById('inp-website'),
    linkedin: document.getElementById('inp-linkedin'),
    github: document.getElementById('inp-github'),
    summary: document.getElementById('inp-summary'),

    // Dynamic Add Buttons
    btnAddExp: document.getElementById('btn-add-exp'),
    btnAddEdu: document.getElementById('btn-add-edu'),
    btnAddPort: document.getElementById('btn-add-port'),
    btnAddSkill: document.getElementById('btn-add-skill'),
    btnAddLang: document.getElementById('btn-add-lang')
  };
}

// ==========================================================================
// Custom Confirm Modal Dialog
// ==========================================================================
function showConfirmModal(text, onConfirm) {
  const modal = document.getElementById('confirm-modal');
  const textEl = document.getElementById('confirm-modal-text');
  const cancelBtn = document.getElementById('confirm-cancel-btn');
  const okBtn = document.getElementById('confirm-ok-btn');
  
  if (!modal || !textEl || !cancelBtn || !okBtn) return;
  
  textEl.textContent = text;
  modal.style.display = 'flex';
  
  const close = () => {
    modal.style.display = 'none';
    okBtn.onclick = null;
    cancelBtn.onclick = null;
  };
  
  okBtn.onclick = () => {
    close();
    onConfirm();
  };
  
  cancelBtn.onclick = () => {
    close();
  };
}

// ==========================================================================
// Initialization & State Management
// ==========================================================================
function init() {
  // 1. Initialize DOM references
  initElements();

  // 2. Load data (Local Storage or Mock)
  const savedState = localStorage.getItem('cv_builder_state');
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      // Robust schema validation & merging with fallback defaults
      cvState = {
        personalInfo: {
          fullName: parsed.personalInfo?.fullName || '',
          title: parsed.personalInfo?.title || '',
          email: parsed.personalInfo?.email || '',
          phone: parsed.personalInfo?.phone || '',
          location: parsed.personalInfo?.location || '',
          website: parsed.personalInfo?.website || '',
          linkedin: parsed.personalInfo?.linkedin || '',
          github: parsed.personalInfo?.github || ''
        },
        summary: parsed.summary !== undefined ? parsed.summary : '',
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : []
      };
    } catch (e) {
      console.error("Error parsing saved state:", e);
      cvState = JSON.parse(JSON.stringify(initialCVData));
    }
  } else {
    cvState = JSON.parse(JSON.stringify(initialCVData));
  }

  // 3. Setup Settings from Local Storage
  const savedTheme = localStorage.getItem('cv_editor_theme') || 'dark';
  if (savedTheme === 'light') {
    elements.body.classList.add('light-mode');
    elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    elements.body.classList.remove('light-mode');
    elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  const savedTemplate = localStorage.getItem('cv_template') || 'modern';
  setCVTemplate(savedTemplate);

  const savedColor = localStorage.getItem('cv_color') || '#1e3a8a';
  setCVColor(savedColor);

  // 4. Setup Listeners
  setupEventListeners();

  // 5. Populate Inputs
  fillEditorInputs();

  // 6. Render Dynamic Section Editors
  renderListEditor('experiences');
  renderListEditor('education');
  renderListEditor('portfolio');
  renderListEditor('skills');
  renderListEditor('languages');

  // 7. Live Render CV Preview
  renderCVPreview();
}

let saveTimeout = null;

function saveState() {
  const statusEl = document.getElementById('save-status');
  if (statusEl) {
    statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kaydediliyor...';
    statusEl.className = 'save-status saving';
  }

  localStorage.setItem('cv_builder_state', JSON.stringify(cvState));

  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    if (statusEl) {
      statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Otomatik Kaydedildi';
      statusEl.className = 'save-status';
    }
  }, 600);
}

// Helper to deep copy mock data
function loadDemoData() {
  showConfirmModal("Mevcut verilerinizin üzerine demo veriler yüklenecektir. Emin misiniz?", () => {
    cvState = JSON.parse(JSON.stringify(initialCVData));
    saveState();
    fillEditorInputs();
    renderListEditor('experiences');
    renderListEditor('education');
    renderListEditor('portfolio');
    renderListEditor('skills');
    renderListEditor('languages');
    renderCVPreview();
  });
}

// ==========================================================================
// Event Listeners Configuration
// ==========================================================================
function setupEventListeners() {
  // Theme Toggle
  elements.themeToggle.addEventListener('click', () => {
    elements.body.classList.toggle('light-mode');
    const isLight = elements.body.classList.contains('light-mode');
    elements.themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('cv_editor_theme', isLight ? 'light' : 'dark');
  });

  // CV Template Buttons
  elements.templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.templateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const template = btn.dataset.template;
      setCVTemplate(template);
    });
  });

  // CV Color Palette
  elements.colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      elements.colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const color = dot.dataset.color;
      setCVColor(color);
    });
  });

  // Editor Section Tabs switching
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tabBtns.forEach(b => b.classList.remove('active'));
      elements.formSections.forEach(s => s.classList.remove('active'));
      
      btn.classList.add('active');
      const targetSection = document.getElementById(btn.dataset.section);
      if (targetSection) targetSection.classList.add('active');
    });
  });

  // Bind static input listeners
  const staticBindings = [
    { el: elements.fullName, key: 'fullName', parent: 'personalInfo' },
    { el: elements.title, key: 'title', parent: 'personalInfo' },
    { el: elements.email, key: 'email', parent: 'personalInfo' },
    { el: elements.phone, key: 'phone', parent: 'personalInfo' },
    { el: elements.location, key: 'location', parent: 'personalInfo' },
    { el: elements.website, key: 'website', parent: 'personalInfo' },
    { el: elements.linkedin, key: 'linkedin', parent: 'personalInfo' },
    { el: elements.github, key: 'github', parent: 'personalInfo' },
    { el: elements.summary, key: 'summary', parent: null }
  ];

  staticBindings.forEach(binding => {
    binding.el.addEventListener('input', (e) => {
      if (binding.parent) {
        cvState[binding.parent][binding.key] = e.target.value;
      } else {
        cvState[binding.key] = e.target.value;
      }
      saveState();
      renderCVPreview();
    });
  });

  // Dynamic Add Buttons
  elements.btnAddExp.addEventListener('click', () => addListItem('experiences', { company: '', position: '', startDate: '', endDate: '', description: '' }));
  elements.btnAddEdu.addEventListener('click', () => addListItem('education', { institution: '', degree: '', startDate: '', endDate: '', description: '' }));
  elements.btnAddPort.addEventListener('click', () => addListItem('portfolio', { title: '', role: '', link: '', description: '', technologies: '' }));
  elements.btnAddSkill.addEventListener('click', () => addListItem('skills', { category: '', details: '' }));
  elements.btnAddLang.addEventListener('click', () => addListItem('languages', { language: '', level: '' }));

  // File Controls
  elements.btnLoadDemo.addEventListener('click', loadDemoData);
  elements.btnDownload.addEventListener('click', () => window.print());
  
  elements.btnExport.addEventListener('click', exportStateAsJSON);
  elements.btnImport.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', importStateFromJSON);
}

// ==========================================================================
// Template & Styling Selectors
// ==========================================================================
function setCVTemplate(template) {
  elements.cvPaper.className = 'cv-paper'; // reset classes
  elements.cvPaper.classList.add(`template-${template}`);
  localStorage.setItem('cv_template', template);
  
  // Highlight correct button
  elements.templateBtns.forEach(btn => {
    if (btn.dataset.template === template) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function setCVColor(color) {
  elements.cvPaper.style.setProperty('--cv-primary', color);
  localStorage.setItem('cv_color', color);

  // Highlight correct dot
  elements.colorDots.forEach(dot => {
    if (dot.dataset.color === color) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ==========================================================================
// Form Input Syncing
// ==========================================================================
function fillEditorInputs() {
  elements.fullName.value = cvState.personalInfo.fullName || '';
  elements.title.value = cvState.personalInfo.title || '';
  elements.email.value = cvState.personalInfo.email || '';
  elements.phone.value = cvState.personalInfo.phone || '';
  elements.location.value = cvState.personalInfo.location || '';
  elements.website.value = cvState.personalInfo.website || '';
  elements.linkedin.value = cvState.personalInfo.linkedin || '';
  elements.github.value = cvState.personalInfo.github || '';
  elements.summary.value = cvState.summary || '';
}

// ==========================================================================
// Dynamic Lists Management (CRUD + Reordering)
// ==========================================================================
function addListItem(section, emptyObj) {
  emptyObj.id = `${section.substring(0, 3)}-${Date.now()}`;
  cvState[section].push(emptyObj);
  saveState();
  renderListEditor(section);
  renderCVPreview();
  
  // Scroll to the newly added item inside the list editor
  let containerId = '';
  if (section === 'experiences') containerId = 'editor-exp-list';
  else if (section === 'education') containerId = 'editor-edu-list';
  else if (section === 'portfolio') containerId = 'editor-port-list';
  else if (section === 'skills') containerId = 'editor-skills-list';
  else if (section === 'languages') containerId = 'editor-lang-list';

  const listContainer = document.getElementById(containerId);
  if (listContainer && listContainer.lastElementChild) {
    listContainer.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  }
}

function deleteListItem(section, id) {
  cvState[section] = cvState[section].filter(item => item.id !== id);
  saveState();
  renderListEditor(section);
  renderCVPreview();
}

function moveListItem(section, id, direction) {
  const index = cvState[section].findIndex(item => item.id === id);
  if (index === -1) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= cvState[section].length) return;

  // Swap positions
  const temp = cvState[section][index];
  cvState[section][index] = cvState[section][targetIndex];
  cvState[section][targetIndex] = temp;

  saveState();
  renderListEditor(section);
  renderCVPreview();
}

function handleListItemChange(section, id, field, value) {
  const index = cvState[section].findIndex(item => item.id === id);
  if (index !== -1) {
    cvState[section][index][field] = value;
    saveState();
    renderCVPreview();
  }
}

// Generates dynamic form cards inside Left Panel
function renderListEditor(section) {
  let containerId = '';
  if (section === 'experiences') containerId = 'editor-exp-list';
  else if (section === 'education') containerId = 'editor-edu-list';
  else if (section === 'portfolio') containerId = 'editor-port-list';
  else if (section === 'skills') containerId = 'editor-skills-list';
  else if (section === 'languages') containerId = 'editor-lang-list';

  const container = document.getElementById(containerId);
  if (!container) return;


  container.innerHTML = '';
  const items = cvState[section] || [];

  if (items.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 1rem;">Henüz kayıt eklenmemiş. "Ekle" butonuna basarak yeni bir kayıt oluşturabilirsiniz.</p>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'list-item-card';
    card.dataset.id = item.id;

    // Controls HTML
    const controlsHtml = `
      <div class="card-controls">
        <button class="card-control-btn" onclick="moveListItem('${section}', '${item.id}', -1)" title="Yukarı Taşı">
          <i class="fas fa-chevron-up"></i>
        </button>
        <button class="card-control-btn" onclick="moveListItem('${section}', '${item.id}', 1)" title="Aşağı Taşı">
          <i class="fas fa-chevron-down"></i>
        </button>
        <button class="card-control-btn delete" onclick="deleteListItem('${section}', '${item.id}')" title="Sil">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;

    let formFieldsHtml = '';

    if (section === 'experiences') {
      formFieldsHtml = `
        <div class="form-row">
          <div class="form-group">
            <label>Şirket / Kurum</label>
            <input type="text" value="${item.company || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'company', this.value)">
          </div>
          <div class="form-group">
            <label>Pozisyon / Rol</label>
            <input type="text" value="${item.position || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'position', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Başlangıç Tarihi</label>
            <input type="month" value="${item.startDate || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="form-group">
            <label>Bitiş Tarihi</label>
            <input type="text" placeholder="Örn: 2023-12 veya Devam Ediyor" value="${item.endDate || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'endDate', this.value)">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Açıklamalar & Başarılar (Her satıra '•' ile başlayabilirsiniz)</label>
          <textarea oninput="handleListItemChange('${section}', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    } else if (section === 'education') {
      formFieldsHtml = `
        <div class="form-row">
          <div class="form-group">
            <label>Okul / Üniversite</label>
            <input type="text" value="${item.institution || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'institution', this.value)">
          </div>
          <div class="form-group">
            <label>Bölüm / Derece</label>
            <input type="text" value="${item.degree || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'degree', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Başlangıç Tarihi</label>
            <input type="month" value="${item.startDate || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'startDate', this.value)">
          </div>
          <div class="form-group">
            <label>Mezuniyet Tarihi</label>
            <input type="text" placeholder="Örn: 2018-06 veya Devam Ediyor" value="${item.endDate || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'endDate', this.value)">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Açıklama / Akademik Detaylar</label>
          <textarea oninput="handleListItemChange('${section}', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    } else if (section === 'portfolio') {
      formFieldsHtml = `
        <div class="form-row">
          <div class="form-group">
            <label>Proje Başlığı</label>
            <input type="text" value="${item.title || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'title', this.value)">
          </div>
          <div class="form-group">
            <label>Projedeki Rol</label>
            <input type="text" placeholder="Örn: Kurucu, Lead Dev" value="${item.role || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'role', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Proje / Portfolyo Bağlantısı</label>
            <input type="url" placeholder="https://github.com/... veya portfolyo linki" value="${item.link || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'link', this.value)">
          </div>
          <div class="form-group">
            <label>Kullanılan Teknolojiler</label>
            <input type="text" placeholder="Örn: React, Node.js, AWS" value="${item.technologies || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'technologies', this.value)">
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label>Proje Açıklaması</label>
          <textarea oninput="handleListItemChange('${section}', '${item.id}', 'description', this.value)">${item.description || ''}</textarea>
        </div>
      `;
    } else if (section === 'skills') {
      formFieldsHtml = `
        <div class="form-row" style="grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 0;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Kategori</label>
            <input type="text" placeholder="Örn: Programlama Dilleri" value="${item.category || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'category', this.value)">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Yetenekler (Virgülle ayırın)</label>
            <input type="text" placeholder="Örn: JS, Python, HTML" value="${item.details || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'details', this.value)">
          </div>
        </div>
      `;
    } else if (section === 'languages') {
      formFieldsHtml = `
        <div class="form-row" style="margin-bottom: 0;">
          <div class="form-group" style="margin-bottom: 0;">
            <label>Dil</label>
            <input type="text" placeholder="Örn: İngilizce" value="${item.language || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'language', this.value)">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Seviye</label>
            <input type="text" placeholder="Örn: İleri Düzey (C1)" value="${item.level || ''}" oninput="handleListItemChange('${section}', '${item.id}', 'level', this.value)">
          </div>
        </div>
      `;
    }

    card.innerHTML = controlsHtml + formFieldsHtml;
    container.appendChild(card);
  });
}

// Global exposure for inline onclick attributes
window.moveListItem = moveListItem;
window.deleteListItem = deleteListItem;
window.handleListItemChange = handleListItemChange;

// ==========================================================================
// live CV Preview Renderer
// ==========================================================================
function renderCVPreview() {
  if (!cvState) return;

  const { personalInfo, summary, experiences, education, portfolio, skills, languages } = cvState;

  // Formatting date helpers for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
      const [year, month] = dateStr.split('-');
      // Convert to Month Year format e.g. "03/2023"
      return `${month}/${year}`;
    }
    return dateStr; // fallback for raw text
  };

  // 1. Render Header Info
  let contactHtml = '';
  if (personalInfo.email) contactHtml += `<span><i class="fas fa-envelope"></i> ${personalInfo.email}</span>`;
  if (personalInfo.phone) contactHtml += `<span><i class="fas fa-phone"></i> ${personalInfo.phone}</span>`;
  if (personalInfo.location) contactHtml += `<span><i class="fas fa-map-marker-alt"></i> ${personalInfo.location}</span>`;
  if (personalInfo.website) {
    const cleanUrl = personalInfo.website.replace(/(^\w+:|^)\/\//, '');
    contactHtml += `<span><i class="fas fa-globe"></i> <a href="${personalInfo.website}" target="_blank">${cleanUrl}</a></span>`;
  }
  if (personalInfo.linkedin) {
    const cleanUrl = personalInfo.linkedin.replace(/(^\w+:|^)\/\//, '').replace('www.', '');
    contactHtml += `<span><i class="fab fa-linkedin"></i> <a href="${personalInfo.linkedin}" target="_blank">${cleanUrl}</a></span>`;
  }
  if (personalInfo.github) {
    const cleanUrl = personalInfo.github.replace(/(^\w+:|^)\/\//, '').replace('www.', '');
    contactHtml += `<span><i class="fab fa-github"></i> <a href="${personalInfo.github}" target="_blank">${cleanUrl}</a></span>`;
  }

  let html = `
    <!-- Header -->
    <div class="cv-header">
      <h1>${personalInfo.fullName || 'İsim Soyisim'}</h1>
      <div class="cv-title">${personalInfo.title || 'Başlık / Unvan'}</div>
      <div class="cv-contact-bar">
        ${contactHtml}
      </div>
    </div>
  `;

  // 2. Render Summary
  if (summary && summary.trim() !== '') {
    html += `
      <div class="cv-section">
        <div class="cv-section-title">Profesyonel Özet</div>
        <div class="cv-summary">${summary}</div>
      </div>
    `;
  }

  // 3. Render Experience
  if (experiences && experiences.length > 0) {
    let expItemsHtml = '';
    experiences.forEach(exp => {
      // Check if item has any content before rendering
      if (exp.company || exp.position || exp.startDate || exp.endDate || exp.description) {
        expItemsHtml += `
          <div class="cv-item">
            <div class="cv-item-header">
              <span>${exp.position || 'Pozisyon'}</span>
              <span>${exp.company || 'Şirket'}</span>
            </div>
            <div class="cv-item-sub">
              <span></span>
              <span>${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}</span>
            </div>
            ${exp.description ? `<div class="cv-item-description">${exp.description}</div>` : ''}
          </div>
        `;
      }
    });

    if (expItemsHtml !== '') {
      html += `
        <div class="cv-section">
          <div class="cv-section-title">İş Deneyimi</div>
          ${expItemsHtml}
        </div>
      `;
    }
  }

  // 4. Render Education
  if (education && education.length > 0) {
    let eduItemsHtml = '';
    education.forEach(edu => {
      if (edu.institution || edu.degree || edu.startDate || edu.endDate || edu.description) {
        eduItemsHtml += `
          <div class="cv-item">
            <div class="cv-item-header">
              <span>${edu.degree || 'Derece / Bölüm'}</span>
              <span>${edu.institution || 'Kurum'}</span>
            </div>
            <div class="cv-item-sub">
              <span></span>
              <span>${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}</span>
            </div>
            ${edu.description ? `<div class="cv-item-description">${edu.description}</div>` : ''}
          </div>
        `;
      }
    });

    if (eduItemsHtml !== '') {
      html += `
        <div class="cv-section">
          <div class="cv-section-title">Eğitim</div>
          ${eduItemsHtml}
        </div>
      `;
    }
  }

  // 5. Render Portfolio & Projects
  if (portfolio && portfolio.length > 0) {
    let portItemsHtml = '';
    portfolio.forEach(port => {
      if (port.title || port.role || port.link || port.description || port.technologies) {
        let linkBadge = '';
        if (port.link) {
          const cleanUrl = port.link.replace(/(^\w+:|^)\/\//, '').substring(0, 30) + (port.link.length > 30 ? '...' : '');
          linkBadge = `<a href="${port.link}" target="_blank" class="cv-portfolio-link"><i class="fas fa-external-link-alt"></i> ${cleanUrl}</a>`;
        }

        portItemsHtml += `
          <div class="cv-portfolio-item">
            <div class="cv-portfolio-item-title">
              <span>${port.title || 'Proje Adı'} ${port.role ? `<span style="font-weight: 500; font-size: 8.5pt; color: var(--cv-text-light);">(${port.role})</span>` : ''}</span>
              ${linkBadge}
            </div>
            ${port.description ? `<p class="cv-portfolio-desc">${port.description}</p>` : ''}
            ${port.technologies ? `<div><span class="cv-portfolio-tech">${port.technologies}</span></div>` : ''}
          </div>
        `;
      }
    });

    if (portItemsHtml !== '') {
      html += `
        <div class="cv-section">
          <div class="cv-section-title">Projeler & Portfolyo</div>
          <div class="cv-portfolio-grid">
            ${portItemsHtml}
          </div>
        </div>
      `;
    }
  }

  // 6. Render Skills
  if (skills && skills.length > 0) {
    let skillsItemsHtml = '';
    skills.forEach(skill => {
      if (skill.category || skill.details) {
        skillsItemsHtml += `
          <div class="cv-skill-line">
            <span class="cv-skill-category">${skill.category || 'Kategori'}:</span>
            <span class="cv-skill-details">${skill.details || ''}</span>
          </div>
        `;
      }
    });

    if (skillsItemsHtml !== '') {
      html += `
        <div class="cv-section">
          <div class="cv-section-title">Yetenekler</div>
          <div class="cv-skills-list">
            ${skillsItemsHtml}
          </div>
        </div>
      `;
    }
  }

  // 7. Render Languages
  if (languages && languages.length > 0) {
    let langItemsHtml = '';
    languages.forEach(lang => {
      if (lang.language || lang.level) {
        langItemsHtml += `
          <div class="cv-lang-item">
            <span class="cv-lang-name">${lang.language}</span>
            <span class="cv-lang-level">(${lang.level})</span>
          </div>
        `;
      }
    });

    if (langItemsHtml !== '') {
      html += `
        <div class="cv-section">
          <div class="cv-section-title">Diller</div>
          <div class="cv-languages-list">
            ${langItemsHtml}
          </div>
        </div>
      `;
    }
  }

  elements.cvPaper.innerHTML = html;
}

// ==========================================================================
// Import & Export Handlers
// ==========================================================================
function exportStateAsJSON() {
  const jsonString = JSON.stringify(cvState, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchor = document.createElement('a');
  
  // Format filename using candidate name
  const nameSlug = (cvState.personalInfo.fullName || 'cv-data')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
    
  downloadAnchor.href = url;
  downloadAnchor.download = `${nameSlug}-ats-cv.json`;
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  
  // Cleanup
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}

function importStateFromJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Basic validation of import structure
      if (importedData.personalInfo && importedData.skills) {
        cvState = importedData;
        saveState();
        fillEditorInputs();
        renderListEditor('experiences');
        renderListEditor('education');
        renderListEditor('portfolio');
        renderListEditor('skills');
        renderListEditor('languages');
        renderCVPreview();
        alert("CV verileriniz başarıyla yüklendi!");
      } else {
        alert("Geçersiz CV dosyası formatı. Lütfen geçerli bir JSON CV dosyası seçin.");
      }
    } catch (err) {
      console.error("Error reading JSON file:", err);
      alert("Dosya okunurken bir hata oluştu.");
    }
  };
  reader.readAsText(file);
  // Reset file input
  elements.fileInput.value = '';
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
