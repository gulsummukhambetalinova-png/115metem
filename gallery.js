(function () {
  const LAZY_THRESHOLD = 120;

  function createLazyImage(src, alt) {
    const img = document.createElement('img');
    img.alt = alt || 'Задача';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.dataset.src = src;
    img.className = 'ma8-preview-image';
    return img;
  }

  function renderGallery(variant, content, onRendered) {
    const grid = document.getElementById('ma8-gallery-grid');
    if (!grid) return;

    window.MA8Gallery.currentImages = [];

    fetch(variant.manifest, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Manifest not found');
        return response.json();
      })
      .then((images) => {
        grid.innerHTML = '';
        if (!images || !images.length) {
          grid.innerHTML = '<div class="ma8-empty">В этой папке пока нет изображений. Добавьте файлы и запустите генератор манифеста.</div>';
          return;
        }

        window.MA8Gallery.currentImages = images;

        images.forEach((image, index) => {
          const card = document.createElement('article');
          card.className = 'gallery-card';
          card.innerHTML = `
            <div class="gallery-card-head">
              <strong>Задача ${image.taskNumber || index + 1}</strong>
              <span>${variant.label}</span>
            </div>
            <div class="gallery-card-preview"></div>
            <div class="gallery-card-actions">
              <button class="ma8-action-btn" data-action="zoom">Увеличить</button>
              <button class="ma8-action-btn" data-action="fullscreen">Полный экран</button>
              <button class="ma8-action-btn" data-action="prev">Предыдущая</button>
              <button class="ma8-action-btn" data-action="next">Следующая</button>
            </div>
          `;
          const preview = card.querySelector('.gallery-card-preview');
          const lazyImg = createLazyImage(image.path, image.title || `Задача ${index + 1}`);
          preview.appendChild(lazyImg);

          card.querySelector('[data-action="zoom"]').addEventListener('click', () => {
            window.MA8Lightbox?.open?.(images, index, false);
            window.MA8Progress?.markViewed?.(variant.id, image.path);
          });
          card.querySelector('[data-action="fullscreen"]').addEventListener('click', () => {
            window.MA8Lightbox?.open?.(images, index, true);
            window.MA8Progress?.markViewed?.(variant.id, image.path);
          });
          card.querySelector('[data-action="prev"]').addEventListener('click', () => {
            const targetIndex = (index - 1 + images.length) % images.length;
            window.MA8Lightbox?.open?.(images, targetIndex, false);
            window.MA8Progress?.markViewed?.(variant.id, images[targetIndex].path);
          });
          card.querySelector('[data-action="next"]').addEventListener('click', () => {
            const targetIndex = (index + 1) % images.length;
            window.MA8Lightbox?.open?.(images, targetIndex, false);
            window.MA8Progress?.markViewed?.(variant.id, images[targetIndex].path);
          });
          grid.appendChild(card);
        });

        setupLazyLoading();
        onRendered?.();
      })
      .catch(() => {
        grid.innerHTML = '<div class="ma8-empty">Не удалось загрузить манифест варианта. Проверьте наличие файла images.json.</div>';
      });
  }

  function setupLazyLoading() {
    const images = Array.from(document.querySelectorAll('.ma8-preview-image'));
    if (!('IntersectionObserver' in window)) {
      images.forEach((img) => loadImage(img));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, { rootMargin: `${LAZY_THRESHOLD}px 0px ${LAZY_THRESHOLD}px 0px` });

    images.forEach((img) => observer.observe(img));
  }

  function loadImage(img) {
    if (!img || img.dataset.loaded === 'true') return;
    const src = img.dataset.src;
    if (!src) return;
    img.src = src;
    img.dataset.loaded = 'true';
  }

  window.MA8Gallery = {
    renderGallery,
    setupLazyLoading,
    currentImages: []
  };
})();
