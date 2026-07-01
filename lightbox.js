(function () {
  let overlay = null;
  let imageEl = null;
  let images = [];
  let currentIndex = 0;
  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let fullscreenRequested = false;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'ma8-lightbox';
    overlay.innerHTML = `
      <div class="ma8-lightbox-inner">
        <div class="ma8-lightbox-toolbar">
          <button type="button" data-action="close">Закрыть</button>
          <button type="button" data-action="reset">Сброс</button>
        </div>
        <div class="ma8-lightbox-nav">
          <button type="button" data-action="prev">←</button>
          <button type="button" data-action="next">→</button>
        </div>
        <div class="ma8-lightbox-image-wrap">
          <img class="ma8-lightbox-image" alt="Просмотр задачи">
        </div>
        <div class="ma8-lightbox-info"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    imageEl = overlay.querySelector('.ma8-lightbox-image');
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.dataset.action === 'close') close();
    });
    overlay.querySelector('[data-action="reset"]').addEventListener('click', resetZoom);
    overlay.querySelector('[data-action="prev"]').addEventListener('click', () => navigate(-1));
    overlay.querySelector('[data-action="next"]').addEventListener('click', () => navigate(1));

    imageEl.addEventListener('pointerdown', onPointerDown);
    imageEl.addEventListener('pointermove', onPointerMove);
    imageEl.addEventListener('pointerup', onPointerUp);
    imageEl.addEventListener('pointerleave', onPointerUp);
    imageEl.addEventListener('wheel', onWheel, { passive: false });
    overlay.addEventListener('touchstart', onTouchStart, { passive: true });
    overlay.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return overlay;
  }

  function open(nextImages, index, fullscreen) {
    images = nextImages || [];
    if (!images.length) return;
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    fullscreenRequested = Boolean(fullscreen);
    ensureOverlay();
    render();
    overlay.classList.add('open');
    document.body.classList.add('ma8-lock');
    if (fullscreenRequested && document.fullscreenEnabled) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.classList.remove('ma8-lock');
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    resetTransform();
  }

  function render() {
    if (!overlay || !imageEl || !images.length) return;
    const current = images[currentIndex];
    imageEl.src = current.path;
    imageEl.alt = current.title || `Задача ${currentIndex + 1}`;
    overlay.querySelector('.ma8-lightbox-info').textContent = `${currentIndex + 1} / ${images.length}`;
    resetTransform();
  }

  function navigate(step) {
    currentIndex = (currentIndex + step + images.length) % images.length;
    render();
  }

  function resetTransform() {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    lastX = 0;
    lastY = 0;
    updateTransform();
  }

  function resetZoom() {
    resetTransform();
  }

  function updateTransform() {
    if (!imageEl) return;
    imageEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`;
  }

  function onWheel(event) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.15 : 0.15;
    zoom = Math.min(3, Math.max(1, zoom + delta));
    updateTransform();
  }

  function onPointerDown(event) {
    if (zoom <= 1) return;
    dragging = true;
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    imageEl.classList.add('dragging');
    imageEl.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;
    lastX = offsetX;
    lastY = offsetY;
    updateTransform();
  }

  function onPointerUp() {
    dragging = false;
    imageEl?.classList.remove('dragging');
  }

  let touchStartX = 0;
  let touchStartY = 0;

  function onTouchStart(event) {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function onTouchEnd(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      navigate(deltaX < 0 ? 1 : -1);
    }
  }

  function onKeyDown(event) {
    if (!overlay?.classList.contains('open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') navigate(1);
    if (event.key === 'ArrowLeft') navigate(-1);
  }

  window.MA8Lightbox = {
    open,
    close,
    render,
    navigate,
    resetZoom
  };
})();
