/* ==========================================================================
   EL ÁGORA DE LA SOBERANÍA - MURO DE LOS ESPEJOS - APPLICATION LOGIC
   ========================================================================== */

// --- Mascot SVG Generator (Adapted for Agora with unique states) ---
(function() {
function getMascotSVG(emotion = 'happy', status = 'normal') {
  let headRotation = 0;
  let pupilX = 0;
  let pupilY = 0;

  if (status === 'listening') {
    headRotation = 4;
    pupilY = 2;
  } else if (status === 'thinking') {
    headRotation = -6;
    pupilX = -3;
    pupilY = -3;
  }

  let eyesHTML = '';
  let mouthHTML = '';
  let cheekColor = '#ffb3ba';

  switch (emotion) {
    case 'happy':
      eyesHTML = `
        <path d="M 22 42 Q 28 35 34 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 46 42 Q 52 35 58 42" stroke="#231f24" stroke-width="3.5" stroke-linecap="round" fill="none" />
      `;
      mouthHTML = `
        <path d="M 33 52 Q 40 62 47 52 Z" fill="#e74c3c" stroke="#231f24" stroke-width="2" />
      `;
      break;

    case 'thinking':
      eyesHTML = `
        <circle cx="28" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="25" cy="37" r="3.5" fill="#231f24" />
        <circle cx="52" cy="40" r="7.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="49" cy="37" r="3.5" fill="#231f24" />
        <!-- Thinking Eyebrows -->
        <path d="M 20 31 Q 28 34 32 30" stroke="#231f24" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="M 48 30 Q 52 34 60 31" stroke="#231f24" stroke-width="2.5" stroke-linecap="round" fill="none" />
      `;
      mouthHTML = `
        <path d="M 36 53 Q 40 50 44 53" stroke="#231f24" stroke-width="3" stroke-linecap="round" fill="none" />
      `;
      cheekColor = '#e3e0a4'; // Muted gold blush
      break;

    case 'surprised':
      eyesHTML = `
        <circle cx="28" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="28" cy="40" r="3" fill="#231f24" />
        <circle cx="52" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3.5" />
        <circle cx="52" cy="40" r="3" fill="#231f24" />
      `;
      mouthHTML = `
        <circle cx="40" cy="55" r="5" fill="#231f24" />
      `;
      break;

    default: // normal
      eyesHTML = `
        <circle cx="28" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${28 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
        <circle cx="52" cy="40" r="8.5" fill="#fff" stroke="#231f24" stroke-width="3" />
        <circle cx="${52 + pupilX}" cy="${40 + pupilY}" r="4" fill="#231f24" />
      `;
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

// --- Audio Synthesizer (Comforting Chord Feedback) ---
const AgoraAudio = {
  ctx: null,
  filter: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.filter.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playStep() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, now); // E4 soft chime
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(this.filter);
    
    osc.start(now);
    osc.stop(now + 0.5);
  },

  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    // Lydian chord of peace (C4, E4, G#4, D5)
    const notes = [261.63, 329.63, 415.30, 587.33];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle';
      const delay = index * 0.08;
      
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.05, now + delay + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + 1.5);
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

  playError() {
    this.init();
    const now = this.ctx.currentTime;
    // Low, soothing minor warning sweep (no sudden scare sound)
    const notes = [196.00, 185.00]; // G3 to Gb3 descending semitone
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (index * 0.1));
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.05, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now);
      osc.stop(now + 0.4);
    });
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
      gainNode.gain.linearRampToValueAtTime(0.04, now + (index * 0.08) + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + (index * 0.08) + 0.6);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + (index * 0.08));
      osc.stop(now + (index * 0.08) + 0.6);
    });
  }
};

// --- Local Offline Mock Database (Cognitive Dialogues) ---
const MockDialogues = [
  {
    keywords: ["trampa", "hack", "roblox", "minecraft", "jugar", "ganar", "trolear", "trol"],
    red: "¡Totalmente comprensible! Hacer trampa o hackear te da una ventaja instantánea, te hace sentir súper poderoso y es emocionante ver cómo cambian las reglas del juego. Tu mente es muy astuta al encontrar esos atajos para divertirse y tener el control del servidor.",
    blue: "Sin embargo, los videojuegos operan bajo un código y reglas fijas. Si el servidor detecta los trucos, te aplicará un baneo automático perdiendo tu cuenta. Además, cuando un jugador altera el juego, los demás se frustran y se van. Si no hay otros jugadores, el juego desaparece y ya no tienes a quién trolear.",
    green: "¿Qué tal si usas esa mente brillante de programador para crear tu propio minijuego en Roblox Studio donde las trampas sean la regla oficial? Así, en lugar de romper las reglas de otros, inventas un espacio donde tu astucia sea el reto principal y tus amigos jueguen sabiendo qué esperar."
  },
  {
    keywords: ["dragón", "monstruo", "fuego", "volar", "alas", "mascota", "pelear", "batalla"],
    red: "¡Qué idea tan magnífica! Tu dragón es una criatura poderosa que no le teme a nada y vuela alto con sus alas encendidas en fuego. Tiene todo el derecho de proteger su territorio y demostrar que es el rey de los cielos con su llama indomable.",
    blue: "Pero en la física del mundo, el fuego consume combustible y oxígeno. Si tu dragón vuela demasiado alto, el aire frío y la falta de oxígeno apagarán sus llamas, dejándolo indefenso. Y si usa su fuego sin control, terminará quemando su propio bosque y su nido.",
    green: "¿Qué tal si tu dragón aprende a guardar su llama sagrada dentro de una gema de cristal templado en su pecho? De esta forma, puede volar en tormentas frías sin que se apague su fuego, y puede decidir exactamente cuándo usar su calor para construir o defender, cuidando su hogar."
  },
  {
    keywords: ["triste", "llorar", "pelear", "enojado", "enojo", "miedo", "solo", "grita", "mamá", "papá", "hermano"],
    red: "Es completamente válido que te sientas así. El enojo o la tristeza son alarmas naturales que se encienden cuando algo te parece injusto o te asusta. Tienes toda la razón de querer defenderte o de llorar para desahogar esa presión que sientes en el pecho.",
    blue: "No obstante, las emociones intensas nublan nuestra capacidad de ver con claridad. Gritar o pelear hace que las personas a tu alrededor se pongan a la defensiva y dejen de escucharte. El problema original sigue ahí, pero ahora hay una pelea nueva que resolver.",
    green: "¿Qué tal si cuando sientas que la alarma se enciende, haces una pausa física (escribes o dibujas el monstruo de la rabia en tu libreta) para sacarlo de tu mente? Una vez plasmado en papel, puedes explicárselo a los demás con calma: 'Esto es lo que me pasa'. Así ellos entenderán al monstruo sin tener que pelear con él."
  },
  {
    keywords: ["escuela", "tarea", "estudiar", "regla", "clase", "maestra", "aburrido", "no quiero"],
    red: "¡Es verdad! Pasar horas sentado haciendo tareas repetitivas puede ser muy aburrido y frustrante cuando tu mente quiere explorar, moverse o jugar. Tu deseo de libertad y de usar tu tiempo en lo que realmente te apasiona es muy valioso.",
    blue: "Pero el sistema escolar está diseñado para evaluar constancia y cumplimiento de objetivos básicos. Si no entregas las tareas, el registro marcará que no estás participando y tendrás que repetir el ciclo, lo cual significa pasar más tiempo en el mismo lugar aburrido.",
    green: "¿Qué tal si convertimos la tarea en una misión de exploración rápida? Ponte un temporizador de 20 minutos (como una run de un juego) para terminar lo obligatorio lo más rápido posible. Al ganarle al tiempo, liberas el resto de tu día para tus propios proyectos soberanos y creaciones libres."
  }
];

const FallbackDialogue = {
  red: "Tu idea es única y nace de tu propia imaginación. Es fantástico cómo buscas expresarte y crear tus propias respuestas ante lo que te rodea. Tu punto de vista es valioso porque refleja lo que sientes y piensas en este momento.",
  blue: "Pero vivimos en un mundo interconectado con reglas físicas, sociales y técnicas. Toda acción provoca una reacción en el sistema. Si empujamos los límites sin observar las consecuencias, podemos dañar nuestro entorno o perder nuestra propia libertad de actuar.",
  green: "¿Qué tal si tomamos el núcleo de tu deseo creativo y diseñamos un método estructurado para llevarlo a cabo sin dañar las reglas del juego? Al balancear tu libertad con el respeto a los límites, creas una obra indestructible."
};

// --- Application State ---
const State = {
  currentStep: 1,
  config: {
    provider: 'mock',
    apiUrl: 'http://localhost:11434/v1',
    apiKey: '',
    modelName: 'hermes-3'
  },
  library: []
};

// --- Load and Save Settings & Library ---
function loadPersistedData() {
  const savedConfig = localStorage.getItem('agora_config');
  if (savedConfig) {
    State.config = JSON.parse(savedConfig);
    document.getElementById('provider-select').value = State.config.provider;
    document.getElementById('api-url').value = State.config.apiUrl;
    document.getElementById('api-key').value = State.config.apiKey;
    document.getElementById('model-name').value = State.config.modelName;
  }
  
  const savedLibrary = localStorage.getItem('agora_library');
  if (savedLibrary) {
    State.library = JSON.parse(savedLibrary);
  }
  
  updateLibraryUI();
  updateStatusUI();
}

function saveConfig() {
  State.config.provider = document.getElementById('provider-select').value;
  State.config.apiUrl = document.getElementById('api-url').value;
  State.config.apiKey = document.getElementById('api-key').value;
  State.config.modelName = document.getElementById('model-name').value;
  
  localStorage.setItem('agora_config', JSON.stringify(State.config));
  updateStatusUI();
  
  // Visual notify
  const saveBtn = document.getElementById('save-settings-btn');
  const oldText = saveBtn.innerText;
  saveBtn.innerText = "¡Guardado! ✓";
  saveBtn.style.background = "var(--color-sage-green)";
  setTimeout(() => {
    saveBtn.innerText = oldText;
    saveBtn.style.background = "";
    document.getElementById('settings-panel').style.display = "none";
  }, 1000);
}

function updateStatusUI() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  
  dot.className = "status-dot";
  
  if (State.config.provider === 'mock') {
    dot.classList.add('online');
    text.innerText = "Simulador Local (Activo)";
  } else if (State.config.provider === 'ollama') {
    text.innerText = "Ollama Local (Verificando...)";
    // Check if Ollama is accessible
    fetch(`${State.config.apiUrl}/models`, { method: 'GET' })
      .then(res => {
        if (res.ok) {
          dot.classList.add('online');
          text.innerText = "Ollama Online";
        } else {
          dot.classList.add('error');
          text.innerText = "Ollama Error de Puerto";
        }
      })
      .catch(() => {
        dot.classList.add('error');
        text.innerText = "Ollama Offline";
      });
  } else if (State.config.provider === 'sakana') {
    dot.classList.add('online');
    text.innerText = "Sakana Fugu Configurado";
  }
}

// --- Stepper Navigation ---
function goToStep(step) {
  State.currentStep = step;
  AgoraAudio.playStep();
  
  // Hide all panels
  document.querySelectorAll('.phase-panel').forEach(p => p.classList.remove('active'));
  
  // Show active panel
  document.getElementById(`phase-${step}`).classList.add('active');
  
  // Update step nodes
  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById(`step-node-${i}`);
    node.className = "step-node";
    if (i < step) {
      node.classList.add('completed');
      node.innerText = "✓";
    } else if (i === step) {
      node.classList.add('active');
      node.innerText = i;
    } else {
      node.innerText = i;
    }
  }
  
  // Update progress bar width
  const progress = document.getElementById('stepper-progress');
  const width = ((step - 1) / 2) * 100;
  progress.style.width = `${width}%`;

  // Render Mascot if in Phase 2
  if (step === 2) {
    const container = document.getElementById('mascot-stage-container');
    container.innerHTML = getMascotSVG('normal', 'normal');
    container.className = "mascot-container anim-idle";
  }
}

// --- Web Speech API (Voice Input) ---
let recognition = null;
let isListening = false;

function initSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechBtn = document.getElementById('ofrenda-speech-btn');
  const textarea = document.getElementById('ofrenda-text');
  
  if (SpeechRecognition && speechBtn) {
    recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      isListening = true;
      speechBtn.classList.add('listening');
      // Set mascot animation to listening
      const container = document.getElementById('mascot-stage-container');
      container.innerHTML = getMascotSVG('happy', 'listening');
      container.className = "mascot-container anim-listening";
    };
    
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      if (textarea.value) {
        textarea.value += " " + text;
      } else {
        textarea.value = text;
      }
    };
    
    recognition.onerror = () => {
      isListening = false;
      speechBtn.classList.remove('listening');
      const container = document.getElementById('mascot-stage-container');
      container.innerHTML = getMascotSVG('thinking', 'normal');
    };
    
    recognition.onend = () => {
      isListening = false;
      speechBtn.classList.remove('listening');
      const container = document.getElementById('mascot-stage-container');
      container.innerHTML = getMascotSVG('normal', 'normal');
      container.className = "mascot-container anim-idle";
    };
    
    speechBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    });
  } else if (speechBtn) {
    speechBtn.style.display = "none"; // Hide if not supported
  }
}

// --- Semantic Local Matching (Fallback Mode) ---
function runMockSemanticProcessing(text) {
  const normalizedText = text.toLowerCase();
  
  for (let dialogue of MockDialogues) {
    for (let key of dialogue.keywords) {
      if (normalizedText.includes(key)) {
        return {
          red: dialogue.red,
          blue: dialogue.blue,
          green: dialogue.green
        };
      }
    }
  }
  
  return {
    red: FallbackDialogue.red,
    blue: FallbackDialogue.blue,
    green: FallbackDialogue.green
  };
}

// --- Query AI Engine (Ollama / Sakana Fugu) ---
async function queryAIEngine(userInput) {
  const systemPrompt = `
Eres un orquestador educativo local para niños de 8 a 12 años centrado en la Soberanía Cognitiva y Terapia Cognitivo-Conductual adaptativa.
Tu tarea es analizar la idea del niño y devolver UNICAMENTE un objeto JSON válido con tres claves.
Idea del niño: "${userInput}"

El JSON debe contener exactamente este formato:
{
  "red": "Tu respuesta para el Espejo Rojo (Odysseus / Perspectiva y Validación). Valida empáticamente la lógica interna del niño, usando un tono socrático de 'Sí, y...'. Haz que se sienta escuchado y comprendido. No juzgues ni regañes.",
  "blue": "Tu respuesta para el Espejo Azul (Anubis / Límites y Realidad). Explica las reglas del sistema, límites objetivos de la realidad física/técnica, o consecuencias lógicas de su idea de manera directa pero libre de juicios morales. Solo datos y consecuencias objetivas.",
  "green": "Tu respuesta para el Espejo Verde (Midi / Evolución y Síntesis). Propón una tercera opción, una evolución o solución creativa de su idea original que respete su intención interna pero funcione de manera segura y sostenible dentro de los límites descritos en el espejo azul."
}
No agregues comentarios antes o después del JSON. Devuelve únicamente el objeto JSON.
`;

  const { provider, apiUrl, apiKey, modelName } = State.config;
  
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  
  const requestBody = {
    model: modelName,
    messages: [
      { role: "system", content: "Devuelve solo formato JSON." },
      { role: "user", content: systemPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  };

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("API Query failed, falling back to local simulator:", error);
    // Graceful fallback to mock dialogue
    return runMockSemanticProcessing(userInput);
  }
}

// --- Process Ofrenda and Trigger Mirroring ---
async function startMirroring() {
  const textInput = document.getElementById('ofrenda-text').value.trim();
  if (!textInput) {
    alert("Por favor, cuéntale algo a Caronte primero en la caja de texto.");
    return;
  }
  
  goToStep(3);
  
  // Set loaders
  document.getElementById('mirror-red-content').innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  document.getElementById('mirror-blue-content').innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  document.getElementById('mirror-green-content').innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  let result;
  
  if (State.config.provider === 'mock') {
    // Artificial 1.5s delay to simulate thinking (gives the child time to breathe)
    await new Promise(resolve => setTimeout(resolve, 1500));
    result = runMockSemanticProcessing(textInput);
  } else {
    result = await queryAIEngine(textInput);
  }
  
  // Populate content
  const setMirrorContent = (id, text) => {
    const p = document.createElement('p');
    p.textContent = text;
    const container = document.getElementById(id);
    container.innerHTML = '';
    container.appendChild(p);
  };
  setMirrorContent('mirror-red-content', result.red);
  setMirrorContent('mirror-blue-content', result.blue);
  setMirrorContent('mirror-green-content', result.green);
  
  // Play comforting success arpeggio
  AgoraAudio.playSuccess();
  
  // Store the active result in State temp storage for sealing
  State.activeResult = {
    concept: textInput,
    red: result.red,
    blue: result.blue,
    green: result.green,
    timestamp: new Date().toLocaleString('es-MX'),
    level: Math.floor(Math.random() * 3) + 1 // Gamified evolution level
  };
}

// --- Library UI Manipulation ---
function updateLibraryUI() {
  const list = document.getElementById('library-list');
  if (State.library.length === 0) {
    list.innerHTML = `<p style="color: var(--color-text-secondary); font-size: 0.9rem; font-style: italic; text-align: center; margin: 20px 0;">La biblioteca está vacía. Guarda una idea para registrarla en la memoria de Caronte.</p>`;
    return;
  }
  
  list.innerHTML = '';
  // Show in reverse chronological order
  [...State.library].reverse().forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'library-item';
    
    // Convert gamified level to stars
    const stars = "🌟".repeat(item.level || 1);
    
    itemEl.innerHTML = `
      <div class="item-meta">
        <span class="meta-time"></span>
        <span class="meta-stars"></span>
      </div>
      <div class="item-concept"></div>
      <div class="item-synthesis"></div>
      <div class="item-actions">
        <button class="cleanse-btn" onclick="deleteLibraryItem(${State.library.length - 1 - index})">Purgar</button>
      </div>
    `;
    itemEl.querySelector('.meta-time').textContent = item.timestamp;
    itemEl.querySelector('.meta-stars').textContent = "Evolución: " + stars;
    itemEl.querySelector('.item-concept').textContent = 'Concepto Original: "' + item.concept + '"';
    itemEl.querySelector('.item-synthesis').textContent = "Evolución Sellada: " + item.green;
    list.appendChild(itemEl);
  });
}

window.deleteLibraryItem = function(index) {
  State.library.splice(index, 1);
  localStorage.setItem('agora_library', JSON.stringify(State.library));
  updateLibraryUI();
  AgoraAudio.playStep();
};

function sealActiveMemory() {
  if (!State.activeResult) return;
  
  State.library.push(State.activeResult);
  localStorage.setItem('agora_library', JSON.stringify(State.library));
  updateLibraryUI();
  
  State.activeResult = null;
  AgoraAudio.playSuccess();
  
  alert("¡Idea sellada con éxito en la memoria permanente del Monstruo!");
  
  // Reset fields and go back to step 1
  document.getElementById('ofrenda-text').value = '';
  goToStep(1);
}

// --- Event Listeners ---
function initEventListeners() {
  // Stepper triggers
  document.getElementById('btn-ritual-complete').addEventListener('click', () => goToStep(2));
  document.getElementById('btn-back-to-1').addEventListener('click', () => goToStep(1));
  document.getElementById('btn-send-ofrenda').addEventListener('click', startMirroring);
  document.getElementById('btn-reset-process').addEventListener('click', () => {
    document.getElementById('ofrenda-text').value = '';
    goToStep(1);
  });
  document.getElementById('btn-seal-memory').addEventListener('click', sealActiveMemory);
  
  // Settings Panel triggers
  document.getElementById('toggle-settings-btn').addEventListener('click', () => {
    const panel = document.getElementById('settings-panel');
    panel.style.display = panel.style.display === "block" ? "none" : "block";
    AgoraAudio.playStep();
  });
  
  document.getElementById('close-settings-btn').addEventListener('click', () => {
    document.getElementById('settings-panel').style.display = "none";
    AgoraAudio.playStep();
  });
  
  document.getElementById('save-settings-btn').addEventListener('click', saveConfig);
  
  document.getElementById('btn-clear-library').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que quieres purgar toda la memoria de Caronte? Esto borrará tus ideas guardadas.")) {
      State.library = [];
      localStorage.setItem('agora_library', JSON.stringify(State.library));
      updateLibraryUI();
      AgoraAudio.playStep();
    }
  });

  // Dynamic Provider Select Changes
  document.getElementById('provider-select').addEventListener('change', (e) => {
    const urlInput = document.getElementById('api-url');
    const modelInput = document.getElementById('model-name');
    
    if (e.target.value === 'mock') {
      urlInput.value = "http://localhost:11434/v1";
      modelInput.value = "hermes-3";
    } else if (e.target.value === 'ollama') {
      urlInput.value = "http://localhost:11434/v1";
      modelInput.value = "hermes-3";
    } else if (e.target.value === 'sakana') {
      urlInput.value = "https://api.sakana.ai/v1";
      modelInput.value = "fugu";
    }
  });
}

window.AgoraAudio = AgoraAudio;

// --- Initialize Page (only when running inside Ágora UI) ---
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('step-1') && document.getElementById('btn-seal-memory')) {
    loadPersistedData();
    initEventListeners();
    initSpeech();
    goToStep(1);
  }
});

})();
