// Morrow character interaction: eye-tracking (mouse & touch), blinking, idle thoughts

(function() {
  const container = document.getElementById('morrow-hero-character');
  if (!container) return;

  const pupilLeft = document.getElementById('pupil-left');
  const pupilRight = document.getElementById('pupil-right');
  const speechBubble = document.getElementById('morrow-speech');
  const earLeft = document.getElementById('morrow-ear-l');
  const earRight = document.getElementById('morrow-ear-r');

  const maxDeflection = 5.5; // Max pupil travel in SVG units
  let isInteracting = false;
  let idleTimer = null;

  // Friendly whimsical idle quotes from Morrow
  const morrowQuotes = [
    "Not every little idea is ready to bloom.",
    "Did you hear that sprout waking up?",
    "Every forgotten thought has a place here.",
    "A bit of digital loam works wonders.",
    "I keep my seeds right here in my satchel!",
    "Patience is the sunlight of the mind.",
    "Welcome to the quiet edge of the web."
  ];

  function getFaceCenter() {
    const rect = container.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.45
    };
  }

  function updateEyes(targetX, targetY) {
    if (!pupilLeft || !pupilRight) return;
    const center = getFaceCenter();
    const dx = targetX - center.x;
    const dy = targetY - center.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    // Damped deflection distance
    const moveDist = Math.min(maxDeflection, dist / 40);
    const pupilX = Math.cos(angle) * moveDist;
    const pupilY = Math.sin(angle) * moveDist;

    pupilLeft.setAttribute('transform', `translate(${pupilX.toFixed(2)}, ${pupilY.toFixed(2)})`);
    pupilRight.setAttribute('transform', `translate(${pupilX.toFixed(2)}, ${pupilY.toFixed(2)})`);
  }

  // Pointer / Mouse tracking on desktop
  window.addEventListener('pointermove', (e) => {
    isInteracting = true;
    updateEyes(e.clientX, e.clientY);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { isInteracting = false; }, 4000);
  });

  // Touch tracking on mobile
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      isInteracting = true;
      updateEyes(e.touches[0].clientX, e.touches[0].clientY);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { isInteracting = false; }, 3000);
    }
  }, { passive: true });

  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      updateEyes(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Idle wandering gaze when user is still
  setInterval(() => {
    if (isInteracting) return;
    const wanderAngles = [0, 0.8, -0.8, 1.5, -1.5, 3.14];
    const randAngle = wanderAngles[Math.floor(Math.random() * wanderAngles.length)];
    const randDist = (Math.random() * 3.5);
    const px = Math.cos(randAngle) * randDist;
    const py = Math.sin(randAngle) * randDist;

    if (pupilLeft && pupilRight) {
      pupilLeft.setAttribute('transform', `translate(${px.toFixed(2)}, ${py.toFixed(2)})`);
      pupilRight.setAttribute('transform', `translate(${px.toFixed(2)}, ${py.toFixed(2)})`);
    }
  }, 2800);

  // Click on Morrow to interact
  container.addEventListener('click', (e) => {
    // If user clicked the secret seed, let the easter egg handler handle it
    if (e.target.closest('.secret-seed-btn')) return;

    if (window.gardenAudio) {
      window.gardenAudio.playChime(659.25, 0.4); // E5
      setTimeout(() => window.gardenAudio.playChime(783.99, 0.5), 120); // G5
    }

    // Ear wiggle
    if (earLeft) earLeft.style.transform = 'rotate(-15deg)';
    if (earRight) earRight.style.transform = 'rotate(15deg)';
    setTimeout(() => {
      if (earLeft) earLeft.style.transform = '';
      if (earRight) earRight.style.transform = '';
    }, 450);

    // Speak a quote
    if (speechBubble) {
      const randomQuote = morrowQuotes[Math.floor(Math.random() * morrowQuotes.length)];
      speechBubble.textContent = randomQuote;
      container.classList.add('speaking');
      setTimeout(() => {
        container.classList.remove('speaking');
      }, 3500);
    }
  });

  // Keyboard accessibility
  container.setAttribute('tabindex', '0');
  container.setAttribute('role', 'button');
  container.setAttribute('aria-label', "Morrow the Little Internet Gardener. Press Enter or Space to say hello.");
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      container.click();
    }
  });
})();
