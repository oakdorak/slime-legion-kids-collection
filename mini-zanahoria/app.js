/* ==========================================================================
   MINIZANAHORIA: LA AVENTURA ADAPTATIVA - APPLICATION LOGIC
   ========================================================================== */

// --- Audio Synthesizer Engine (Web Audio API) ---
const AudioEngine = {
  ctx: null,
  filter: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Clinical Low-Pass Filter at 1000Hz (Sensory hypersensitivity protection)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);
      this.filter.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    // C Major 9th chord (Bill Evans scale): C4, E4, G4, B4, D5
    const notes = [261.63, 329.63, 392.00, 493.88, 587.33];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle'; // Smooth, low-sensory wave
      osc.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(0, now);
      
      const attackTime = 0.15; // 150ms soft attack
      const delay = index * 0.06; // Strum arpeggiator delay
      
      gainNode.gain.linearRampToValueAtTime(0.04, now + delay + attackTime);
      gainNode.gain.setValueAtTime(0.04, now + delay + 1.0);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.8);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + 1.8);
    });
  },

  playError() {
    this.init();
    const now = this.ctx.currentTime;
    // Low, soothing minor warning sweep (no sudden scare sound)
    const notes = [196.00, 185.00]; // G3 to Gb3 (descending semitone slide)
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (index * 0.1));
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now);
      osc.stop(now + 0.4);
    });
  },

  playClick() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5 quick soft tick
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.03, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(this.filter);
    
    osc.start(now);
    osc.stop(now + 0.08);
  },
  
  playActionUnlock() {
    this.init();
    const now = this.ctx.currentTime;
    // Sparkly Lydian arpeggio (C4 -> F#4 -> G4)
    const notes = [261.63, 369.99, 392.00];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (index * 0.08));
      
      gainNode.gain.setValueAtTime(0, now + (index * 0.08));
      gainNode.gain.linearRampToValueAtTime(0.05, now + (index * 0.08) + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (index * 0.08) + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + (index * 0.08));
      osc.stop(now + (index * 0.08) + 0.8);
    });
  }
};

// --- Mascot SVG Generator ---
function getMascotSVG(emotion = 'happy', gazeDirection = 'center') {
  // Gaze Offset parameters
  let pupilX = 0;
  let pupilY = 0;
  let headRotation = 0;

  if (gazeDirection === 'NW') { pupilX = -6; pupilY = -5; headRotation = -8; }
  else if (gazeDirection === 'NE') { pupilX = 6; pupilY = -5; headRotation = 8; }
  else if (gazeDirection === 'SW') { pupilX = -6; pupilY = 5; headRotation = -4; }
  else if (gazeDirection === 'SE') { pupilX = 6; pupilY = 5; headRotation = 4; }

  // Emotion-specific Eye Paths and Mouth Shapes
  let eyesHTML = '';
  let mouthHTML = '';
  let cheekColor = '#ffb3ba';

  switch (emotion) {
    case 'happy':
      // Curved happy arcs for eyes
      eyesHTML = `
        <path d="M 22 42 Q 28 35 34 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" transform="translate(${pupilX/2}, 0)" />
        <path d="M 46 42 Q 52 35 58 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" transform="translate(${pupilX/2}, 0)" />
      `;
      // Wide open smiling mouth
      mouthHTML = `
        <path d="M 33 52 Q 40 62 47 52 Z" fill="#e74c3c" stroke="#231f24" stroke-width="2" />
      `;
      break;

    case 'sad':
      // Drooping sad eyes
      eyesHTML = `
        <path d="M 22 38 Q 28 44 34 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 46 38 Q 52 44 58 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <!-- Tears -->
        <circle cx="23" cy="46" r="3" fill="#3498db" />
        <circle cx="57" cy="46" r="3" fill="#3498db" />
      `;
      // Frowning mouth
      mouthHTML = `
        <path d="M 34 56 Q 40 48 46 56" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      cheekColor = 'transparent';
      break;

    case 'angry':
      // Slanted angry eyes and eyebrows
      eyesHTML = `
        <!-- Eyebrows -->
        <path d="M 20 32 L 34 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 60 32 L 46 38" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <!-- Pupils -->
        <circle cx="28" cy="42" r="4.5" fill="#231f24" />
        <circle cx="52" cy="42" r="4.5" fill="#231f24" />
      `;
      // Wavy or flat angry mouth
      mouthHTML = `
        <path d="M 32 54 Q 40 50 48 54" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
      cheekColor = '#ff6b6b';
      break;

    case 'surprised':
      // Wide circular open eyes
      eyesHTML = `
        <circle cx="28" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="28" cy="40" r="3" fill="#231f24" />
        <circle cx="52" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="52" cy="40" r="3" fill="#231f24" />
      `;
      // O-shaped mouth
      mouthHTML = `
        <circle cx="40" cy="54" r="5" fill="#231f24" />
      `;
      break;

    case 'tired':
      // Flat horizontal sleeping lines
      eyesHTML = `
        <line x1="22" y1="40" x2="34" y2="40" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
        <line x1="46" y1="40" x2="58" y2="40" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" />
      `;
      // Flat mouth
      mouthHTML = `
        <line x1="34" y1="54" x2="46" y2="54" stroke="#231f24" stroke-width="3" stroke-linecap="round" />
      `;
      break;

    default: // normal/gazing
      // Gaze responsive standard eyes
      eyesHTML = `
        <circle cx="28" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${28 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
        <circle cx="52" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${52 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
      `;
      // Small happy mouth
      mouthHTML = `
        <path d="M 36 50 Q 40 54 44 50" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
  }

  return `
    <svg viewBox="0 0 80 100" class="carrot-svg" style="transform: rotate(${headRotation}deg); transition: transform 0.3s ease;">
      <g>
        <!-- Carrot Main Body (Orange) -->
        <path d="M 20 25 C 20 12 60 12 60 25 C 60 45 46 85 40 95 C 34 85 20 45 20 25 Z" fill="#e67e22" stroke="#231f24" stroke-width="3" />
        
        <!-- Sage Leaves (Green) -->
        <path d="M 33 16 C 30 5 15 8 22 18 C 29 18 33 16 33 16 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />
        <path d="M 40 15 C 40 2 28 -2 34 14 C 40 14 40 15 40 15 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />
        <path d="M 47 16 C 50 5 65 8 58 18 C 51 18 47 16 47 16 Z" fill="#a8b28a" stroke="#231f24" stroke-width="2.5" />
        
        <!-- Texture details -->
        <path d="M 24 35 H 29" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 51 45 H 56" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 23 55 H 28" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        <path d="M 52 65 H 57" stroke="#d35400" stroke-width="2" stroke-linecap="round" />
        
        <!-- Blush cheeks -->
        <ellipse cx="23" cy="46" rx="4" ry="2" fill="${cheekColor}" opacity="0.8" />
        <ellipse cx="57" cy="46" rx="4" ry="2" fill="${cheekColor}" opacity="0.8" />
        
        <!-- Eyes -->
        ${eyesHTML}
        
        <!-- Mouth -->
        ${mouthHTML}
      </g>
    </svg>
  `;
}

// --- Application State ---
const State = {
  stars: parseInt(localStorage.getItem('minizanahoria_stars') || '0'),
  activeGame: 'orbit',
  
  addStar() {
    this.stars += 1;
    localStorage.setItem('minizanahoria_stars', this.stars);
    document.getElementById('star-count').innerText = this.stars;
  }
};

// --- DOM Navigation controller ---
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const panels = document.querySelectorAll('.game-panel');
  
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.playClick();
      navBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const gameName = btn.getAttribute('data-game');
      State.activeGame = gameName;
      
      const targetPanel = document.getElementById(`game-${gameName}`);
      targetPanel.classList.add('active');
      
      // Initialize the chosen game
      if (gameName === 'orbit') initFocusOrbit();
      if (gameName === 'emotion') initEmotionResonance();
      if (gameName === 'routine') initRoutineBuilder();
    });
  });

  // Init stars count
  document.getElementById('star-count').innerText = State.stars;
}

// --- Reward / Celebration Overlay Trigger ---
function triggerRewardCelebration() {
  AudioEngine.playSuccess();
  State.addStar();
  
  const screen = document.getElementById('celebration-screen');
  screen.classList.add('active');
}

document.getElementById('close-celebration-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  document.getElementById('celebration-screen').classList.remove('active');
});


// ==========================================================================
// GAME 1: FOCUS ORBIT (ATENCIÓN CONJUNTA)
// ==========================================================================
let orbitTargetQuadrant = '';
let orbitActiveRound = false;

function initFocusOrbit() {
  const container = document.getElementById('orbit-mascot-container');
  container.innerHTML = getMascotSVG('normal', 'center');
  container.className = "mascot-wrapper anim-idle";
  
  const quadrants = document.querySelectorAll('.grid-quadrant');
  quadrants.forEach(q => {
    q.className = 'grid-quadrant'; // Clear classes
  });
  
  document.getElementById('orbit-feedback').innerText = "Presiona iniciar para comenzar a enfocar.";
  orbitActiveRound = false;
}

document.getElementById('start-orbit-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  
  const quadrants = ['NW', 'NE', 'SW', 'SE'];
  orbitTargetQuadrant = quadrants[Math.floor(Math.random() * quadrants.length)];
  orbitActiveRound = true;
  
  // Update mascot gaze direction
  const container = document.getElementById('orbit-mascot-container');
  container.innerHTML = getMascotSVG('normal', orbitTargetQuadrant);
  container.className = "mascot-wrapper"; // Remove idle bobbing to keep focus clear
  
  // Clear quadrant states
  document.querySelectorAll('.grid-quadrant').forEach(q => {
    q.className = 'grid-quadrant';
  });

  document.getElementById('orbit-feedback').innerText = "Mira hacia dónde volteó Minizanahoria. ¡Selecciona su dirección!";
});

document.querySelectorAll('.grid-quadrant').forEach(quadrant => {
  quadrant.addEventListener('click', () => {
    if (!orbitActiveRound) return;
    
    const clickedQ = quadrant.getAttribute('data-quadrant');
    if (clickedQ === orbitTargetQuadrant) {
      // Success
      quadrant.classList.add('success-flash');
      document.getElementById('orbit-feedback').innerText = "¡Correcto! Excelente enfoque.";
      orbitActiveRound = false;
      
      // Update mascot to happy
      const container = document.getElementById('orbit-mascot-container');
      container.innerHTML = getMascotSVG('happy', 'center');
      container.className = "mascot-wrapper anim-spin";
      
      setTimeout(() => {
        triggerRewardCelebration();
      }, 700);
    } else {
      // Failure
      AudioEngine.playError();
      quadrant.classList.add('error-flash');
      document.getElementById('orbit-feedback').innerText = "Incorrecto. Mira con cuidado hacia dónde apunta.";
      
      // Temporary angry/sad mascot
      const container = document.getElementById('orbit-mascot-container');
      container.innerHTML = getMascotSVG('angry', orbitTargetQuadrant);
      container.className = "mascot-wrapper anim-angry";
      
      // Auto restore to normal look after 1.5s
      setTimeout(() => {
        container.innerHTML = getMascotSVG('normal', orbitTargetQuadrant);
        container.className = "mascot-wrapper";
        quadrant.classList.remove('error-flash');
      }, 1500);
    }
  });
});


// ==========================================================================
// GAME 2: EMOTION RESONANCE (IDENTIFICAR EMOCIONES)
// ==========================================================================
const EMOTIONS = {
  happy: {
    label: "Alegre",
    speech: "¡Me siento de maravilla hoy! ¿Jugamos?",
    correctAction: "celebrate",
    actions: [
      { id: "celebrate", label: "Celebrar y bailar juntos 🕺" },
      { id: "hug", label: "Darle un abrazo 🤗" },
      { id: "water", label: "Ofrecerle agua fría 💧" }
    ]
  },
  sad: {
    label: "Triste",
    speech: "Oh... mis hojitas se sienten pesadas hoy.",
    correctAction: "hug",
    actions: [
      { id: "nap", label: "Dejarle dormir una siesta 💤" },
      { id: "hug", label: "Abrazar con cuidado y escucharle 🤗" },
      { id: "music", label: "Tocar música animada 🎵" }
    ]
  },
  angry: {
    label: "Enojado",
    speech: "¡Grrr! ¡Las cosas no salieron como quería hoy!",
    correctAction: "relax",
    actions: [
      { id: "celebrate", label: "Tratar de hacerle bromas 🤡" },
      { id: "water", label: "Darle agua y un espacio tranquilo 💧" },
      { id: "relax", label: "Tomar respiraciones profundas juntos 🧘" }
    ]
  },
  surprised: {
    label: "Sorprendido",
    speech: "¡Oh! ¿Qué es este ruido tan fuerte?",
    correctAction: "earmuffs",
    actions: [
      { id: "earmuffs", label: "Ponerle audífonos bloqueadores 🎧" },
      { id: "shake", label: "Moverle para despertarle 👁️" },
      { id: "hug", label: "Correr rápidamente 🏃" }
    ]
  },
  tired: {
    label: "Cansado",
    speech: "Uaaah... se me cierran los ojitos.",
    correctAction: "nap",
    actions: [
      { id: "nap", label: "Acomodarle en su cama a dormir 💤" },
      { id: "celebrate", label: "Hacerle cosquillas 🤸" },
      { id: "water", label: "Darle una manzana para masticar 🍎" }
    ]
  }
};

let currentEmotionKey = '';
let emotionCorrectGuessed = false;

function initEmotionResonance() {
  const keys = Object.keys(EMOTIONS);
  currentEmotionKey = keys[Math.floor(Math.random() * keys.length)];
  emotionCorrectGuessed = false;
  
  // Set mascot SVG
  const container = document.getElementById('emotion-mascot-container');
  container.innerHTML = getMascotSVG(currentEmotionKey, 'center');
  container.className = `mascot-stage-wrapper anim-${currentEmotionKey === 'happy' ? 'idle' : (currentEmotionKey === 'sad' ? 'sad' : 'idle')}`;
  
  // Set speech bubble
  document.getElementById('emotion-speech').innerText = EMOTIONS[currentEmotionKey].speech;
  
  // Reset grids
  document.getElementById('care-options-group').classList.add('disabled');
  document.getElementById('emotion-feedback').innerText = "Selecciona la emoción correcta para desbloquear las acciones de cuidado.";
  
  // Render Guess Grid
  const guessGrid = document.getElementById('emotion-guess-grid');
  guessGrid.innerHTML = '';
  keys.forEach(key => {
    const card = document.createElement('button');
    card.className = 'option-card';
    card.innerText = EMOTIONS[key].label;
    card.addEventListener('click', () => handleEmotionGuess(key, card));
    guessGrid.appendChild(card);
  });
  
  // Render Actions Grid placeholder
  document.getElementById('emotion-action-grid').innerHTML = '';
}

function handleEmotionGuess(guessedKey, cardBtn) {
  if (emotionCorrectGuessed) return;
  
  if (guessedKey === currentEmotionKey) {
    AudioEngine.playActionUnlock();
    emotionCorrectGuessed = true;
    cardBtn.classList.add('correct');
    
    document.getElementById('emotion-feedback').innerText = `¡Correcto! Minizanahoria está ${EMOTIONS[currentEmotionKey].label}. Desbloqueado el panel de acciones.`;
    
    // Unlock actions
    document.getElementById('care-options-group').classList.remove('disabled');
    
    // Render care actions
    const actionGrid = document.getElementById('emotion-action-grid');
    actionGrid.innerHTML = '';
    EMOTIONS[currentEmotionKey].actions.forEach(action => {
      const actBtn = document.createElement('button');
      actBtn.className = 'option-card';
      actBtn.innerText = action.label;
      actBtn.addEventListener('click', () => handleActionSelection(action.id, actBtn));
      actionGrid.appendChild(actBtn);
    });
  } else {
    AudioEngine.playError();
    cardBtn.classList.add('incorrect');
    setTimeout(() => {
      cardBtn.classList.remove('incorrect');
    }, 1000);
  }
}

function handleActionSelection(actionId, actBtn) {
  const correctActId = EMOTIONS[currentEmotionKey].correctAction;
  
  if (actionId === correctActId) {
    // Correct care action
    actBtn.classList.add('correct');
    document.getElementById('emotion-feedback').innerText = "¡Excelente acción de cuidado! Has ayudado a Minizanahoria.";
    
    // Update mascot to spin/dance
    const container = document.getElementById('emotion-mascot-container');
    container.innerHTML = getMascotSVG('happy', 'center');
    container.className = "mascot-stage-wrapper anim-spin";
    
    setTimeout(() => {
      triggerRewardCelebration();
    }, 800);
  } else {
    AudioEngine.playError();
    actBtn.classList.add('incorrect');
    setTimeout(() => {
      actBtn.classList.remove('incorrect');
    }, 1000);
  }
}


// ==========================================================================
// GAME 3: ROUTINE BUILDER (SECUENCIAS DE LA VIDA DIARIA)
// ==========================================================================
const ROUTINE_DATA = {
  morning: {
    title: "Rutina de la Mañana",
    cards: [
      { id: "wake", label: "Despertar ☀️", order: 0 },
      { id: "wash", label: "Lavarse la Cara 🧼", order: 1 },
      { id: "eat", label: "Desayunar 🥕", order: 2 },
      { id: "pack", label: "Alistar Mochila 🎒", order: 3 }
    ]
  },
  evening: {
    title: "Rutina de la Noche",
    cards: [
      { id: "dinner", label: "Cenar Ligero 🍽️", order: 0 },
      { id: "teeth", label: "Cepillarse Dientes 🦷", order: 1 },
      { id: "book", label: "Leer un Cuento 📖", order: 2 },
      { id: "sleep", label: "Dormir 💤", order: 3 }
    ]
  }
};

let activeRoutine = 'morning';
let routineOrder = [];

function initRoutineBuilder() {
  const routine = ROUTINE_DATA[activeRoutine];
  
  // Set slots
  const slotsContainer = document.getElementById('routine-slots-container');
  slotsContainer.innerHTML = '';
  
  // We need 4 slots
  for (let i = 0; i < 4; i++) {
    const slot = document.createElement('div');
    slot.className = 'routine-slot';
    slot.setAttribute('data-index', i + 1);
    
    // Drag & drop listeners for slots
    slot.addEventListener('dragover', e => e.preventDefault());
    slot.addEventListener('dragenter', () => slot.classList.add('dragover'));
    slot.addEventListener('dragleave', () => slot.classList.remove('dragover'));
    slot.addEventListener('drop', e => handleDropOnSlot(e, slot));
    
    slotsContainer.appendChild(slot);
  }
  
  // Set cards (shuffled)
  const cardsContainer = document.getElementById('routine-cards-container');
  cardsContainer.innerHTML = '';
  
  const shuffledCards = [...routine.cards].sort(() => Math.random() - 0.5);
  shuffledCards.forEach(cardData => {
    const card = document.createElement('div');
    card.className = 'routine-card';
    card.setAttribute('draggable', 'true');
    card.setAttribute('data-id', cardData.id);
    card.setAttribute('data-order', cardData.order);
    
    // Icon splitter
    const splitLabel = cardData.label.split(" ");
    const textPart = splitLabel.slice(0, -1).join(" ");
    const emojiPart = splitLabel[splitLabel.length - 1];
    
    card.innerHTML = `
      <span class="card-emoji">${emojiPart}</span>
      <span class="card-text">${textPart}</span>
    `;
    
    // Drag listeners
    card.addEventListener('dragstart', () => {
      card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });
    
    cardsContainer.appendChild(card);
  });
  
  document.getElementById('routine-feedback').innerText = "Arrastra las tarjetas en el orden correcto.";
}

function handleDropOnSlot(e, slot) {
  slot.classList.remove('dragover');
  const draggingCard = document.querySelector('.routine-card.dragging');
  
  if (draggingCard) {
    AudioEngine.playClick();
    
    // Check if slot has children. If yes, move existing child back to source.
    if (slot.children.length > 0) {
      const existingCard = slot.children[0];
      document.getElementById('routine-cards-container').appendChild(existingCard);
    }
    
    slot.appendChild(draggingCard);
  }
}

// Allow dropping back to the source deck
const cardsSourceDeck = document.getElementById('routine-cards-container');
cardsSourceDeck.addEventListener('dragover', e => e.preventDefault());
cardsSourceDeck.addEventListener('drop', () => {
  const draggingCard = document.querySelector('.routine-card.dragging');
  if (draggingCard) {
    AudioEngine.playClick();
    cardsSourceDeck.appendChild(draggingCard);
  }
});

document.getElementById('check-routine-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  const slots = document.querySelectorAll('.routine-slot');
  let allCorrect = true;
  let missing = false;
  
  slots.forEach((slot, index) => {
    if (slot.children.length === 0) {
      missing = true;
      allCorrect = false;
      return;
    }
    
    const cardOrder = parseInt(slot.children[0].getAttribute('data-order'));
    if (cardOrder !== index) {
      allCorrect = false;
    }
  });
  
  if (missing) {
    AudioEngine.playError();
    document.getElementById('routine-feedback').innerText = "Coloca todas las tarjetas en los espacios vacíos.";
    return;
  }
  
  if (allCorrect) {
    document.getElementById('routine-feedback').innerText = "¡Increíble! Toda la secuencia está en el orden correcto.";
    
    // Toggle active routine type for next round
    activeRoutine = activeRoutine === 'morning' ? 'evening' : 'morning';
    
    setTimeout(() => {
      triggerRewardCelebration();
    }, 600);
  } else {
    AudioEngine.playError();
    document.getElementById('routine-feedback').innerText = "Secuencia incorrecta. Observa los pasos y reordénalos.";
  }
});

document.getElementById('reset-routine-btn').addEventListener('click', () => {
  AudioEngine.playClick();
  initRoutineBuilder();
});


// ==========================================================================
// BOOTSTRAP INITIALIZATION
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFocusOrbit(); // Default game on startup
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AudioEngine,
    getMascotSVG,
    State,
    EMOTIONS,
    ROUTINE_DATA,
    initNavigation,
    triggerRewardCelebration,
    initFocusOrbit,
    initEmotionResonance,
    handleEmotionGuess,
    handleActionSelection,
    initRoutineBuilder,
  };
}
