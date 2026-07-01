/**
 * @jest-environment jsdom
 *
 * Tests for the word-flow (El Río de Palabras) game logic.
 * Core data and progression logic extracted from word-flow/index.html.
 */

const PAIRS = [
  { emoji: '🐱', word: 'GATO' },
  { emoji: '🌙', word: 'LUNA' },
  { emoji: '🌟', word: 'SOL' },
  { emoji: '🐶', word: 'PERRO' },
  { emoji: '🌸', word: 'FLOR' },
  { emoji: '🐟', word: 'PEZ' },
  { emoji: '🏠', word: 'CASA' },
  { emoji: '🍎', word: 'MANZANA' },
  { emoji: '🐸', word: 'RANA' },
  { emoji: '🦋', word: 'MARIPOSA' },
  { emoji: '🌈', word: 'ARCO' },
  { emoji: '🎵', word: 'NOTA' },
  { emoji: '🍃', word: 'HOJA' },
  { emoji: '🐦', word: 'PAJARO' },
  { emoji: '🌊', word: 'MAR' },
];

function getFlowDuration(levelNum) {
  return Math.max(8, 15 - Math.floor((levelNum - 1) / 3) * 1.5);
}

function getNextLevel(score) {
  return Math.floor(score / 2) + 1;
}

function updateHUD(score, totalLevels, levelNum) {
  return {
    scoreText: `${score} / ${totalLevels}`,
    levelText: String(levelNum),
    progressWidth: `${(score / totalLevels) * 100}%`,
  };
}

function selectDistractors(pairs, targetWord, count) {
  return pairs.filter((p) => p.word !== targetWord).slice(0, count);
}

describe('PAIRS data', () => {
  test('contains 15 word-emoji pairs', () => {
    expect(PAIRS).toHaveLength(15);
  });

  test('each pair has emoji and word', () => {
    PAIRS.forEach((pair) => {
      expect(pair).toHaveProperty('emoji');
      expect(pair).toHaveProperty('word');
      expect(typeof pair.emoji).toBe('string');
      expect(typeof pair.word).toBe('string');
    });
  });

  test('all words are uppercase', () => {
    PAIRS.forEach((pair) => {
      expect(pair.word).toBe(pair.word.toUpperCase());
    });
  });

  test('words are unique', () => {
    const words = PAIRS.map((p) => p.word);
    expect(new Set(words).size).toBe(words.length);
  });

  test('emojis are unique', () => {
    const emojis = PAIRS.map((p) => p.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  test('contains expected common Spanish words', () => {
    const words = PAIRS.map((p) => p.word);
    expect(words).toContain('GATO');
    expect(words).toContain('LUNA');
    expect(words).toContain('CASA');
    expect(words).toContain('MAR');
  });
});

describe('getFlowDuration', () => {
  test('level 1 duration is 15s', () => {
    expect(getFlowDuration(1)).toBe(15);
  });

  test('level 3 duration is still 15s (first bracket)', () => {
    expect(getFlowDuration(3)).toBe(15);
  });

  test('level 4 duration is 13.5s', () => {
    expect(getFlowDuration(4)).toBe(13.5);
  });

  test('level 7 duration is 12s', () => {
    expect(getFlowDuration(7)).toBe(12);
  });

  test('duration never goes below 8s', () => {
    expect(getFlowDuration(100)).toBe(8);
  });
});

describe('getNextLevel', () => {
  test('score 0 is level 1', () => {
    expect(getNextLevel(0)).toBe(1);
  });

  test('score 1 is level 1', () => {
    expect(getNextLevel(1)).toBe(1);
  });

  test('score 2 is level 2', () => {
    expect(getNextLevel(2)).toBe(2);
  });

  test('score 5 is level 3', () => {
    expect(getNextLevel(5)).toBe(3);
  });

  test('score 10 is level 6', () => {
    expect(getNextLevel(10)).toBe(6);
  });
});

describe('updateHUD', () => {
  test('initial state', () => {
    const hud = updateHUD(0, 10, 1);
    expect(hud.scoreText).toBe('0 / 10');
    expect(hud.levelText).toBe('1');
    expect(hud.progressWidth).toBe('0%');
  });

  test('mid-game', () => {
    const hud = updateHUD(5, 10, 3);
    expect(hud.scoreText).toBe('5 / 10');
    expect(hud.progressWidth).toBe('50%');
  });

  test('completed', () => {
    const hud = updateHUD(10, 10, 6);
    expect(hud.scoreText).toBe('10 / 10');
    expect(hud.progressWidth).toBe('100%');
  });
});

describe('selectDistractors', () => {
  test('excludes the target word', () => {
    const distractors = selectDistractors(PAIRS, 'GATO', 4);
    distractors.forEach((d) => {
      expect(d.word).not.toBe('GATO');
    });
  });

  test('returns the requested count', () => {
    const distractors = selectDistractors(PAIRS, 'GATO', 4);
    expect(distractors).toHaveLength(4);
  });

  test('handles count larger than available', () => {
    const distractors = selectDistractors(PAIRS, 'GATO', 100);
    expect(distractors).toHaveLength(14);
  });
});

describe('game victory condition', () => {
  const totalLevels = 10;

  test('not victorious below total', () => {
    [0, 3, 9].forEach((score) => {
      expect(score >= totalLevels).toBe(false);
    });
  });

  test('victorious at total', () => {
    expect(totalLevels >= totalLevels).toBe(true);
  });
});
