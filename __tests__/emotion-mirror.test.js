/**
 * @jest-environment jsdom
 *
 * Tests for the emotion-mirror (El Espejo Mágico) game logic.
 * Core data structures and game progression logic extracted from
 * emotion-mirror/index.html.
 */

const EMOTIONS = [
  { word: 'FELIZ',       emoji: '😊', label: 'feliz' },
  { word: 'TRISTE',      emoji: '😢', label: 'triste' },
  { word: 'ENOJADO',     emoji: '😠', label: 'enojado' },
  { word: 'ASUSTADO',    emoji: '😨', label: 'asustado' },
  { word: 'SORPRENDIDO', emoji: '😲', label: 'sorprendido' },
  { word: 'TRANQUILO',   emoji: '😌', label: 'tranquilo' },
];

function updateProgress(score, total) {
  return {
    text: `${score} / ${total}`,
    widthPct: `${(score / total) * 100}%`,
  };
}

function handleChoice(chosenLabel, targetLabel) {
  return chosenLabel === targetLabel;
}

describe('EMOTIONS data', () => {
  test('contains 6 emotions', () => {
    expect(EMOTIONS).toHaveLength(6);
  });

  test('each emotion has word, emoji, and label', () => {
    EMOTIONS.forEach((em) => {
      expect(em).toHaveProperty('word');
      expect(em).toHaveProperty('emoji');
      expect(em).toHaveProperty('label');
      expect(typeof em.word).toBe('string');
      expect(typeof em.emoji).toBe('string');
      expect(typeof em.label).toBe('string');
    });
  });

  test('all words are uppercase', () => {
    EMOTIONS.forEach((em) => {
      expect(em.word).toBe(em.word.toUpperCase());
    });
  });

  test('all labels are lowercase', () => {
    EMOTIONS.forEach((em) => {
      expect(em.label).toBe(em.label.toLowerCase());
    });
  });

  test('labels are unique', () => {
    const labels = EMOTIONS.map((e) => e.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  test('words are unique', () => {
    const words = EMOTIONS.map((e) => e.word);
    expect(new Set(words).size).toBe(words.length);
  });

  test('emojis are unique', () => {
    const emojis = EMOTIONS.map((e) => e.emoji);
    expect(new Set(emojis).size).toBe(emojis.length);
  });

  test('contains the expected emotion set', () => {
    const labels = EMOTIONS.map((e) => e.label);
    expect(labels).toContain('feliz');
    expect(labels).toContain('triste');
    expect(labels).toContain('enojado');
    expect(labels).toContain('asustado');
    expect(labels).toContain('sorprendido');
    expect(labels).toContain('tranquilo');
  });
});

describe('updateProgress', () => {
  test('shows 0 / 10 at start', () => {
    const result = updateProgress(0, 10);
    expect(result.text).toBe('0 / 10');
    expect(result.widthPct).toBe('0%');
  });

  test('shows 5 / 10 at halfway', () => {
    const result = updateProgress(5, 10);
    expect(result.text).toBe('5 / 10');
    expect(result.widthPct).toBe('50%');
  });

  test('shows 10 / 10 at completion', () => {
    const result = updateProgress(10, 10);
    expect(result.text).toBe('10 / 10');
    expect(result.widthPct).toBe('100%');
  });
});

describe('handleChoice', () => {
  test('returns true for correct match', () => {
    expect(handleChoice('feliz', 'feliz')).toBe(true);
  });

  test('returns false for incorrect match', () => {
    expect(handleChoice('triste', 'feliz')).toBe(false);
  });

  test('is case-sensitive', () => {
    expect(handleChoice('Feliz', 'feliz')).toBe(false);
  });
});

describe('game flow logic', () => {
  test('victory triggers at score >= total', () => {
    const total = 10;
    [10, 11, 15].forEach((score) => {
      expect(score >= total).toBe(true);
    });
    [0, 5, 9].forEach((score) => {
      expect(score >= total).toBe(false);
    });
  });

  test('buildGrid shuffles but preserves all emotions', () => {
    const shuffled = [...EMOTIONS].sort(() => Math.random() - 0.5);
    expect(shuffled).toHaveLength(EMOTIONS.length);
    EMOTIONS.forEach((em) => {
      expect(shuffled.find((s) => s.label === em.label)).toBeTruthy();
    });
  });
});
