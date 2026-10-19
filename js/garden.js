// Interactive Garden: Visitor Planting and Seed Sprouting Engine

(function() {
  const gardenGrid = document.getElementById('garden-plots-container');
  const ideaForm = document.getElementById('garden-idea-form');
  const ideaInput = document.getElementById('garden-idea-input');
  const weedBtn = document.getElementById('weed-garden-btn');
  const gardenCountSpan = document.getElementById('garden-bloom-count');

  if (!gardenGrid) return;

  const STORAGE_KEY = 'morrow_planted_seeds_v1';

  // Seed varieties with colors and SVG templates
  const SEED_TYPES = {
    bellflower: {
      name: "Bellflower",
      color: "#b388ff",
      stemColor: "#4f785b",
      soundFreq: 587.33,
      svg: `
        <svg class="plant-stem-svg sprout-enter" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 100 Q 38 60 40 35" stroke="#4f785b" stroke-width="4" stroke-linecap="round" fill="none" />
          <path d="M 40 70 Q 25 65 22 55 Q 32 52 40 65" fill="#6b9376" />
          <path d="M 40 50 Q 55 45 58 35 Q 48 32 40 45" fill="#6b9376" />
          <!-- Bell flower head -->
          <g transform="translate(40, 32)">
            <path d="M -16 -12 C -20 8, 20 8, 16 -12 C 10 -6, -10 -6, -16 -12 Z" fill="#b388ff" />
            <circle cx="0" cy="5" r="3.5" fill="#f4be5e" />
          </g>
        </svg>
      `
    },
    fern: {
      name: "Luminescent Fern",
      color: "#76c893",
      stemColor: "#3d6849",
      soundFreq: 440.0,
      svg: `
        <svg class="plant-stem-svg sprout-enter" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 100 Q 42 60 38 25" stroke="#3d6849" stroke-width="3.5" stroke-linecap="round" fill="none" />
          <path d="M 40 80 Q 20 75 16 68 Q 28 65 40 75" fill="#52b788" />
          <path d="M 40 65 Q 60 60 64 52 Q 52 50 40 60" fill="#76c893" />
          <path d="M 39 48 Q 24 42 20 35 Q 32 34 39 44" fill="#52b788" />
          <path d="M 38 35 Q 52 30 54 22 Q 44 22 38 31" fill="#76c893" />
          <circle cx="38" cy="22" r="3" fill="#d8f3dc" />
        </svg>
      `
    },
    starspore: {
      name: "Star Spore",
      color: "#f4be5e",
      stemColor: "#5b8266",
      soundFreq: 783.99,
      svg: `
        <svg class="plant-stem-svg sprout-enter" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 100 Q 40 60 40 30" stroke="#5b8266" stroke-width="3" stroke-linecap="round" fill="none" />
          <circle cx="40" cy="28" r="12" fill="#f4be5e" opacity="0.85" />
          <polygon points="40,12 43,24 55,27 45,34 47,46 39,38 31,45 34,33 24,27 36,24" fill="#fff7d6" />
          <circle cx="40" cy="28" r="4" fill="#ffffff" />
        </svg>
      `
    },
    goldenvine: {
      name: "Golden Vine",
      color: "#e07a5f",
      stemColor: "#496e54",
      soundFreq: 659.25,
      svg: `
        <svg class="plant-stem-svg sprout-enter" viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 40 100 Q 30 75 42 55 T 38 25" stroke="#496e54" stroke-width="4" stroke-linecap="round" fill="none" />
          <path d="M 35 70 Q 18 72 15 62 Q 26 58 36 66" fill="#e07a5f" />
          <path d="M 42 45 Q 60 44 62 34 Q 50 32 40 40" fill="#f4978e" />
          <circle cx="38" cy="22" r="7" fill="#f4be5e" />
          <circle cx="38" cy="22" r="3.5" fill="#e07a5f" />
        </svg>
      `
    }
  };

  // Pre-curated forgotten ideas for clickable empty plots
  const forgottenSeedPool = [
    { text: "A lost GeoCities fan site for mosses", type: "fern" },
    { text: "A recipe for dandelion tea from 2002", type: "goldenvine" },
    { text: "An unfinished fantasy story from a notebook", type: "bellflower" },
    { text: "A melody hummed while watching rain", type: "starspore" },
    { text: "A poem hidden in an HTML comment", type: "fern" },
    { text: "The dream of riding a pedal-powered airship", type: "starspore" },
    { text: "A letter written to tomorrow and never sent", type: "bellflower" },
    { text: "A sketchbook map of an imaginary island", type: "goldenvine" }
  ];

  let currentPlants = [];

  function loadPlants() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        currentPlants = JSON.parse(saved);
      } else {
        // Default starter plants
        currentPlants = [
          { id: 1, text: "A poem about dial-up tones", type: "bellflower", date: "2003" },
          { id: 2, text: "The unfinished Chapter 4", type: "fern", date: "2004" },
          { id: 3, text: "A mechanical dragonfly sketch", type: "starspore", date: "2005" }
        ];
        savePlants();
      }
    } catch (e) {
      currentPlants = [
        { id: 1, text: "A poem about dial-up tones", type: "bellflower" }
      ];
    }
  }

  function savePlants() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlants));
    } catch (e) {}
    updateCounter();
  }

  function updateCounter() {
    if (gardenCountSpan) {
      gardenCountSpan.textContent = `${currentPlants.length} ideas blooming`;
    }
  }

  function renderGarden() {
    gardenGrid.innerHTML = '';

    // Render blooming plants
    currentPlants.forEach((plant, index) => {
      const typeInfo = SEED_TYPES[plant.type] || SEED_TYPES.bellflower;
      const plot = document.createElement('div');
      plot.className = 'garden-plot';
      plot.setAttribute('role', 'button');
      plot.setAttribute('tabindex', '0');
      plot.setAttribute('aria-label', `Planted idea: ${plant.text}. Click to hear bloom.`);

      plot.innerHTML = `
        <span class="plot-tag-badge">Plot #${index + 1}</span>
        <div class="plot-dirt-texture"></div>
        <div class="plant-growth">
          ${typeInfo.svg}
          <div class="idea-tag-ribbon">
            <span>${escapeHTML(plant.text)}</span>
          </div>
        </div>
      `;

      plot.addEventListener('click', () => {
        if (window.gardenAudio) {
          window.gardenAudio.playChime(typeInfo.soundFreq, 0.5);
          window.gardenAudio.playRustle();
        }
        plot.style.transform = 'scale(1.05)';
        setTimeout(() => plot.style.transform = '', 200);
      });

      plot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          plot.click();
        }
      });

      gardenGrid.appendChild(plot);
    });

    // Provide 2 clickable empty plots ready for instant seed discovery
    for (let i = 0; i < 2; i++) {
      const emptyPlot = document.createElement('div');
      emptyPlot.className = 'garden-plot empty-plot';
      emptyPlot.setAttribute('role', 'button');
      emptyPlot.setAttribute('tabindex', '0');
      emptyPlot.setAttribute('aria-label', "Empty garden soil. Click to plant a forgotten idea.");

      emptyPlot.innerHTML = `
        <span class="plot-tag-badge">Open Soil</span>
        <div class="plot-dirt-texture"></div>
        <div class="seed-empty-prompt">
          <div class="empty-seed-hole"></div>
          <span>🌱 Click to plant</span>
        </div>
      `;

      emptyPlot.addEventListener('click', () => {
        plantRandomForgottenIdea();
      });

      emptyPlot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          emptyPlot.click();
        }
      });

      gardenGrid.appendChild(emptyPlot);
    }

    updateCounter();
  }

  function plantRandomForgottenIdea() {
    const seed = forgottenSeedPool[Math.floor(Math.random() * forgottenSeedPool.length)];
    addPlant(seed.text, seed.type);
  }

  function addPlant(text, type) {
    if (!text || !text.trim()) return;

    if (window.gardenAudio) {
      window.gardenAudio.playPop();
      setTimeout(() => {
        const typeInfo = SEED_TYPES[type] || SEED_TYPES.bellflower;
        window.gardenAudio.playChime(typeInfo.soundFreq, 0.6);
      }, 100);
    }

    currentPlants.push({
      id: Date.now(),
      text: text.trim(),
      type: type || 'bellflower'
    });

    savePlants();
    renderGarden();
  }

  // Handle visitor input form
  if (ideaForm && ideaInput) {
    // Type selector radio buttons
    const typePills = ideaForm.querySelectorAll('.seed-radio-btn');
    let selectedType = 'bellflower';

    typePills.forEach(pill => {
      pill.addEventListener('click', () => {
        typePills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedType = pill.dataset.type;
        if (window.gardenAudio) {
          window.gardenAudio.playChime(440, 0.15);
        }
      });
    });

    ideaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ideaInput.value.trim();
      if (!text) {
        ideaInput.focus();
        return;
      }

      addPlant(text, selectedType);
      ideaInput.value = '';
    });
  }

  // Clear / weed garden button
  if (weedBtn) {
    weedBtn.addEventListener('click', () => {
      if (confirm("Gently weed the garden back to starter seedlings?")) {
        localStorage.removeItem(STORAGE_KEY);
        loadPlants();
        renderGarden();
        if (window.gardenAudio) {
          window.gardenAudio.playRustle();
        }
      }
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initialize
  loadPlants();
  renderGarden();
})();
