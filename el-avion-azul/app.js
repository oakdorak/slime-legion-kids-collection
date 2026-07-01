// Goofy messages for Dieguito
const goofyPhrases = [
    "¡Bzzzz! 🤪",
    "¡Yuuujuuu! ✈️",
    "¡Hola Dieguito! 🥕",
    "¡A volar! 🚀",
    "¡Super azul! ⚡",
    "¡Piiiiiiii! 📣",
    "¡Cuidado con la zanahoria! 🥕",
    "¡Hazme dar vueltas! 🌀"
];

// Current State
let currentPlaneColor = 'red';
let loopCount = 0;
let soundEngine = null;

// Initialize Web Audio Engine (Sovereign & Safe)
class CuteSoundEngine {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('AudioContext not available:', e.message);
                return false;
            }
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn('AudioContext resume failed:', e.message));
        }
        return true;
    }

    // Play a friendly soft chime
    playChime() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.connect(this.ctx.destination);

        const playTone = (freq, time, dur) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle'; // Soft triangle wave
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

            osc.connect(gain);
            gain.connect(filter);
            osc.start(time);
            osc.stop(time + dur);
        };

        // Two-tone chime
        playTone(329.63, now, 0.4); // E4
        playTone(493.88, now + 0.12, 0.5); // B4
    }

    // Play a goofy slide whistle / engine loop sweep
    playLoopSweep() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.connect(this.ctx.destination);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // Super clean sine wave
        
        // Start low, ramp way up and sweep back down
        osc.frequency.setValueAtTime(220, now); // A3
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5); // A5 (up)
        osc.frequency.exponentialRampToValueAtTime(110, now + 1.2); // A2 (down)
        osc.frequency.exponentialRampToValueAtTime(330, now + 1.4); // E4 (resolve)

        // Filter sweep
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.linearRampToValueAtTime(1200, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);

        // Gain ADSR Envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
        gain.gain.setValueAtTime(0.12, now + 0.9);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 1.4);
    }

    // Play a short engine puff
    playPuff() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.connect(this.ctx.destination);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 0.25);
    }
}

// Get Sound Engine
function getSoundEngine() {
    if (!soundEngine) {
        soundEngine = new CuteSoundEngine();
    }
    return soundEngine;
}

// Select Plane Color
function selectColor(color) {
    const planeSvg = document.getElementById('plane-svg');
    const promptText = document.getElementById('prompt-text');
    const planeWrapper = document.getElementById('plane-wrapper');
    if (!planeSvg || !promptText || !planeWrapper) return;
    const engine = getSoundEngine();

    // Reset color classes
    planeSvg.classList.remove(`color-${currentPlaneColor}`);
    currentPlaneColor = color;
    planeSvg.classList.add(`color-${color}`);

    // Update Header Text and handle color action
    if (color === 'blue') {
        promptText.innerHTML = '¡EL AVIÓN ES <span class="highlight-blue">AZUL</span>! 🛸✨';
        
        // Loop de Loop Stunt!
        triggerLoopStunt();
    } else {
        const colorNames = {
            red: 'ROJO 🔴',
            yellow: 'AMARILLO 🟡',
            green: 'VERDE 🟢'
        };
        promptText.innerHTML = `¡Pintaste el avión de ${colorNames[color]}! ¡Ahora hazlo <span class="highlight-blue">AZUL</span>!`;
        
        // Play standard chime and quick wiggle
        engine.playChime();
        triggerWiggle();
        showSpeechBubble("¡Mola! 🎨");
    }
}

// Perform loop-de-loop
function triggerLoopStunt() {
    const planeWrapper = document.getElementById('plane-wrapper');
    const loopCounter = document.getElementById('loop-counter');
    if (!planeWrapper || !loopCounter) return;
    const engine = getSoundEngine();

    // Prevent double triggers during animation
    if (planeWrapper.classList.contains('loop-de-loop')) return;

    planeWrapper.classList.add('loop-de-loop');
    
    // Play funny sweep sound
    engine.playLoopSweep();

    // Increment Counter
    loopCount++;
    loopCounter.innerText = loopCount;

    // Show funny speech bubble
    showSpeechBubble("¡VUELTA LOOOCAAAA! 🌀");

    // Remove class after animation finishes (1.4s)
    setTimeout(() => {
        planeWrapper.classList.remove('loop-de-loop');
    }, 1400);
}

// Perform simple wiggle
function triggerWiggle() {
    const planeWrapper = document.getElementById('plane-wrapper');
    if (planeWrapper.classList.contains('wiggle') || planeWrapper.classList.contains('loop-de-loop')) return;
    
    planeWrapper.classList.add('wiggle');
    setTimeout(() => {
        planeWrapper.classList.remove('wiggle');
    }, 400);
}

// Show Speech Bubble
function showSpeechBubble(text) {
    const bubble = document.getElementById('plane-bubble');
    if (!bubble) return;
    bubble.innerText = text;
    bubble.classList.add('show');
    
    // Hide bubble after 1.5s
    if (window.bubbleTimeout) clearTimeout(window.bubbleTimeout);
    window.bubbleTimeout = setTimeout(() => {
        bubble.classList.remove('show');
    }, 1500);
}

// Click on plane wrapper
document.getElementById('plane-wrapper').addEventListener('click', (e) => {
    // Only trigger if not doing loop
    const planeWrapper = document.getElementById('plane-wrapper');
    if (planeWrapper.classList.contains('loop-de-loop')) return;

    const engine = getSoundEngine();
    engine.playPuff();
    triggerWiggle();

    // Pick a random funny phrase
    const randomPhrase = goofyPhrases[Math.floor(Math.random() * goofyPhrases.length)];
    showSpeechBubble(randomPhrase);
});

// Setup touch/mouse movement limits (Interactive hovering offset)
document.getElementById('sky-area').addEventListener('mousemove', (e) => {
    const planeWrapper = document.getElementById('plane-wrapper');
    // If loop animation is running, do not manually position
    if (planeWrapper.classList.contains('loop-de-loop')) return;

    // Gentle look-at mouse effect or soft repositioning can be added here
});
