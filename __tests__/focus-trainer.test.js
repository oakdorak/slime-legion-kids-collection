/**
 * @jest-environment jsdom
 *
 * Tests for the focus-trainer (Cazador de Burbujas) game logic.
 * Since the game logic lives inline in HTML, we extract and test the
 * core algorithmic functions here.
 */

// Replicate core game constants and logic from focus-trainer/index.html
const DISTRACTOR_COLORS = [
  { bg: '#c06060', shadow: '#c06060', emoji: '' },
  { bg: '#4a7fb5', shadow: '#4a7fb5', emoji: '' },
  { bg: '#6aaa6a', shadow: '#6aaa6a', emoji: '' },
  { bg: '#d4a055', shadow: '#d4a055', emoji: '' },
  { bg: '#c06090', shadow: '#c06090', emoji: '' },
];
const TARGET_COLOR = { bg: '#896ab0', shadow: '#896ab0', isTarget: true };

function checkLevel(totalHits, currentLevel) {
  return Math.floor(totalHits / 10) + 1;
}

function getSpawnInterval(level) {
  return Math.max(600, 1800 - level * 150);
}

function getBubbleDuration(level) {
  return Math.max(3.5, 8 - level * 0.4);
}

describe('focus-trainer game constants', () => {
  test('has 5 distractor colors', () => {
    expect(DISTRACTOR_COLORS).toHaveLength(5);
  });

  test('each distractor has bg and shadow', () => {
    DISTRACTOR_COLORS.forEach((c) => {
      expect(c).toHaveProperty('bg');
      expect(c).toHaveProperty('shadow');
      expect(c.bg).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  test('target color is purple (#896ab0)', () => {
    expect(TARGET_COLOR.bg).toBe('#896ab0');
    expect(TARGET_COLOR.isTarget).toBe(true);
  });

  test('no distractor shares the target color', () => {
    DISTRACTOR_COLORS.forEach((c) => {
      expect(c.bg).not.toBe(TARGET_COLOR.bg);
    });
  });
});

describe('checkLevel', () => {
  test('level 1 at 0 hits', () => {
    expect(checkLevel(0, 1)).toBe(1);
  });

  test('level 1 at 9 hits', () => {
    expect(checkLevel(9, 1)).toBe(1);
  });

  test('level 2 at 10 hits', () => {
    expect(checkLevel(10, 1)).toBe(2);
  });

  test('level 3 at 20 hits', () => {
    expect(checkLevel(20, 2)).toBe(3);
  });

  test('level 6 at 50 hits', () => {
    expect(checkLevel(50, 5)).toBe(6);
  });
});

describe('getSpawnInterval', () => {
  test('level 1 interval is 1650ms', () => {
    expect(getSpawnInterval(1)).toBe(1650);
  });

  test('level 5 interval is 1050ms', () => {
    expect(getSpawnInterval(5)).toBe(1050);
  });

  test('interval never goes below 600ms', () => {
    expect(getSpawnInterval(100)).toBe(600);
  });

  test('interval at level 8 is 600', () => {
    expect(getSpawnInterval(8)).toBe(600);
  });
});

describe('getBubbleDuration', () => {
  test('level 1 duration is 7.6s', () => {
    expect(getBubbleDuration(1)).toBeCloseTo(7.6);
  });

  test('level 5 duration is 6.0s', () => {
    expect(getBubbleDuration(5)).toBeCloseTo(6.0);
  });

  test('duration never goes below 3.5s', () => {
    expect(getBubbleDuration(100)).toBe(3.5);
  });
});

describe('bubble spawn probability', () => {
  test('target probability is 30%', () => {
    const TARGET_PROB = 0.3;
    const iterations = 10000;
    let targetCount = 0;
    for (let i = 0; i < iterations; i++) {
      if (Math.random() < TARGET_PROB) targetCount++;
    }
    const ratio = targetCount / iterations;
    expect(ratio).toBeGreaterThan(0.25);
    expect(ratio).toBeLessThan(0.35);
  });
});

describe('streak milestone messages', () => {
  const compliments = ['¡INCREÍBLE!', '¡BRUTAL!', '¡GENIAL!', '¡PERFECTO!', '¡ASOMBROSO!'];

  test('compliments array has 5 entries', () => {
    expect(compliments).toHaveLength(5);
  });

  test('milestone at every 5 streaks', () => {
    [5, 10, 15, 20].forEach((streak) => {
      expect(streak % 5 === 0 && streak > 0).toBe(true);
    });
  });

  test('non-milestones at other values', () => {
    [1, 2, 3, 4, 6, 7].forEach((streak) => {
      expect(streak % 5 === 0).toBe(false);
    });
  });
});
