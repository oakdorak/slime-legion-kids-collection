/**
 * @jest-environment jsdom
 *
 * Tests for the breath-trainer (El Dragón que Respira) game logic.
 * Core breathing cycle logic extracted from breath-trainer/index.html.
 */

const PHASES = { inhale: 4, hold: 4, exhale: 6 };
const TOTAL_CYCLES = 3;

function getNextPhase(currentPhase) {
  if (currentPhase === 'inhale') return 'hold';
  if (currentPhase === 'hold') return 'exhale';
  if (currentPhase === 'exhale') return 'cycle_complete';
  return 'idle';
}

function getPhaseColor(phase) {
  if (phase === 'inhale') return '168,178,138';
  if (phase === 'hold') return '137,106,176';
  return '90,154,138';
}

function getPhaseLabel(phase) {
  if (phase === 'inhale') return 'INHALA';
  if (phase === 'hold') return 'SOSTÉN';
  if (phase === 'exhale') return 'EXHALA';
  return '';
}

function getScaleTargets(phase) {
  if (phase === 'inhale') return 1.15;
  if (phase === 'exhale') return 0.85;
  return null;
}

function updateCountDisplay(elapsed, duration) {
  return Math.ceil(duration - elapsed);
}

function isGameComplete(cyclesDone) {
  return cyclesDone >= TOTAL_CYCLES;
}

describe('PHASES configuration', () => {
  test('inhale lasts 4 seconds', () => {
    expect(PHASES.inhale).toBe(4);
  });

  test('hold lasts 4 seconds', () => {
    expect(PHASES.hold).toBe(4);
  });

  test('exhale lasts 6 seconds', () => {
    expect(PHASES.exhale).toBe(6);
  });

  test('total cycle duration is 14 seconds (4+4+6)', () => {
    const totalDuration = PHASES.inhale + PHASES.hold + PHASES.exhale;
    expect(totalDuration).toBe(14);
  });

  test('total session is 3 cycles', () => {
    expect(TOTAL_CYCLES).toBe(3);
  });

  test('full session lasts 42 seconds (14 * 3)', () => {
    const totalDuration = (PHASES.inhale + PHASES.hold + PHASES.exhale) * TOTAL_CYCLES;
    expect(totalDuration).toBe(42);
  });
});

describe('getNextPhase', () => {
  test('inhale -> hold', () => {
    expect(getNextPhase('inhale')).toBe('hold');
  });

  test('hold -> exhale', () => {
    expect(getNextPhase('hold')).toBe('exhale');
  });

  test('exhale -> cycle_complete', () => {
    expect(getNextPhase('exhale')).toBe('cycle_complete');
  });

  test('unknown -> idle', () => {
    expect(getNextPhase('unknown')).toBe('idle');
  });
});

describe('getPhaseColor', () => {
  test('inhale is sage green', () => {
    expect(getPhaseColor('inhale')).toBe('168,178,138');
  });

  test('hold is purple', () => {
    expect(getPhaseColor('hold')).toBe('137,106,176');
  });

  test('exhale is teal', () => {
    expect(getPhaseColor('exhale')).toBe('90,154,138');
  });
});

describe('getPhaseLabel', () => {
  test('inhale label is INHALA', () => {
    expect(getPhaseLabel('inhale')).toBe('INHALA');
  });

  test('hold label is SOSTÉN', () => {
    expect(getPhaseLabel('hold')).toBe('SOSTÉN');
  });

  test('exhale label is EXHALA', () => {
    expect(getPhaseLabel('exhale')).toBe('EXHALA');
  });

  test('idle returns empty string', () => {
    expect(getPhaseLabel('idle')).toBe('');
  });
});

describe('getScaleTargets', () => {
  test('inhale scales up to 1.15', () => {
    expect(getScaleTargets('inhale')).toBe(1.15);
  });

  test('exhale scales down to 0.85', () => {
    expect(getScaleTargets('exhale')).toBe(0.85);
  });

  test('hold has no explicit scale target', () => {
    expect(getScaleTargets('hold')).toBeNull();
  });
});

describe('updateCountDisplay', () => {
  test('shows full duration at start', () => {
    expect(updateCountDisplay(0, 4)).toBe(4);
  });

  test('shows 3 after 1 second of 4-second phase', () => {
    expect(updateCountDisplay(1, 4)).toBe(3);
  });

  test('shows 1 near end of phase', () => {
    expect(updateCountDisplay(3.1, 4)).toBe(1);
  });

  test('shows 0 when elapsed equals duration', () => {
    expect(updateCountDisplay(4, 4)).toBe(0);
  });

  test('works for 6-second exhale phase', () => {
    expect(updateCountDisplay(0, 6)).toBe(6);
    expect(updateCountDisplay(2.5, 6)).toBe(4);
    expect(updateCountDisplay(5.9, 6)).toBe(1);
  });
});

describe('isGameComplete', () => {
  test('not complete at 0 cycles', () => {
    expect(isGameComplete(0)).toBe(false);
  });

  test('not complete at 2 cycles', () => {
    expect(isGameComplete(2)).toBe(false);
  });

  test('complete at 3 cycles', () => {
    expect(isGameComplete(3)).toBe(true);
  });

  test('complete at more than 3 cycles', () => {
    expect(isGameComplete(5)).toBe(true);
  });
});

describe('breathing pattern clinical correctness (4-4-6)', () => {
  test('inhale:hold ratio is 1:1', () => {
    expect(PHASES.inhale / PHASES.hold).toBe(1);
  });

  test('inhale:exhale ratio is 2:3 (longer exhale for vagal tone)', () => {
    expect(PHASES.inhale / PHASES.exhale).toBeCloseTo(2 / 3);
  });
});
