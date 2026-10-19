// Main Application Script: Day/Night Toggle, Sound Controls, Scroll Story Observer

(function() {
  // 1. Day / Night Toggle
  const themeToggle = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-toggle-icon');
  const themeText = document.getElementById('theme-toggle-text');
  const htmlRoot = document.documentElement;

  const SAVED_THEME = localStorage.getItem('morrow_theme') || 'night';
  if (SAVED_THEME === 'day') {
    htmlRoot.setAttribute('data-theme', 'day');
    updateThemeUI(true);
  } else {
    htmlRoot.removeAttribute('data-theme');
    updateThemeUI(false);
  }

  function updateThemeUI(isDay) {
    if (!themeToggle) return;
    if (isDay) {
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = 'Day';
      themeToggle.setAttribute('aria-label', 'Current theme: Day. Click to switch to Night.');
    } else {
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeText) themeText.textContent = 'Night';
      themeToggle.setAttribute('aria-label', 'Current theme: Night. Click to switch to Day.');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isCurrentlyDay = htmlRoot.getAttribute('data-theme') === 'day';
      const nextIsDay = !isCurrentlyDay;

      if (nextIsDay) {
        htmlRoot.setAttribute('data-theme', 'day');
        localStorage.setItem('morrow_theme', 'day');
      } else {
        htmlRoot.removeAttribute('data-theme');
        localStorage.setItem('morrow_theme', 'night');
      }

      updateThemeUI(nextIsDay);
      if (window.gardenAudio) {
        window.gardenAudio.playThemeSwitch(nextIsDay);
      }
    });
  }

  // 2. Sound Toggle
  const soundToggle = document.getElementById('sound-toggle-btn');
  const soundStatusText = document.getElementById('sound-status-text');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (window.gardenAudio) {
        const isAudible = window.gardenAudio.toggleMute();
        if (isAudible) {
          soundToggle.classList.add('playing');
          soundToggle.setAttribute('aria-pressed', 'true');
          soundToggle.setAttribute('aria-label', 'Sound is On. Click to mute.');
          if (soundStatusText) soundStatusText.textContent = 'Sound: On';
        } else {
          soundToggle.classList.remove('playing');
          soundToggle.setAttribute('aria-pressed', 'false');
          soundToggle.setAttribute('aria-label', 'Sound is Muted. Click to turn sound on.');
          if (soundStatusText) soundStatusText.textContent = 'Sound: Muted';
        }
      }
    });
  }

  // 3. Origin Story Scroll Observer
  const originCards = document.querySelectorAll('.origin-card');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.25,
      rootMargin: '0px 0px -40px 0px'
    });

    originCards.forEach(card => observer.observe(card));
  } else {
    // Fallback if IntersectionObserver not available
    originCards.forEach(card => card.classList.add('in-view'));
  }

  // 4. Generate Gentle Drifting Floating Seeds
  const skyCanvas = document.querySelector('.sky-canvas');
  if (skyCanvas) {
    const seedCount = 14;
    for (let i = 0; i < seedCount; i++) {
      const seed = document.createElement('div');
      seed.className = 'floating-seed';
      seed.style.left = `${Math.random() * 100}%`;
      seed.style.animationDelay = `${Math.random() * 14}s`;
      seed.style.animationDuration = `${10 + Math.random() * 10}s`;
      skyCanvas.appendChild(seed);
    }
  }

  // 5. Visitor Hit Counter Simulation (2003 authentic nostalgia)
  const hitCounter = document.getElementById('hit-counter-digits');
  if (hitCounter) {
    const baseCount = 4812;
    const visits = parseInt(localStorage.getItem('morrow_site_visits') || '0', 10) + 1;
    localStorage.setItem('morrow_site_visits', visits.toString());
    const total = baseCount + visits;
    hitCounter.textContent = String(total).padStart(6, '0');
  }
})();
