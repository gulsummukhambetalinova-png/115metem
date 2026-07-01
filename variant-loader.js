(function () {
  const VARIANTS = [
    { id: 'variant1', label: '1 вариант', folder: '8 kl/1 вариант', manifest: '8 kl/1 вариант/images.json' },
    { id: 'variant2', label: '2 вариант', folder: '8 kl/2 вариант', manifest: '8 kl/2 вариант/images.json' },
    { id: 'variant3', label: '3 вариант', folder: '8 kl/3 вариант', manifest: '8 kl/3 вариант/images.json' }
  ];

  const STORAGE_KEY = 'ma8-academy-state-v1';

  function init() {
    addVariantMenuEntry();
    const content = document.getElementById('content-area');
    if (!content) return;

    const state = readState();
    if (state && state.selectedVariant) {
      loadVariant(state.selectedVariant);
    } else {
      renderVariantChooser(content);
    }
  }

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function saveState(nextState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  function addVariantMenuEntry() {
    const toggles = Array.from(document.querySelectorAll('.grade-toggle'));
    const targetToggle = toggles.find((toggle) => toggle.textContent.includes('8 класс'));
    const submenu = targetToggle?.nextElementSibling;
    if (!submenu || submenu.querySelector('[data-ma8-section]')) return;

    const button = document.createElement('button');
    button.className = 'sub-btn';
    button.dataset.ma8Section = 'true';
    button.innerHTML = '<span class="sub-icon">🖼️</span>Олимпиадные варианты';
    button.addEventListener('click', () => {
      document.querySelectorAll('.sub-btn').forEach((item) => item.classList.remove('active-sub'));
      button.classList.add('active-sub');
      renderVariantChooser(document.getElementById('content-area'));
      if (window.innerWidth < 900) {
        document.getElementById('sidebar')?.classList.remove('open');
      }
    });
    submenu.appendChild(button);
  }

  function renderVariantChooser(content) {
    if (!content) return;
    const html = `
      <div class="academy-8-class">
        <div class="academy-8-hero">
          <div class="academy-8-eyebrow">8 класс</div>
          <h2>Олимпиадные варианты</h2>
          <p>Выбирайте вариант, просматривайте задачи по карточкам и сохраняйте прогресс по каждому изображению.</p>
          <div class="academy-8-meta">
            <span>Автоматическая загрузка</span>
            <span>Ленивая подгрузка</span>
            <span>Сохранение прогресса</span>
          </div>
        </div>
        <div class="variant-grid" id="ma8-variant-grid"></div>
      </div>
    `;
    content.innerHTML = html;
    const grid = document.getElementById('ma8-variant-grid');
    if (!grid) return;
    VARIANTS.forEach((variant) => {
      const button = document.createElement('button');
      button.className = 'variant-card';
      button.innerHTML = `
        <div class="variant-badge">${variant.label.charAt(0)}</div>
        <h3>${variant.label}</h3>
        <p>Откройте папку варианта и просмотрите все задачи в современной галерее.</p>
        <small>Открыть →</small>
      `;
      button.addEventListener('click', () => loadVariant(variant.id));
      grid.appendChild(button);
    });
  }

  function loadVariant(variantId) {
    const content = document.getElementById('content-area');
    const variant = VARIANTS.find((item) => item.id === variantId);
    if (!content || !variant) return;

    const state = readState() || {};
    state.selectedVariant = variantId;
    saveState(state);

    content.innerHTML = `
      <div class="academy-8-class">
        <div class="academy-8-hero">
          <div class="academy-8-eyebrow">8 класс</div>
          <h2>${variant.label}</h2>
          <p>Загружаем изображения из соответствующей папки варианта и показываем их в карточках.</p>
          <div class="academy-8-meta">
            <span id="ma8-progress-summary">Просмотрено: 0 из 0</span>
            <span>Всего задач: 0</span>
          </div>
        </div>
        <div class="gallery-grid" id="ma8-gallery-grid"></div>
      </div>
    `;

    window.MA8Progress?.resetSummary?.();
    window.MA8Gallery?.renderGallery?.(variant, content, () => {
      window.MA8Progress?.refresh?.(variantId);
    });
  }

  window.MA8Academy = {
    VARIANTS,
    renderVariantChooser,
    loadVariant,
    init
  };

  document.addEventListener('DOMContentLoaded', init);
})();
