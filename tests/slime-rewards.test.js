const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock localStorage
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = val.toString(); },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

// Load SlimeRewards
const rewardsCode = fs.readFileSync(path.join(__dirname, '../shared/slime-rewards.js'), 'utf8');
const contextFunc = new Function('window', 'localStorage', `${rewardsCode}; return SlimeRewards;`);
const SlimeRewards = contextFunc(global, global.localStorage);

function runTests() {
  console.log("Running tests for SlimeRewards engine...");
  global.localStorage.clear();

  // Test 1: Initial state (0 points -> phase 1)
  assert.strictEqual(SlimeRewards.getPoints(), 0);
  let phase = SlimeRewards.getPhaseInfo(0);
  assert.strictEqual(phase.key, 'phase1');
  assert.strictEqual(phase.number, 1);
  assert.strictEqual(phase.nextPoints, 10);
  console.log("✅ Test 1 Passed: Initial state (Phase 1, 0 pts)");

  // Test 2: Progress to Phase 2 (10 pts)
  phase = SlimeRewards.getPhaseInfo(10);
  assert.strictEqual(phase.key, 'phase2');
  assert.strictEqual(phase.number, 2);
  assert.strictEqual(phase.nextPoints, 25);
  console.log("✅ Test 2 Passed: Transition to Phase 2 (10 pts)");

  // Test 3: Progress to Phase 3 (25 pts)
  phase = SlimeRewards.getPhaseInfo(25);
  assert.strictEqual(phase.key, 'phase3');
  assert.strictEqual(phase.number, 3);
  assert.strictEqual(phase.nextPoints, 50);
  console.log("✅ Test 3 Passed: Transition to Phase 3 (25 pts)");

  // Test 4: Progress to Phase 4A (Light Path, 50 pts default)
  phase = SlimeRewards.getPhaseInfo(50);
  assert.strictEqual(phase.key, 'phase4a');
  assert.strictEqual(phase.number, 4);
  assert.strictEqual(phase.nextPoints, null);
  console.log("✅ Test 4 Passed: Transition to Phase 4A (Light Path, 50 pts)");

  // Test 5: Switch to Dark Path (Phase 4B)
  SlimeRewards.setBranch('b');
  phase = SlimeRewards.getPhaseInfo(55);
  assert.strictEqual(phase.key, 'phase4b');
  console.log("✅ Test 5 Passed: Branch 4B selection verified");

  // Test 6: Adding points accumulates in storage
  global.localStorage.clear();
  SlimeRewards.awardPoints(5);
  assert.strictEqual(SlimeRewards.getPoints(), 5);
  SlimeRewards.awardPoints(10);
  assert.strictEqual(SlimeRewards.getPoints(), 15);
  assert.strictEqual(SlimeRewards.getPhaseInfo().key, 'phase2');
  console.log("✅ Test 6 Passed: Award points accumulation & phase trigger");

  console.log("All SlimeRewards tests passed successfully!");
}

try {
  runTests();
} catch (e) {
  console.error(e);
  process.exit(1);
}
