/**
 * NeuroDivertidos - Shared Utilities
 * Common patterns extracted from individual games to reduce duplication.
 */

// ==========================================================================
// SPEECH SYNTHESIS ENGINE
// ==========================================================================

/**
 * Manages Web Speech API voice loading and speaking.
 * Usage:
 *   const speech = new SpeechEngine({ lang: 'es-MX', pitch: 1.3, rate: 0.85 });
 *   speech.speak('Hola');
 */
class SpeechEngine {
  constructor({ lang = 'es-MX', pitch = 1.2, rate = 0.85 } = {}) {
    this.lang = lang;
    this.pitch = pitch;
    this.rate = rate;
    this.voices = [];
    this._loadVoices();
    window.speechSynthesis.onvoiceschanged = () => this._loadVoices();
  }

  _loadVoices() {
    this.voices = window.speechSynthesis.getVoices();
  }

  speak(text, { pitch, rate, lang } = {}) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || this.lang;
    u.pitch = pitch !== undefined ? pitch : this.pitch;
    u.rate = rate !== undefined ? rate : this.rate;
    const langPrefix = u.lang.split('-')[0];
    const v = this.voices.find(v => v.lang.startsWith(langPrefix));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  cancel() {
    window.speechSynthesis.cancel();
  }
}

// ==========================================================================
// CANVAS RESIZE HELPER
// ==========================================================================

/**
 * Auto-resizes a canvas to fill the window and returns a size object.
 * Attaches a resize listener automatically.
 * Usage:
 *   const size = initCanvasResize(canvas);
 *   // size.W and size.H always reflect current dimensions
 */
function initCanvasResize(canvas) {
  const size = { W: 0, H: 0 };
  function resize() {
    size.W = canvas.width = window.innerWidth;
    size.H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  return size;
}

// ==========================================================================
// PARTICLE SYSTEM
// ==========================================================================

/**
 * A general-purpose particle for burst/trail effects on a 2D canvas.
 * Usage:
 *   const p = new Particle({ x, y, color: '#896ab0' });
 *   // in loop: p.update(); p.draw(ctx); if (p.dead) remove it.
 */
class Particle {
  constructor({
    x, y, color = '#896ab0',
    vx = null, vy = null,
    size = null, decay = null,
    gravity = 0.15
  } = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx !== null ? vx : (Math.random() - 0.5) * 8;
    this.vy = vy !== null ? vy : (Math.random() - 0.5) * 8 - 2;
    this.size = size !== null ? size : Math.random() * 5 + 2;
    this.life = 1;
    this.decay = decay !== null ? decay : Math.random() * 0.02 + 0.02;
    this.gravity = gravity;
  }

  get dead() {
    return this.life <= 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Spawns a burst of particles at (x, y).
 * Returns an array of new Particle instances to add to your particles list.
 * Usage:
 *   particles.push(...burst(x, y, { color: '#896ab0', count: 25 }));
 */
function burst(x, y, { color = '#896ab0', count = 20, gravity = 0.15 } = {}) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(new Particle({ x, y, color, gravity }));
  }
  return result;
}

/**
 * Runs one frame of the particle animation loop.
 * Mutates the array in place, removing dead particles.
 * Usage:
 *   particles = tickParticles(particles, ctx);
 */
function tickParticles(particles, ctx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);
    if (particles[i].dead) {
      particles.splice(i, 1);
    }
  }
  return particles;
}

// ==========================================================================
// SPLASH SCREEN
// ==========================================================================

/**
 * Dismisses a splash/overlay element with a fade transition.
 * Usage:
 *   dismissSplash(document.getElementById('splash'));
 */
function dismissSplash(element) {
  if (!element) return;
  element.style.opacity = '0';
  element.style.visibility = 'hidden';
}

/**
 * Shows game UI elements by setting their opacity to '1'.
 * Usage:
 *   showElements('#hud', '#progress-bar-wrap');
 */
function showElements(...selectors) {
  selectors.forEach(sel => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (el) el.style.opacity = '1';
  });
}

// ==========================================================================
// CONFETTI SYSTEM
// ==========================================================================

/**
 * A confetti particle for celebration effects.
 * Usage:
 *   const c = new ConfettiPiece({ canvasWidth: 800 });
 *   // in loop: c.update(); c.draw(ctx); if (c.dead) remove it.
 */
class ConfettiPiece {
  constructor({ canvasWidth = 800, colors = ['#896ab0', '#a8b28a', '#9b8e6c', '#e3e0a4', '#c896e0'] } = {}) {
    this.x = Math.random() * canvasWidth;
    this.y = -10;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = Math.random() * 4 + 2;
    this.r = Math.random() * 6 + 3;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rot = Math.random() * 360;
    this.rotV = (Math.random() - 0.5) * 10;
    this.life = 1;
  }

  get dead() {
    return this.life <= 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rot += this.rotV;
    this.life -= 0.008;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot * Math.PI / 180);
    ctx.fillRect(-this.r, -this.r / 2, this.r * 2, this.r);
    ctx.restore();
  }
}

/**
 * Launches a batch of confetti pieces.
 * Returns an array of ConfettiPiece instances.
 */
function launchConfetti({ count = 120, canvasWidth = window.innerWidth, colors } = {}) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(new ConfettiPiece({ canvasWidth, colors }));
  }
  return result;
}

// ==========================================================================
// AUDIO ENGINE (Web Audio API)
// ==========================================================================

/**
 * Safe Web Audio engine with low-pass filter for sensory protection.
 * Usage:
 *   const audio = new GameAudioEngine();
 *   audio.playTone(440, 0.5); // 440Hz for 0.5s
 */
class GameAudioEngine {
  constructor({ filterFreq = 1000 } = {}) {
    this._ctx = null;
    this._filter = null;
    this._filterFreq = filterFreq;
  }

  get ctx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._filter = this._ctx.createBiquadFilter();
      this._filter.type = 'lowpass';
      this._filter.frequency.setValueAtTime(this._filterFreq, this._ctx.currentTime);
      this._filter.Q.setValueAtTime(1, this._ctx.currentTime);
      this._filter.connect(this._ctx.destination);
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume();
    }
    return this._ctx;
  }

  get filter() {
    // Access ctx to ensure initialization
    this.ctx;
    return this._filter;
  }

  /**
   * Play a single tone through the low-pass filter.
   * @param {number} freq - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {object} opts - { type, gain, delay }
   */
  playTone(freq, duration, { type = 'triangle', gain = 0.06, delay = 0 } = {}) {
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gainNode);
    gainNode.connect(this.filter);
    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Play a chord (array of frequencies) arpeggiated.
   * @param {number[]} frequencies
   * @param {object} opts - { strumDelay, duration, type, gain }
   */
  playChord(frequencies, { strumDelay = 0.06, duration = 1.8, type = 'triangle', gain = 0.04 } = {}) {
    frequencies.forEach((freq, i) => {
      this.playTone(freq, duration, { type, gain, delay: i * strumDelay });
    });
  }
}

// ==========================================================================
// EXPORTS (for ES module usage or global attachment)
// ==========================================================================

if (typeof window !== 'undefined') {
  window.NeuroDivertidos = {
    SpeechEngine,
    initCanvasResize,
    Particle,
    burst,
    tickParticles,
    dismissSplash,
    showElements,
    ConfettiPiece,
    launchConfetti,
    GameAudioEngine
  };
}
