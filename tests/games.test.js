'use strict';

describe('Games', () => {
  let Store, Games, GAME_METADATA;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    require('../js/store.js');
    require('../js/games.js');
    Store = global.Store;
    Games = global.Games;
    GAME_METADATA = global.GAME_METADATA;
  });

  // ─── register() ───────────────────────────────────────────────────────────

  describe('register()', () => {
    test('stores a game by its id', () => {
      const game = { id: 'test-game', title: 'Test', icon: '🎮', steps: [] };
      Games.register(game);
      expect(Games.get('test-game')).toBe(game);
    });

    test('overwrites a previously registered game with the same id', () => {
      const v1 = { id: 'x', title: 'V1', icon: '1️⃣', steps: [] };
      const v2 = { id: 'x', title: 'V2', icon: '2️⃣', steps: [] };
      Games.register(v1);
      Games.register(v2);
      expect(Games.get('x').title).toBe('V2');
    });
  });

  // ─── get() ────────────────────────────────────────────────────────────────

  describe('get()', () => {
    test('retrieves a game by its id', () => {
      const game = { id: 'my-game', title: 'My Game', icon: '🎯', steps: [] };
      Games.register(game);
      expect(Games.get('my-game')).toBe(game);
    });

    test('returns undefined for an unregistered id', () => {
      expect(Games.get('does-not-exist')).toBeUndefined();
    });
  });

  // ─── getAll() ─────────────────────────────────────────────────────────────

  describe('getAll()', () => {
    test('returns an array of all registered games', () => {
      const all = Games.getAll();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThanOrEqual(5);
    });

    test('every returned item has at least an id and title', () => {
      Games.getAll().forEach(game => {
        expect(game).toHaveProperty('id');
        expect(game).toHaveProperty('title');
      });
    });

    test('reflects newly registered games immediately', () => {
      const before = Games.getAll().length;
      Games.register({ id: 'extra', title: 'Extra', icon: '➕', steps: [] });
      expect(Games.getAll().length).toBe(before + 1);
    });
  });

  // ─── getDaily() ───────────────────────────────────────────────────────────

  describe('getDaily()', () => {
    test('returns a registered game object', () => {
      const daily = Games.getDaily();
      expect(daily).toBeDefined();
      expect(daily).toHaveProperty('id');
      expect(daily).toHaveProperty('title');
    });

    test('is deterministic — two calls on the same day return the same game', () => {
      expect(Games.getDaily().id).toBe(Games.getDaily().id);
    });

    test('the returned game is actually registered in the registry', () => {
      const daily = Games.getDaily();
      expect(Games.get(daily.id)).toBe(daily);
    });

    test('returns a valid array index (no out-of-bounds game)', () => {
      const daily = Games.getDaily();
      const ids = Games.getAll().map(g => g.id);
      expect(ids).toContain(daily.id);
    });
  });

  // ─── checkBadgeUnlock() ───────────────────────────────────────────────────

  describe('checkBadgeUnlock()', () => {
    test('returns null for an unregistered game id', () => {
      expect(Games.checkBadgeUnlock('unknown-game')).toBeNull();
    });

    test('returns null for a game that has no badge defined', () => {
      Games.register({ id: 'no-badge', title: 'No Badge', icon: '🎮', steps: [] });
      expect(Games.checkBadgeUnlock('no-badge')).toBeNull();
    });

    test('returns null when play count is below the badge threshold', () => {
      // shop-game threshold is 3; one play should not unlock
      Store.incrementGame('shop-game');
      expect(Games.checkBadgeUnlock('shop-game')).toBeNull();
    });

    test('returns null when play count is one below the threshold', () => {
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      expect(Games.checkBadgeUnlock('shop-game')).toBeNull();
    });

    test('returns the badge id when count exactly meets the threshold', () => {
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      expect(Games.checkBadgeUnlock('shop-game')).toBe('shop-detective');
    });

    test('returns the badge id when count exceeds the threshold', () => {
      for (let i = 0; i < 5; i++) Store.incrementGame('shop-game');
      expect(Games.checkBadgeUnlock('shop-game')).toBe('shop-detective');
    });

    test('returns null on a second call once the badge is already owned', () => {
      for (let i = 0; i < 3; i++) Store.incrementGame('shop-game');
      Games.checkBadgeUnlock('shop-game'); // first unlock
      expect(Games.checkBadgeUnlock('shop-game')).toBeNull(); // already owned
    });

    test('adds the badge to Store when unlocked', () => {
      for (let i = 0; i < 3; i++) Store.incrementGame('plant-game');
      Games.checkBadgeUnlock('plant-game');
      expect(Store.hasBadge('plant-lover')).toBe(true);
    });

    test('unlocking one game badge does not affect another game', () => {
      for (let i = 0; i < 3; i++) Store.incrementGame('shop-game');
      Games.checkBadgeUnlock('shop-game');
      expect(Store.hasBadge('plant-lover')).toBe(false);
    });
  });

  // ─── GAME_METADATA ────────────────────────────────────────────────────────

  describe('GAME_METADATA', () => {
    test('contains exactly 5 game definitions', () => {
      expect(GAME_METADATA).toHaveLength(5);
    });

    test('every entry has all required metadata fields', () => {
      GAME_METADATA.forEach(game => {
        expect(game).toHaveProperty('id');
        expect(game).toHaveProperty('title');
        expect(game).toHaveProperty('icon');
        expect(game).toHaveProperty('description');
        expect(game).toHaveProperty('badge');
        expect(game).toHaveProperty('badgeName');
        expect(game).toHaveProperty('badgeThreshold');
        expect(game).toHaveProperty('color');
      });
    });

    test('all game ids are unique', () => {
      const ids = GAME_METADATA.map(g => g.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    test('all badge ids are unique', () => {
      const badges = GAME_METADATA.map(g => g.badge);
      expect(new Set(badges).size).toBe(badges.length);
    });

    test('badgeThreshold is a positive integer for every game', () => {
      GAME_METADATA.forEach(game => {
        expect(Number.isInteger(game.badgeThreshold)).toBe(true);
        expect(game.badgeThreshold).toBeGreaterThan(0);
      });
    });

    test('every color is a valid 6-digit hex string', () => {
      GAME_METADATA.forEach(game => {
        expect(game.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });
});
