'use strict';

describe('Store', () => {
  let Store;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    require('../js/store.js');
    Store = global.Store;
  });

  // ─── init() ───────────────────────────────────────────────────────────────

  describe('init()', () => {
    test('starts with empty badges and gameStats when storage is empty', () => {
      expect(Store.state.badges).toEqual([]);
      expect(Store.state.gameStats).toEqual({});
    });

    test('starts with streak 0 and null lastPlayDate', () => {
      expect(Store.state.streak).toBe(0);
      expect(Store.state.lastPlayDate).toBeNull();
    });

    test('starts with default settings', () => {
      expect(Store.state.settings.soundEnabled).toBe(true);
      expect(Store.state.settings.notificationsEnabled).toBe(false);
    });

    test('restores persisted badges and gameStats from localStorage', () => {
      localStorage.setItem('roadGames', JSON.stringify({
        badges: ['shop-detective', 'plant-lover'],
        gameStats: { 'shop-game': 5, 'color-game': 2 },
        streak: 3,
        lastPlayDate: 'Mon Jan 01 2024'
      }));
      jest.resetModules();
      require('../js/store.js');
      const s = global.Store;
      expect(s.state.badges).toEqual(['shop-detective', 'plant-lover']);
      expect(s.state.gameStats['shop-game']).toBe(5);
      expect(s.state.streak).toBe(3);
      expect(s.state.lastPlayDate).toBe('Mon Jan 01 2024');
    });

    test('recovers gracefully from corrupt localStorage without throwing', () => {
      localStorage.setItem('roadGames', '{ invalid json }');
      jest.resetModules();
      expect(() => require('../js/store.js')).not.toThrow();
      const s = global.Store;
      expect(s.state.badges).toEqual([]);
    });

    test('partially merges valid fields from localStorage', () => {
      // Only streak is stored; other fields fall back to defaults
      localStorage.setItem('roadGames', JSON.stringify({ streak: 7 }));
      jest.resetModules();
      require('../js/store.js');
      const s = global.Store;
      expect(s.state.streak).toBe(7);
      expect(s.state.badges).toEqual([]);
    });
  });

  // ─── save() ───────────────────────────────────────────────────────────────

  describe('save()', () => {
    test('persists current state to localStorage', () => {
      Store.state.streak = 5;
      Store.save();
      const saved = JSON.parse(localStorage.getItem('roadGames'));
      expect(saved.streak).toBe(5);
    });

    test('invokes the registered onChange callback with current state', () => {
      const callback = jest.fn();
      Store.onChange(callback);
      Store.save();
      expect(callback).toHaveBeenCalledWith(Store.state);
    });

    test('does not throw when no onChange callback has been registered', () => {
      Store._changeCallback = undefined;
      expect(() => Store.save()).not.toThrow();
    });
  });

  // ─── addBadge() ───────────────────────────────────────────────────────────

  describe('addBadge()', () => {
    test('returns true and stores a new badge', () => {
      const result = Store.addBadge('shop-detective');
      expect(result).toBe(true);
      expect(Store.state.badges).toContain('shop-detective');
    });

    test('returns false and does not duplicate an existing badge', () => {
      Store.addBadge('shop-detective');
      const result = Store.addBadge('shop-detective');
      expect(result).toBe(false);
      expect(Store.state.badges.filter(b => b === 'shop-detective')).toHaveLength(1);
    });

    test('persists the new badge to localStorage', () => {
      Store.addBadge('plant-lover');
      const saved = JSON.parse(localStorage.getItem('roadGames'));
      expect(saved.badges).toContain('plant-lover');
    });

    test('stores multiple different badges', () => {
      Store.addBadge('shop-detective');
      Store.addBadge('plant-lover');
      expect(Store.state.badges).toHaveLength(2);
    });
  });

  // ─── incrementGame() ──────────────────────────────────────────────────────

  describe('incrementGame()', () => {
    test('initializes count from 0 and returns 1 on first call', () => {
      const count = Store.incrementGame('shop-game');
      expect(count).toBe(1);
    });

    test('returns the accumulated count after multiple calls', () => {
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      const count = Store.incrementGame('shop-game');
      expect(count).toBe(3);
    });

    test('tracks different games independently', () => {
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      Store.incrementGame('color-game');
      expect(Store.getGameCount('shop-game')).toBe(2);
      expect(Store.getGameCount('color-game')).toBe(1);
    });

    test('persists updated stats to localStorage', () => {
      Store.incrementGame('color-game');
      const saved = JSON.parse(localStorage.getItem('roadGames'));
      expect(saved.gameStats['color-game']).toBe(1);
    });
  });

  // ─── getGameCount() ───────────────────────────────────────────────────────

  describe('getGameCount()', () => {
    test('returns 0 for a game that has never been played', () => {
      expect(Store.getGameCount('unknown-game')).toBe(0);
    });

    test('returns the correct count after incrementing', () => {
      Store.incrementGame('sound-game');
      Store.incrementGame('sound-game');
      expect(Store.getGameCount('sound-game')).toBe(2);
    });
  });

  // ─── hasBadge() ───────────────────────────────────────────────────────────

  describe('hasBadge()', () => {
    test('returns false when the badge has not been awarded', () => {
      expect(Store.hasBadge('shop-detective')).toBe(false);
    });

    test('returns true after the badge is added', () => {
      Store.addBadge('shop-detective');
      expect(Store.hasBadge('shop-detective')).toBe(true);
    });
  });

  // ─── getAllBadges() ────────────────────────────────────────────────────────

  describe('getAllBadges()', () => {
    test('returns an empty array when no badges have been earned', () => {
      expect(Store.getAllBadges()).toEqual([]);
    });

    test('returns all earned badges', () => {
      Store.addBadge('shop-detective');
      Store.addBadge('plant-lover');
      const badges = Store.getAllBadges();
      expect(badges).toHaveLength(2);
      expect(badges).toContain('shop-detective');
      expect(badges).toContain('plant-lover');
    });

    test('returns a copy — mutations do not affect internal state', () => {
      Store.addBadge('shop-detective');
      const badges = Store.getAllBadges();
      badges.push('tampered');
      expect(Store.state.badges).not.toContain('tampered');
    });
  });

  // ─── updateStreak() ───────────────────────────────────────────────────────

  describe('updateStreak()', () => {
    test('sets streak to 1 on the very first play', () => {
      expect(Store.updateStreak()).toBe(1);
    });

    test('increments streak when called on the day after the last play', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      Store.state.lastPlayDate = yesterday.toDateString();
      Store.state.streak = 3;
      expect(Store.updateStreak()).toBe(4);
    });

    test('resets streak to 1 when more than one day has been missed', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      Store.state.lastPlayDate = twoDaysAgo.toDateString();
      Store.state.streak = 5;
      expect(Store.updateStreak()).toBe(1);
    });

    test('does not change streak when called multiple times on the same day', () => {
      Store.updateStreak(); // streak → 1, lastPlayDate → today
      Store.state.streak = 7; // simulate a higher streak set by another path
      expect(Store.updateStreak()).toBe(7); // unchanged
    });

    test('updates lastPlayDate to today', () => {
      const today = new Date().toDateString();
      Store.updateStreak();
      expect(Store.state.lastPlayDate).toBe(today);
    });
  });

  // ─── onChange() / emitChange() ────────────────────────────────────────────

  describe('onChange() / emitChange()', () => {
    test('invokes the registered callback with the current state', () => {
      const callback = jest.fn();
      Store.onChange(callback);
      Store.emitChange();
      expect(callback).toHaveBeenCalledWith(Store.state);
    });

    test('replaces a previously registered callback', () => {
      const first = jest.fn();
      const second = jest.fn();
      Store.onChange(first);
      Store.onChange(second);
      Store.emitChange();
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalled();
    });

    test('does not throw when no callback is registered', () => {
      Store._changeCallback = undefined;
      expect(() => Store.emitChange()).not.toThrow();
    });
  });
});
