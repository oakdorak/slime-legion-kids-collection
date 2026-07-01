/**
 * @jest-environment jsdom
 */

let appModule;

beforeAll(() => {
  // Mock Web Audio API
  window.AudioContext = jest.fn().mockImplementation(() => ({
    currentTime: 0,
    state: 'running',
    resume: jest.fn(),
    destination: {},
    createOscillator: jest.fn(() => ({
      type: '',
      frequency: { setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
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
      frequency: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
      connect: jest.fn(),
    })),
  }));

  // Build required DOM structure
  document.body.innerHTML = `
    <svg id="plane-svg"></svg>
    <div id="prompt-text"></div>
    <div id="plane-wrapper"></div>
    <span id="loop-counter">0</span>
    <div id="plane-bubble"></div>
    <div id="sky-area"></div>
  `;

  appModule = require('../el-avion-azul/app');
});

describe('goofyPhrases', () => {
  test('is a non-empty array of strings', () => {
    expect(Array.isArray(appModule.goofyPhrases)).toBe(true);
    expect(appModule.goofyPhrases.length).toBeGreaterThan(0);
    appModule.goofyPhrases.forEach((phrase) => {
      expect(typeof phrase).toBe('string');
    });
  });

  test('contains expected phrases', () => {
    expect(appModule.goofyPhrases).toContain('¡Bzzzz! 🤪');
    expect(appModule.goofyPhrases).toContain('¡A volar! 🚀');
  });
});

describe('CuteSoundEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new appModule.CuteSoundEngine();
  });

  test('creates with null ctx', () => {
    expect(engine.ctx).toBeNull();
  });

  test('init() creates an AudioContext', () => {
    engine.init();
    expect(engine.ctx).not.toBeNull();
    expect(window.AudioContext).toHaveBeenCalled();
  });

  test('init() does not create a second AudioContext', () => {
    engine.init();
    const ctx = engine.ctx;
    engine.init();
    expect(engine.ctx).toBe(ctx);
  });

  test('init() resumes suspended context', () => {
    engine.ctx = { state: 'suspended', resume: jest.fn() };
    engine.init();
    expect(engine.ctx.resume).toHaveBeenCalled();
  });

  test('playChime() runs without error', () => {
    expect(() => engine.playChime()).not.toThrow();
  });

  test('playLoopSweep() runs without error', () => {
    expect(() => engine.playLoopSweep()).not.toThrow();
  });

  test('playPuff() runs without error', () => {
    expect(() => engine.playPuff()).not.toThrow();
  });
});

describe('getSoundEngine', () => {
  test('returns a CuteSoundEngine instance', () => {
    const engine = appModule.getSoundEngine();
    expect(engine).toBeInstanceOf(appModule.CuteSoundEngine);
  });

  test('returns the same singleton on subsequent calls', () => {
    const e1 = appModule.getSoundEngine();
    const e2 = appModule.getSoundEngine();
    expect(e1).toBe(e2);
  });
});

describe('showSpeechBubble', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const bubble = document.getElementById('plane-bubble');
    bubble.classList.remove('show');
    bubble.innerText = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('sets text and shows bubble', () => {
    appModule.showSpeechBubble('Hola!');
    const bubble = document.getElementById('plane-bubble');
    expect(bubble.innerText).toBe('Hola!');
    expect(bubble.classList.contains('show')).toBe(true);
  });

  test('hides bubble after 1500ms', () => {
    appModule.showSpeechBubble('Hola!');
    const bubble = document.getElementById('plane-bubble');
    jest.advanceTimersByTime(1500);
    expect(bubble.classList.contains('show')).toBe(false);
  });

  test('resets timeout if called again before hiding', () => {
    appModule.showSpeechBubble('First');
    jest.advanceTimersByTime(1000);
    appModule.showSpeechBubble('Second');
    const bubble = document.getElementById('plane-bubble');
    expect(bubble.innerText).toBe('Second');
    jest.advanceTimersByTime(1000);
    expect(bubble.classList.contains('show')).toBe(true);
    jest.advanceTimersByTime(500);
    expect(bubble.classList.contains('show')).toBe(false);
  });
});

describe('triggerWiggle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const wrapper = document.getElementById('plane-wrapper');
    wrapper.className = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('adds wiggle class', () => {
    appModule.triggerWiggle();
    const wrapper = document.getElementById('plane-wrapper');
    expect(wrapper.classList.contains('wiggle')).toBe(true);
  });

  test('removes wiggle class after 400ms', () => {
    appModule.triggerWiggle();
    jest.advanceTimersByTime(400);
    const wrapper = document.getElementById('plane-wrapper');
    expect(wrapper.classList.contains('wiggle')).toBe(false);
  });

  test('does not wiggle if already wiggling', () => {
    const wrapper = document.getElementById('plane-wrapper');
    wrapper.classList.add('wiggle');
    appModule.triggerWiggle();
    expect(wrapper.classList.contains('wiggle')).toBe(true);
  });

  test('does not wiggle if loop-de-loop is active', () => {
    const wrapper = document.getElementById('plane-wrapper');
    wrapper.classList.add('loop-de-loop');
    appModule.triggerWiggle();
    expect(wrapper.classList.contains('wiggle')).toBe(false);
  });
});

describe('selectColor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.getElementById('plane-svg').className = '';
    document.getElementById('prompt-text').innerHTML = '';
    document.getElementById('plane-wrapper').className = '';
    document.getElementById('plane-bubble').className = '';
    document.getElementById('plane-bubble').innerText = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('sets CSS class for non-blue color', () => {
    appModule.selectColor('red');
    const svg = document.getElementById('plane-svg');
    expect(svg.classList.contains('color-red')).toBe(true);
  });

  test('displays prompt for non-blue colors encouraging blue', () => {
    appModule.selectColor('yellow');
    const prompt = document.getElementById('prompt-text');
    expect(prompt.innerHTML).toContain('AMARILLO');
    expect(prompt.innerHTML).toContain('AZUL');
  });

  test('sets blue class and shows celebration text for blue', () => {
    appModule.selectColor('blue');
    const svg = document.getElementById('plane-svg');
    expect(svg.classList.contains('color-blue')).toBe(true);
    const prompt = document.getElementById('prompt-text');
    expect(prompt.innerHTML).toContain('AZUL');
  });

  test('removes previous color class when switching', () => {
    appModule.selectColor('red');
    appModule.selectColor('green');
    const svg = document.getElementById('plane-svg');
    expect(svg.classList.contains('color-green')).toBe(true);
    expect(svg.classList.contains('color-red')).toBe(false);
  });
});

describe('triggerLoopStunt', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const wrapper = document.getElementById('plane-wrapper');
    wrapper.className = '';
    document.getElementById('loop-counter').innerText = '0';
    document.getElementById('plane-bubble').className = '';
    document.getElementById('plane-bubble').innerText = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('adds loop-de-loop class', () => {
    appModule.triggerLoopStunt();
    const wrapper = document.getElementById('plane-wrapper');
    expect(wrapper.classList.contains('loop-de-loop')).toBe(true);
  });

  test('increments loop counter', () => {
    appModule.triggerLoopStunt();
    const counter = document.getElementById('loop-counter');
    expect(parseInt(counter.innerText)).toBeGreaterThan(0);
  });

  test('shows speech bubble with loop message', () => {
    appModule.triggerLoopStunt();
    const bubble = document.getElementById('plane-bubble');
    expect(bubble.innerText).toContain('VUELTA');
  });

  test('removes loop-de-loop class after 1400ms', () => {
    appModule.triggerLoopStunt();
    jest.advanceTimersByTime(1400);
    const wrapper = document.getElementById('plane-wrapper');
    expect(wrapper.classList.contains('loop-de-loop')).toBe(false);
  });

  test('prevents double trigger during animation', () => {
    appModule.triggerLoopStunt();
    const counterBefore = document.getElementById('loop-counter').innerText;
    appModule.triggerLoopStunt();
    const counterAfter = document.getElementById('loop-counter').innerText;
    expect(counterAfter).toBe(counterBefore);
  });
});
