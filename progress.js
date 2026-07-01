(function () {
  const STORAGE_KEY = 'ma8-progress';
  const summaryEl = () => document.getElementById('ma8-progress-summary');

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function markViewed(variantId, imagePath) {
    const progress = readProgress();
    if (!progress[variantId]) progress[variantId] = [];
    if (!progress[variantId].includes(imagePath)) {
      progress[variantId].push(imagePath);
      saveProgress(progress);
    }
    refresh(variantId);
  }

  function refresh(variantId) {
    const progress = readProgress();
    const images = window.MA8Gallery?.currentImages || [];
    const viewed = progress[variantId] || [];
    const total = images.length;
    if (summaryEl()) {
      summaryEl().textContent = `Просмотрено: ${viewed.length} из ${total}`;
    }
    const heroMeta = document.querySelector('.academy-8-meta');
    if (heroMeta) {
      const totalBadge = heroMeta.querySelectorAll('span')[1];
      if (totalBadge) totalBadge.textContent = `Всего задач: ${total}`;
    }
  }

  function resetSummary() {
    const summary = summaryEl();
    if (summary) summary.textContent = 'Просмотрено: 0 из 0';
  }

  window.MA8Progress = {
    markViewed,
    refresh,
    resetSummary
  };
})();
