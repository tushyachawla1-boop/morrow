// Secret Easter Egg: Clickable hidden seed that wakes Morrow and reveals secret lore

(function() {
  const secretBtn = document.getElementById('secret-seed-trigger');
  const modal = document.getElementById('easter-egg-modal');
  const closeModalBtn = document.getElementById('close-secret-modal');
  const morrowHero = document.getElementById('morrow-hero-character');

  if (!secretBtn || !modal) return;

  function spawnSporeParticles() {
    if (!morrowHero) return;
    const rect = morrowHero.getBoundingClientRect();
    const symbols = ['✨', '🌱', '💛', '🌸', '⭐', '🌿'];

    for (let i = 0; i < 12; i++) {
      const spore = document.createElement('div');
      spore.className = 'spore-particle';
      spore.textContent = symbols[i % symbols.length];

      // Random particle trajectory
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
      const dist = 60 + Math.random() * 80;
      const dx = `${Math.cos(angle) * dist}px`;
      const dy = `${Math.sin(angle) * dist - 30}px`;

      spore.style.setProperty('--dx', dx);
      spore.style.setProperty('--dy', dy);
      spore.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
      spore.style.top = `${rect.top + rect.height * 0.4 + window.scrollY}px`;

      document.body.appendChild(spore);
      setTimeout(() => spore.remove(), 1600);
    }
  }

  function triggerEasterEgg() {
    // 1. Play joyful sound cascade
    if (window.gardenAudio) {
      window.gardenAudio.playEasterEgg();
    }

    // 2. Animate Morrow waking up with surprise
    if (morrowHero) {
      morrowHero.classList.add('waking');
      spawnSporeParticles();
      setTimeout(() => {
        morrowHero.classList.remove('waking');
      }, 1800);
    }

    // 3. Open secret parchment modal
    setTimeout(() => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (closeModalBtn) closeModalBtn.focus();
    }, 600);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    secretBtn.focus();
  }

  secretBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerEasterEgg();
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside modal box
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
})();
