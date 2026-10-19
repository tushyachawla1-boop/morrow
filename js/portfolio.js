// Portfolio Projects Interactions: Greenhouse, Orchard, and Tomorrow Machine

(function() {
  // 1. The Idea Greenhouse
  const chamber = document.getElementById('greenhouse-chamber');
  const mistBtn = document.getElementById('btn-mist-spray');
  const lampBtn = document.getElementById('btn-warm-lamp');
  const greenhouseStatus = document.getElementById('greenhouse-status');
  const bulbGlow = document.getElementById('greenhouse-bulb-glow');

  let isLamped = false;

  if (mistBtn && chamber) {
    mistBtn.addEventListener('click', () => {
      chamber.classList.add('misted');
      if (greenhouseStatus) greenhouseStatus.textContent = "Humidity: 94% • Dew drops forming on cloche";
      if (window.gardenAudio) {
        window.gardenAudio.playMist();
        setTimeout(() => window.gardenAudio.playChime(659.25, 0.4), 300);
      }
      setTimeout(() => {
        chamber.classList.remove('misted');
        if (greenhouseStatus) greenhouseStatus.textContent = "Climate: Stable & Gentle";
      }, 3500);
    });
  }

  if (lampBtn && bulbGlow) {
    lampBtn.addEventListener('click', () => {
      isLamped = !isLamped;
      if (isLamped) {
        bulbGlow.setAttribute('fill', '#ffeaa7');
        bulbGlow.setAttribute('filter', 'url(#lampGlowFilter)');
        lampBtn.classList.add('active');
        if (greenhouseStatus) greenhouseStatus.textContent = "Warmth: Golden Sunbeam Active";
        if (window.gardenAudio) window.gardenAudio.playChime(783.99, 0.5);
      } else {
        bulbGlow.setAttribute('fill', '#555555');
        bulbGlow.removeAttribute('filter');
        lampBtn.classList.remove('active');
        if (greenhouseStatus) greenhouseStatus.textContent = "Warmth: Cool Night Shade";
        if (window.gardenAudio) window.gardenAudio.playChime(523.25, 0.3);
      }
    });
  }

  // 2. The Story Orchard
  const orchardStage = document.getElementById('orchard-stage');
  const shakeBtn = document.getElementById('btn-shake-branch');
  const basketDisplay = document.getElementById('story-basket-display');
  const fruits = document.querySelectorAll('.hanging-fruit');

  const storyFragments = [
    "“The boy built a radio out of tin foil, but it only received whispers from the stars.”",
    "“An old blog entry from 2001: ‘Will update tomorrow when the storm passes.’ It never was updated.”",
    "“A recipe for ink brewed from crushed blackcurrants and midnight dew.”",
    "“A map of a library where books grow on vines and can only be read at dawn.”",
    "“A tiny clockwork bird that could only sing songs that had been forgotten.”"
  ];

  function harvestStory() {
    if (!orchardStage) return;
    orchardStage.classList.add('shaking');
    if (window.gardenAudio) {
      window.gardenAudio.playRustle();
      setTimeout(() => window.gardenAudio.playChime(698.46, 0.4), 250); // F5
    }

    const randomStory = storyFragments[Math.floor(Math.random() * storyFragments.length)];
    setTimeout(() => {
      orchardStage.classList.remove('shaking');
      if (basketDisplay) {
        basketDisplay.textContent = randomStory;
        basketDisplay.style.animation = 'tagUnfold 0.4s ease';
        setTimeout(() => basketDisplay.style.animation = '', 400);
      }
    }, 500);
  }

  if (shakeBtn) {
    shakeBtn.addEventListener('click', harvestStory);
  }

  fruits.forEach(fruit => {
    fruit.addEventListener('click', harvestStory);
    fruit.setAttribute('role', 'button');
    fruit.setAttribute('tabindex', '0');
    fruit.setAttribute('aria-label', "Fruit lantern. Click to harvest a story fragment.");
    fruit.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        harvestStory();
      }
    });
  });

  // 3. The Tomorrow Machine
  const machineStage = document.getElementById('machine-stage');
  const crankBtn = document.getElementById('btn-crank-machine');
  const tickerTape = document.getElementById('machine-ticker-display');

  const tickerPrognoses = [
    "88% Chance of Becoming a Children's Picture Book",
    "95% Ready for Autumn Sprouting (Needs 2 cups of tea)",
    "Requires 3 More Days of Stargazing Before Blooming",
    "Tender Curiosity: Thrives in Quiet Afternoon Light",
    "Certified Whimsical Invention: Sprout Imminent!"
  ];

  if (crankBtn && machineStage) {
    crankBtn.addEventListener('click', () => {
      machineStage.classList.add('cranking');
      crankBtn.disabled = true;

      if (window.gardenAudio) {
        for (let i = 0; i < 6; i++) {
          setTimeout(() => window.gardenAudio.playGearTick(), i * 160);
        }
      }

      setTimeout(() => {
        machineStage.classList.remove('cranking');
        crankBtn.disabled = false;
        const result = tickerPrognoses[Math.floor(Math.random() * tickerPrognoses.length)];
        if (tickerTape) {
          tickerTape.textContent = result;
          tickerTape.style.transform = 'scale(1.04)';
          setTimeout(() => tickerTape.style.transform = '', 200);
        }
        if (window.gardenAudio) {
          window.gardenAudio.playChime(880, 0.5); // A5 bell
        }
      }, 1200);
    });
  }
})();
