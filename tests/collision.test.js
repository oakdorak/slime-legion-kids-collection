/**
 * Collision test — verifies that shared/audio/agora.js + shared/slime-rewards.js +
 * mini-zanahoria/app.js can all load in the SAME global scope without a SyntaxError.
 *
 * Previous behavior: "SyntaxError: Identifier 'State' has already been declared"
 * because both agora.js and mini-zanahoria/app.js declared `const State` at global scope.
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const BASE = path.resolve(__dirname, '..');

const files = [
  'shared/audio/agora.js',
  'shared/slime-rewards.js',
  'mini-zanahoria/app.js',
];

// Build a fake browser-like context
const sandbox = {
  window: {},
  console: console,
  document: {
    getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} }, innerText: '', style: {} }),
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, setAttribute: () => {}, textContent: '' }),
    createDocumentFragment: () => ({ appendChild: () => {} }),
    addEventListener: () => {},
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; },
  },
  window: {},
};

// Wire window properties to the sandbox
sandbox.window.speechSynthesis = undefined;
sandbox.window.SpeechRecognition = undefined;
sandbox.window.webkitSpeechRecognition = undefined;
sandbox.window.addEventListener = () => {};
sandbox.window.AudioContext = function() {};
sandbox.window.webkitAudioContext = function() {};

Object.assign(sandbox.window, sandbox);
Object.keys(sandbox).forEach(k => { sandbox[k] = sandbox[k]; });

let errors = [];

try {
  files.forEach(f => {
    const code = fs.readFileSync(path.join(BASE, f), 'utf8');
    // Wrap in try so we can report WHICH file broke
    try {
      vm.runInNewContext(code, sandbox);
      console.log(`✅ Loaded ${f}`);
    } catch (e) {
      errors.push({ file: f, error: e.message });
    }
  });

  if (errors.length === 0) {
    console.log('\n✅ PASS: No collision — all scripts loaded together successfully');
    console.log('   window.AgoraAudio:', typeof sandbox.window.AgoraAudio);
    console.log('   window.SlimeRewards:', typeof sandbox.window.SlimeRewards);
    // GameState should NOT be global (it's in mini-zanahoria/app.js at module level,
    // but since all scripts share the same scope, it IS global — but unique now)
    console.log('   GameState (from mini-zanahoria/app.js):', typeof sandbox.GameState);
  } else {
    console.error('\n❌ FAIL: Collision detected:');
    errors.forEach(e => console.error(`   ${e.file}: ${e.error}`));
    process.exit(1);
  }
} catch (e) {
  console.error('❌ FAIL: Unexpected error:', e);
  process.exit(1);
}
