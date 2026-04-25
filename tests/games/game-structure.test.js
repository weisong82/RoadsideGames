'use strict';

const VALID_STEP_TYPES = new Set(['intro', 'observation', 'input', 'challenge', 'complete', 'timer']);

describe('Game Structure Validation', () => {
  let Games;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    require('../../js/store.js');
    require('../../js/games.js');
    require('../../games/shop-game.js');
    require('../../games/plant-game.js');
    require('../../games/color-game.js');
    require('../../games/sound-game.js');
    require('../../games/people-game.js');
    Games = global.Games;
  });

  // ─── Required fields ──────────────────────────────────────────────────────

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s is registered and has all required top-level fields',
    (gameId) => {
      const game = Games.get(gameId);
      expect(game).toBeDefined();
      expect(game.id).toBe(gameId);
      expect(typeof game.title).toBe('string');
      expect(game.title.length).toBeGreaterThan(0);
      expect(typeof game.icon).toBe('string');
      expect(game.icon.length).toBeGreaterThan(0);
      expect(typeof game.description).toBe('string');
      expect(game.description.length).toBeGreaterThan(0);
      expect(Array.isArray(game.steps)).toBe(true);
      expect(game.steps.length).toBeGreaterThan(0);
      expect(typeof game.badge).toBe('string');
      expect(game.badge.length).toBeGreaterThan(0);
      expect(Number.isInteger(game.badgeThreshold)).toBe(true);
      expect(game.badgeThreshold).toBeGreaterThan(0);
    }
  );

  // ─── Step structure ───────────────────────────────────────────────────────

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s — every step has a valid type and non-empty text',
    (gameId) => {
      const game = Games.get(gameId);
      game.steps.forEach((step, i) => {
        expect(VALID_STEP_TYPES.has(step.type)).toBe(true);
        expect(typeof step.text).toBe('string');
        expect(step.text.length).toBeGreaterThan(0);
      });
    }
  );

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s — last step is of type "complete"',
    (gameId) => {
      const game = Games.get(gameId);
      const lastStep = game.steps[game.steps.length - 1];
      expect(lastStep.type).toBe('complete');
    }
  );

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s — first step is of type "intro"',
    (gameId) => {
      const game = Games.get(gameId);
      expect(game.steps[0].type).toBe('intro');
    }
  );

  // ─── Input step details ───────────────────────────────────────────────────

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s — every input step has a valid inputType ("text" or "number")',
    (gameId) => {
      const game = Games.get(gameId);
      game.steps
        .filter(s => s.type === 'input')
        .forEach((step) => {
          expect(['text', 'number']).toContain(step.inputType);
        });
    }
  );

  // ─── Timer steps ──────────────────────────────────────────────────────────

  test('sound-game has at least one observation step with a timer', () => {
    const game = Games.get('sound-game');
    const timedSteps = game.steps.filter(s => s.type === 'observation' && s.timer);
    expect(timedSteps.length).toBeGreaterThan(0);
    timedSteps.forEach(step => {
      expect(typeof step.timer).toBe('number');
      expect(step.timer).toBeGreaterThan(0);
    });
  });

  // ─── Games with photos ────────────────────────────────────────────────────

  test.each(['plant-game', 'people-game'])(
    '%s — has a non-empty photos array',
    (gameId) => {
      const game = Games.get(gameId);
      expect(Array.isArray(game.photos)).toBe(true);
      expect(game.photos.length).toBeGreaterThan(0);
    }
  );

  test.each(['plant-game', 'people-game'])(
    '%s — every photo has name, hint, imageUrl, and fallbackIcon',
    (gameId) => {
      const game = Games.get(gameId);
      game.photos.forEach((photo) => {
        expect(typeof photo.name).toBe('string');
        expect(photo.name.length).toBeGreaterThan(0);
        expect(typeof photo.hint).toBe('string');
        expect(photo.hint.length).toBeGreaterThan(0);
        expect(typeof photo.imageUrl).toBe('string');
        expect(photo.imageUrl.length).toBeGreaterThan(0);
        expect(typeof photo.fallbackIcon).toBe('string');
        expect(photo.fallbackIcon.length).toBeGreaterThan(0);
      });
    }
  );

  test.each(['plant-game', 'people-game'])(
    '%s — has at least one input step with showPhoto: true',
    (gameId) => {
      const game = Games.get(gameId);
      const photoInputSteps = game.steps.filter(s => s.type === 'input' && s.showPhoto);
      expect(photoInputSteps.length).toBeGreaterThan(0);
    }
  );

  test('plant-game has 20 photos', () => {
    expect(Games.get('plant-game').photos).toHaveLength(20);
  });

  test('people-game has 20 photos', () => {
    expect(Games.get('people-game').photos).toHaveLength(20);
  });

  // ─── Color game specifics ─────────────────────────────────────────────────

  test('color-game covers red, yellow, and green challenges', () => {
    const game = Games.get('color-game');
    const challengeSteps = game.steps.filter(s => s.type === 'challenge');
    expect(challengeSteps.length).toBeGreaterThanOrEqual(3);
  });

  // ─── Colour validity ──────────────────────────────────────────────────────

  test.each(['shop-game', 'plant-game', 'color-game', 'sound-game', 'people-game'])(
    '%s — game.color is a valid 6-digit hex colour',
    (gameId) => {
      const game = Games.get(gameId);
      expect(game.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  );
});
