/**
 * @jest-environment jsdom
 */

// Mock Web Audio API BEFORE loading the module
const mockOscillator = {
  type: '',
  frequency: { setValueAtTime: jest.fn() },
  connect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
};

window.AudioContext = jest.fn().mockImplementation(() => ({
  currentTime: 0,
  state: 'running',
  resume: jest.fn(),
  createOscillator: jest.fn(() => ({
    type: '',
    frequency: { setValueAtTime: jest.fn() },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    gain: {
      setValueAtTime: jest.fn(),
      linearRampToValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
    connect: jest.fn(),
  })),
  createBiquadFilter: jest.fn(() => ({
    type: '',
    frequency: { setValueAtTime: jest.fn() },
    Q: { setValueAtTime: jest.fn() },
    connect: jest.fn(),
  })),
  destination: {},
}));

// Mock localStorage
const store = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, val) => { store[key] = String(val); }),
    removeItem: jest.fn((key) => { delete store[key]; }),
  },
  writable: true,
});

// Build required DOM structure BEFORE require()
document.body.innerHTML = `
  <span id="star-count">0</span>
  <div id="celebration-screen"></div>
  <button id="close-celebration-btn"></button>

  <!-- Focus Orbit -->
  <div id="orbit-mascot-container"></div>
  <div id="orbit-feedback"></div>
  <button id="start-orbit-btn"></button>
  <div class="grid-quadrant" data-quadrant="NW"></div>
  <div class="grid-quadrant" data-quadrant="NE"></div>
  <div class="grid-quadrant" data-quadrant="SW"></div>
  <div class="grid-quadrant" data-quadrant="SE"></div>

  <!-- Emotion Resonance -->
  <div id="emotion-mascot-container"></div>
  <div id="emotion-speech"></div>
  <div id="emotion-feedback"></div>
  <div id="emotion-guess-grid"></div>
  <div id="care-options-group"></div>
  <div id="emotion-action-grid"></div>

  <!-- Routine Builder -->
  <div id="routine-slots-container"></div>
  <div id="routine-cards-container"></div>
  <div id="routine-feedback"></div>
  <button id="check-routine-btn"></button>
  <button id="reset-routine-btn"></button>

  <!-- Navigation -->
  <button class="nav-btn" data-game="orbit"></button>
  <button class="nav-btn" data-game="emotion"></button>
  <button class="nav-btn" data-game="routine"></button>
  <div class="game-panel" id="game-orbit"></div>
  <div class="game-panel" id="game-emotion"></div>
  <div class="game-panel" id="game-routine"></div>
`;

// Now safe to require
const {
  AudioEngine,
  getMascotSVG,
  State,
  EMOTIONS,
  ROUTINE_DATA,
  initFocusOrbit,
  initEmotionResonance,
  initRoutineBuilder,
  triggerRewardCelebration,
  initNavigation,
} = require('../mini-zanahoria/app');

describe('getMascotSVG', () => {
  test('returns an SVG string', () => {
    const svg = getMascotSVG();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('class="carrot-svg"');
  });

  test('generates happy emotion with closed-arc eyes and open mouth', () => {
    const svg = getMascotSVG('happy', 'center');
    expect(svg).toContain('stroke-linecap="round" fill="none"');
    expect(svg).toContain('fill="#e74c3c"');
  });

  test('generates sad emotion with tears', () => {
    const svg = getMascotSVG('sad', 'center');
    expect(svg).toContain('fill="#3498db"');
    expect(svg).toContain('Tears');
  });

  test('generates angry emotion with eyebrows', () => {
    const svg = getMascotSVG('angry', 'center');
    expect(svg).toContain('Eyebrows');
    expect(svg).toContain('#ff6b6b');
  });

  test('generates surprised emotion with O-shaped mouth', () => {
    const svg = getMascotSVG('surprised', 'center');
    expect(svg).toContain('r="7.5"');
    expect(svg).toContain('r="5"');
  });

  test('generates tired emotion with flat lines', () => {
    const svg = getMascotSVG('tired', 'center');
    expect(svg).toContain('<line');
  });

  test('default/normal shows gaze-responsive pupils', () => {
    const svg = getMascotSVG('normal', 'center');
    expect(svg).toContain('r="8.5"');
    expect(svg).toContain('r="4"');
  });

  test('gaze NW shifts pupils left/up and rotates head', () => {
    const svg = getMascotSVG('normal', 'NW');
    expect(svg).toContain('rotate(-8deg)');
    expect(svg).toContain(`cx="${28 + (-6)}"`);
    expect(svg).toContain(`cy="${40 + (-5)}"`);
  });

  test('gaze NE shifts pupils right/up and rotates head', () => {
    const svg = getMascotSVG('normal', 'NE');
    expect(svg).toContain('rotate(8deg)');
    expect(svg).toContain(`cx="${28 + 6}"`);
  });

  test('gaze SW shifts pupils left/down', () => {
    const svg = getMascotSVG('normal', 'SW');
    expect(svg).toContain('rotate(-4deg)');
    expect(svg).toContain(`cy="${40 + 5}"`);
  });

  test('gaze SE shifts pupils right/down', () => {
    const svg = getMascotSVG('normal', 'SE');
    expect(svg).toContain('rotate(4deg)');
  });

  test('gaze center leaves pupils at baseline', () => {
    const svg = getMascotSVG('normal', 'center');
    expect(svg).toContain('rotate(0deg)');
    expect(svg).toContain('cx="28"');
    expect(svg).toContain('cy="40"');
  });

  test('always includes carrot body elements', () => {
    const emotions = ['happy', 'sad', 'angry', 'surprised', 'tired', 'normal'];
    emotions.forEach((emotion) => {
      const svg = getMascotSVG(emotion, 'center');
      expect(svg).toContain('fill="#e67e22"');
      expect(svg).toContain('fill="#a8b28a"');
      expect(svg).toContain('Texture details');
    });
  });
});

describe('EMOTIONS data structure', () => {
  test('contains exactly 5 emotions', () => {
    const keys = Object.keys(EMOTIONS);
    expect(keys).toHaveLength(5);
    expect(keys).toEqual(
      expect.arrayContaining(['happy', 'sad', 'angry', 'surprised', 'tired'])
    );
  });

  test('each emotion has required properties', () => {
    Object.entries(EMOTIONS).forEach(([key, emotion]) => {
      expect(emotion).toHaveProperty('label');
      expect(emotion).toHaveProperty('speech');
      expect(emotion).toHaveProperty('correctAction');
      expect(emotion).toHaveProperty('actions');
      expect(typeof emotion.label).toBe('string');
      expect(typeof emotion.speech).toBe('string');
      expect(typeof emotion.correctAction).toBe('string');
      expect(Array.isArray(emotion.actions)).toBe(true);
    });
  });

  test('each emotion has exactly 3 action options', () => {
    Object.values(EMOTIONS).forEach((emotion) => {
      expect(emotion.actions).toHaveLength(3);
    });
  });

  test('each action has id and label', () => {
    Object.values(EMOTIONS).forEach((emotion) => {
      emotion.actions.forEach((action) => {
        expect(action).toHaveProperty('id');
        expect(action).toHaveProperty('label');
        expect(typeof action.id).toBe('string');
        expect(typeof action.label).toBe('string');
      });
    });
  });

  test('correctAction matches one of the action ids', () => {
    Object.values(EMOTIONS).forEach((emotion) => {
      const actionIds = emotion.actions.map((a) => a.id);
      expect(actionIds).toContain(emotion.correctAction);
    });
  });

  test('happy correct action is celebrate', () => {
    expect(EMOTIONS.happy.correctAction).toBe('celebrate');
  });

  test('sad correct action is hug', () => {
    expect(EMOTIONS.sad.correctAction).toBe('hug');
  });

  test('angry correct action is relax', () => {
    expect(EMOTIONS.angry.correctAction).toBe('relax');
  });

  test('surprised correct action is earmuffs', () => {
    expect(EMOTIONS.surprised.correctAction).toBe('earmuffs');
  });

  test('tired correct action is nap', () => {
    expect(EMOTIONS.tired.correctAction).toBe('nap');
  });
});

describe('ROUTINE_DATA', () => {
  test('contains morning and evening routines', () => {
    expect(ROUTINE_DATA).toHaveProperty('morning');
    expect(ROUTINE_DATA).toHaveProperty('evening');
  });

  test('each routine has a title and cards array', () => {
    Object.values(ROUTINE_DATA).forEach((routine) => {
      expect(routine).toHaveProperty('title');
      expect(routine).toHaveProperty('cards');
      expect(typeof routine.title).toBe('string');
      expect(Array.isArray(routine.cards)).toBe(true);
    });
  });

  test('each routine has exactly 4 cards', () => {
    Object.values(ROUTINE_DATA).forEach((routine) => {
      expect(routine.cards).toHaveLength(4);
    });
  });

  test('cards have sequential order from 0 to 3', () => {
    Object.values(ROUTINE_DATA).forEach((routine) => {
      const orders = routine.cards.map((c) => c.order).sort();
      expect(orders).toEqual([0, 1, 2, 3]);
    });
  });

  test('each card has id, label, and order', () => {
    Object.values(ROUTINE_DATA).forEach((routine) => {
      routine.cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('label');
        expect(card).toHaveProperty('order');
      });
    });
  });

  test('morning routine starts with wake and ends with pack', () => {
    const morning = ROUTINE_DATA.morning.cards;
    const first = morning.find((c) => c.order === 0);
    const last = morning.find((c) => c.order === 3);
    expect(first.id).toBe('wake');
    expect(last.id).toBe('pack');
  });

  test('evening routine starts with dinner and ends with sleep', () => {
    const evening = ROUTINE_DATA.evening.cards;
    const first = evening.find((c) => c.order === 0);
    const last = evening.find((c) => c.order === 3);
    expect(first.id).toBe('dinner');
    expect(last.id).toBe('sleep');
  });
});

describe('AudioEngine', () => {
  test('starts with null ctx', () => {
    expect(AudioEngine.ctx).toBeNull();
  });

  test('init() creates an AudioContext', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    AudioEngine.init();
    expect(AudioEngine.ctx).not.toBeNull();
  });

  test('init() creates a lowpass filter', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    AudioEngine.init();
    expect(AudioEngine.filter).not.toBeNull();
  });

  test('init() does not recreate context on subsequent calls', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    AudioEngine.init();
    const ctx = AudioEngine.ctx;
    AudioEngine.init();
    expect(AudioEngine.ctx).toBe(ctx);
  });

  test('init() resumes suspended context', () => {
    const resumeMock = jest.fn();
    AudioEngine.ctx = { state: 'suspended', resume: resumeMock, currentTime: 0 };
    AudioEngine.filter = {};
    AudioEngine.init();
    expect(resumeMock).toHaveBeenCalled();
  });

  test('playSuccess() runs without error', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    expect(() => AudioEngine.playSuccess()).not.toThrow();
  });

  test('playError() runs without error', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    expect(() => AudioEngine.playError()).not.toThrow();
  });

  test('playClick() runs without error', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    expect(() => AudioEngine.playClick()).not.toThrow();
  });

  test('playActionUnlock() runs without error', () => {
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
    expect(() => AudioEngine.playActionUnlock()).not.toThrow();
  });
});

describe('State', () => {
  beforeEach(() => {
    State.stars = 0;
    document.getElementById('star-count').innerText = '0';
  });

  test('starts at 0 stars', () => {
    expect(State.stars).toBe(0);
  });

  test('addStar increments star count', () => {
    State.addStar();
    expect(State.stars).toBe(1);
  });

  test('addStar updates DOM', () => {
    State.addStar();
    expect(String(document.getElementById('star-count').innerText)).toBe('1');
  });

  test('addStar persists to localStorage', () => {
    State.addStar();
    expect(window.localStorage.setItem).toHaveBeenCalledWith('minizanahoria_stars', 1);
  });

  test('multiple addStar calls accumulate', () => {
    State.addStar();
    State.addStar();
    State.addStar();
    expect(State.stars).toBe(3);
  });

  test('activeGame defaults to orbit', () => {
    expect(State.activeGame).toBe('orbit');
  });
});

describe('initFocusOrbit', () => {
  test('sets mascot container content', () => {
    initFocusOrbit();
    const container = document.getElementById('orbit-mascot-container');
    expect(container.innerHTML).toContain('<svg');
    expect(container.innerHTML).toContain('carrot-svg');
  });

  test('sets feedback text', () => {
    initFocusOrbit();
    const feedback = document.getElementById('orbit-feedback');
    expect(feedback.innerText).toContain('Presiona iniciar');
  });

  test('applies idle animation class to mascot container', () => {
    initFocusOrbit();
    const container = document.getElementById('orbit-mascot-container');
    expect(container.className).toContain('anim-idle');
  });

  test('clears quadrant classes', () => {
    const quadrants = document.querySelectorAll('.grid-quadrant');
    quadrants.forEach((q) => q.classList.add('success-flash'));
    initFocusOrbit();
    quadrants.forEach((q) => {
      expect(q.className).toBe('grid-quadrant');
    });
  });
});

describe('initEmotionResonance', () => {
  test('sets mascot SVG for a random emotion', () => {
    initEmotionResonance();
    const container = document.getElementById('emotion-mascot-container');
    expect(container.innerHTML).toContain('<svg');
  });

  test('sets speech bubble text', () => {
    initEmotionResonance();
    const speech = document.getElementById('emotion-speech');
    const allSpeeches = Object.values(EMOTIONS).map((e) => e.speech);
    expect(allSpeeches).toContain(speech.innerText);
  });

  test('renders guess buttons for all emotions', () => {
    initEmotionResonance();
    const grid = document.getElementById('emotion-guess-grid');
    const buttons = grid.querySelectorAll('button');
    expect(buttons.length).toBe(Object.keys(EMOTIONS).length);
  });

  test('disables care options initially', () => {
    initEmotionResonance();
    const care = document.getElementById('care-options-group');
    expect(care.classList.contains('disabled')).toBe(true);
  });

  test('sets feedback text prompting emotion guess', () => {
    initEmotionResonance();
    const feedback = document.getElementById('emotion-feedback');
    expect(feedback.innerText).toContain('Selecciona la emoción correcta');
  });
});

describe('initRoutineBuilder', () => {
  test('creates 4 drop slots', () => {
    initRoutineBuilder();
    const slots = document.querySelectorAll('.routine-slot');
    expect(slots.length).toBe(4);
  });

  test('creates draggable cards', () => {
    initRoutineBuilder();
    const cards = document.querySelectorAll('.routine-card');
    expect(cards.length).toBe(4);
    cards.forEach((card) => {
      expect(card.getAttribute('draggable')).toBe('true');
    });
  });

  test('each card has data-id and data-order attributes', () => {
    initRoutineBuilder();
    const cards = document.querySelectorAll('.routine-card');
    cards.forEach((card) => {
      expect(card.getAttribute('data-id')).toBeTruthy();
      expect(card.getAttribute('data-order')).not.toBeNull();
    });
  });

  test('sets feedback text about dragging', () => {
    initRoutineBuilder();
    const feedback = document.getElementById('routine-feedback');
    expect(feedback.innerText).toContain('Arrastra');
  });
});

describe('triggerRewardCelebration', () => {
  beforeEach(() => {
    State.stars = 0;
    document.getElementById('star-count').innerText = '0';
    document.getElementById('celebration-screen').className = '';
    AudioEngine.ctx = null;
    AudioEngine.filter = null;
  });

  test('adds active class to celebration screen', () => {
    triggerRewardCelebration();
    const screen = document.getElementById('celebration-screen');
    expect(screen.classList.contains('active')).toBe(true);
  });

  test('increments stars', () => {
    triggerRewardCelebration();
    expect(State.stars).toBe(1);
  });
});

describe('initNavigation', () => {
  test('sets star count in DOM', () => {
    State.stars = 42;
    initNavigation();
    expect(String(document.getElementById('star-count').innerText)).toBe('42');
  });
});
