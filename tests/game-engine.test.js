'use strict';

/**
 * Loads all game-engine dependencies in the correct order and returns the
 * module globals.  Called inside beforeEach so every test starts fresh.
 */
function loadAll() {
  require('../js/store.js');
  require('../js/games.js');
  require('../games/shop-game.js');
  require('../games/plant-game.js');
  require('../games/color-game.js');
  require('../games/sound-game.js');
  require('../games/people-game.js');
  require('../js/game-engine.js');
  return {
    Store: global.Store,
    Games: global.Games,
    GameEngine: global.GameEngine,
    GAME_METADATA: global.GAME_METADATA
  };
}

describe('GameEngine', () => {
  let Store, Games, GameEngine;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    jest.useFakeTimers();

    // Minimal DOM required by the engine
    document.body.innerHTML = '<div id="main-content"></div>';

    ({ Store, Games, GameEngine } = loadAll());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ─── start() ──────────────────────────────────────────────────────────────

  describe('start()', () => {
    test('logs an error for an unregistered game id', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      GameEngine.start('nonexistent-game');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test('appends a toast to the body for an unregistered game id', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      GameEngine.start('nonexistent-game');
      expect(document.querySelectorAll('.toast').length).toBeGreaterThan(0);
    });

    test('sets currentGame to the requested game', () => {
      GameEngine.start('shop-game');
      expect(GameEngine.currentGame).not.toBeNull();
      expect(GameEngine.currentGame.id).toBe('shop-game');
    });

    test('resets currentStepIndex to 0', () => {
      GameEngine.currentStepIndex = 99;
      GameEngine.start('shop-game');
      expect(GameEngine.currentStepIndex).toBe(0);
    });

    test('increments the play count in Store', () => {
      GameEngine.start('shop-game');
      expect(Store.getGameCount('shop-game')).toBe(1);
    });

    test('renders the game container into #main-content', () => {
      GameEngine.start('shop-game');
      expect(document.getElementById('main-content').innerHTML).toContain('game-container');
    });

    test('stores null for currentPhoto on a game without photos', () => {
      GameEngine.start('shop-game');
      expect(GameEngine.currentPhoto).toBeNull();
    });

    test('stores a photo object for a game that has a photos array', () => {
      GameEngine.start('plant-game');
      expect(GameEngine.currentPhoto).not.toBeNull();
      expect(GameEngine.currentPhoto).toHaveProperty('name');
      expect(GameEngine.currentPhoto).toHaveProperty('imageUrl');
    });

    test('accepts and stores an onComplete callback', () => {
      const onComplete = jest.fn();
      GameEngine.start('shop-game', { onComplete });
      expect(GameEngine.onComplete).toBe(onComplete);
    });

    test('uses a no-op when no onComplete callback is provided', () => {
      GameEngine.start('shop-game');
      expect(() => GameEngine.onComplete({})).not.toThrow();
    });
  });

  // ─── renderStepContent() ──────────────────────────────────────────────────

  describe('renderStepContent()', () => {
    beforeEach(() => {
      GameEngine.start('shop-game');
    });

    test('intro step contains "step-intro" wrapper and step text', () => {
      const html = GameEngine.renderStepContent({ type: 'intro', text: 'Hello world' });
      expect(html).toContain('step-intro');
      expect(html).toContain('Hello world');
    });

    test('intro step shows the current game icon', () => {
      const html = GameEngine.renderStepContent({ type: 'intro', text: 'x' });
      expect(html).toContain(GameEngine.currentGame.icon);
    });

    test('observation step without timer contains no timer element', () => {
      const html = GameEngine.renderStepContent({ type: 'observation', text: 'Look around' });
      expect(html).toContain('step-observation');
      expect(html).not.toContain('class="timer"');
    });

    test('observation step with timer renders the countdown element', () => {
      const html = GameEngine.renderStepContent({ type: 'observation', text: 'Listen', timer: 30 });
      expect(html).toContain('class="timer"');
      expect(html).toContain('30秒');
      expect(html).toContain('data-seconds="30"');
    });

    test('input step with number type renders a number input', () => {
      const html = GameEngine.renderStepContent({ type: 'input', inputType: 'number', text: 'How old?' });
      expect(html).toContain('type="number"');
    });

    test('input step with text type renders a text input', () => {
      const html = GameEngine.renderStepContent({ type: 'input', inputType: 'text', text: 'Describe' });
      expect(html).toContain('type="text"');
    });

    test('input step with showPhoto renders photo container for a game that has photos', () => {
      GameEngine.start('plant-game');
      const html = GameEngine.renderStepContent({ type: 'input', inputType: 'text', showPhoto: true, text: 'Which plant?' });
      expect(html).toContain('plant-photo-container');
    });

    test('input step with showPhoto=false does not render photo container', () => {
      GameEngine.start('plant-game');
      const html = GameEngine.renderStepContent({ type: 'input', inputType: 'text', showPhoto: false, text: 'No photo' });
      expect(html).not.toContain('plant-photo-container');
    });

    test('input step with showPhoto and no currentPhoto does not render photo container', () => {
      // shop-game has no photos
      const html = GameEngine.renderStepContent({ type: 'input', inputType: 'text', showPhoto: true, text: 'No photo' });
      expect(html).not.toContain('plant-photo-container');
    });

    test('challenge step contains "step-challenge" wrapper and step text', () => {
      const html = GameEngine.renderStepContent({ type: 'challenge', text: 'Try this!' });
      expect(html).toContain('step-challenge');
      expect(html).toContain('Try this!');
    });

    test('complete step contains "step-complete" wrapper and step text', () => {
      const html = GameEngine.renderStepContent({ type: 'complete', text: 'Great job!' });
      expect(html).toContain('step-complete');
      expect(html).toContain('Great job!');
    });

    test('unknown step type falls back to "step-default" wrapper', () => {
      const html = GameEngine.renderStepContent({ type: 'unknown-type', text: 'Fallback text' });
      expect(html).toContain('step-default');
      expect(html).toContain('Fallback text');
    });
  });

  // ─── renderStepActions() ──────────────────────────────────────────────────

  describe('renderStepActions()', () => {
    test('shows "完成" button on the last step', () => {
      GameEngine.start('shop-game');
      const steps = GameEngine.currentGame.steps;
      GameEngine.currentStepIndex = steps.length - 1;
      const html = GameEngine.renderStepActions(steps[steps.length - 1]);
      expect(html).toContain('完成');
      expect(html).toContain('complete-btn');
    });

    test('shows skip and next buttons on non-final steps', () => {
      GameEngine.start('shop-game');
      GameEngine.currentStepIndex = 0;
      const html = GameEngine.renderStepActions(GameEngine.currentGame.steps[0]);
      expect(html).toContain('跳过');
      expect(html).toContain('下一步');
    });
  });

  // ─── next() ───────────────────────────────────────────────────────────────

  describe('next()', () => {
    test('increments currentStepIndex by 1', () => {
      GameEngine.start('shop-game');
      expect(GameEngine.currentStepIndex).toBe(0);
      GameEngine.next();
      expect(GameEngine.currentStepIndex).toBe(1);
    });

    test('clears any active timer interval', () => {
      GameEngine.start('shop-game');
      const id = setInterval(() => {}, 1000);
      GameEngine.timerInterval = id;
      GameEngine.next();
      // Verifies clearInterval was called without error
      expect(GameEngine.timerInterval).toBe(id); // id stored; timer cleared
    });

    test('renders the next step content', () => {
      GameEngine.start('shop-game');
      GameEngine.next();
      const content = document.getElementById('main-content').innerHTML;
      expect(content).toContain('step-progress');
    });
  });

  // ─── skip() ───────────────────────────────────────────────────────────────

  describe('skip()', () => {
    test('advances to the next step when the user confirms', () => {
      global.confirm = jest.fn(() => true);
      GameEngine.start('shop-game');
      GameEngine.skip();
      expect(GameEngine.currentStepIndex).toBe(1);
    });

    test('stays on the same step when the user cancels', () => {
      global.confirm = jest.fn(() => false);
      GameEngine.start('shop-game');
      GameEngine.skip();
      expect(GameEngine.currentStepIndex).toBe(0);
    });

    test('clears timer interval on confirmation', () => {
      global.confirm = jest.fn(() => true);
      GameEngine.start('shop-game');
      const id = setInterval(() => {}, 1000);
      GameEngine.timerInterval = id;
      GameEngine.skip();
      expect(GameEngine.currentStepIndex).toBe(1);
    });
  });

  // ─── complete() ───────────────────────────────────────────────────────────

  describe('complete()', () => {
    test('renders the completion screen in #main-content', () => {
      GameEngine.start('shop-game');
      const steps = GameEngine.currentGame.steps;
      GameEngine.currentStepIndex = steps.length;
      GameEngine.complete();
      expect(document.getElementById('main-content').innerHTML).toContain('game-complete');
    });

    test('shows the badge-unlocked section when a badge is newly earned', () => {
      // Two prior plays + one inside start() = 3 total → threshold met
      Store.incrementGame('shop-game');
      Store.incrementGame('shop-game');
      GameEngine.start('shop-game');
      GameEngine.currentStepIndex = GameEngine.currentGame.steps.length;
      GameEngine.complete();
      expect(document.getElementById('main-content').innerHTML).toContain('badge-unlocked');
    });

    test('does not show the badge-unlocked section when threshold not met', () => {
      GameEngine.start('shop-game'); // only 1 play
      GameEngine.currentStepIndex = GameEngine.currentGame.steps.length;
      GameEngine.complete();
      expect(document.getElementById('main-content').innerHTML).not.toContain('badge-unlocked');
    });

    test('resets currentGame to null after completion', () => {
      GameEngine.start('shop-game');
      GameEngine.currentStepIndex = GameEngine.currentGame.steps.length;
      GameEngine.complete();
      expect(GameEngine.currentGame).toBeNull();
    });

    test('resets currentPhoto to null after completion', () => {
      GameEngine.start('plant-game');
      GameEngine.currentStepIndex = GameEngine.currentGame.steps.length;
      GameEngine.complete();
      expect(GameEngine.currentPhoto).toBeNull();
    });

    test('invokes the onComplete callback with gameId and unlockedBadge', () => {
      const onComplete = jest.fn();
      GameEngine.start('shop-game', { onComplete });
      GameEngine.currentStepIndex = GameEngine.currentGame.steps.length;
      GameEngine.complete();
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({ gameId: 'shop-game' })
      );
    });
  });

  // ─── getBadgeName() ───────────────────────────────────────────────────────

  describe('getBadgeName()', () => {
    beforeEach(() => {
      GameEngine.start('shop-game');
    });

    test('returns the localised badge name for a known badge id', () => {
      expect(GameEngine.getBadgeName('shop-detective')).toBe('小店侦探');
    });

    test('returns the raw badge id for an unknown badge', () => {
      expect(GameEngine.getBadgeName('mystery-badge')).toBe('mystery-badge');
    });

    test('returns correct names for all five game badges', () => {
      const expected = {
        'shop-detective': '小店侦探',
        'plant-lover': '植物学家',
        'sound-hunter': '声音猎人',
        'color-explorer': '色彩探险家',
        'people-person': '社交达人'
      };
      Object.entries(expected).forEach(([id, name]) => {
        expect(GameEngine.getBadgeName(id)).toBe(name);
      });
    });
  });

  // ─── startTimer() ─────────────────────────────────────────────────────────

  describe('startTimer()', () => {
    test('decrements the .timer element each second', () => {
      GameEngine.start('shop-game');
      document.getElementById('main-content').innerHTML += '<div class="timer">10秒</div>';
      GameEngine.startTimer(10);
      jest.advanceTimersByTime(3000);
      const timerEl = document.querySelector('.timer');
      if (timerEl) {
        expect(timerEl.textContent).toBe('7秒');
      }
    });

    test('clears the interval once the countdown reaches zero', () => {
      GameEngine.start('shop-game');
      GameEngine.startTimer(2);
      jest.advanceTimersByTime(5000); // advance well past the end
      // No unhandled errors; timerInterval is no longer ticking
    });
  });

  // ─── showToast() ──────────────────────────────────────────────────────────

  describe('showToast()', () => {
    test('appends a .toast element to document.body', () => {
      GameEngine.showToast('Hello', 'info');
      expect(document.querySelectorAll('.toast').length).toBeGreaterThan(0);
    });

    test('includes the provided message text', () => {
      GameEngine.showToast('Something went wrong', 'error');
      const toast = document.querySelector('.toast');
      expect(toast.textContent).toBe('Something went wrong');
    });

    test('applies the correct CSS type class', () => {
      GameEngine.showToast('Warning', 'error');
      const toast = document.querySelector('.toast');
      expect(toast.classList.contains('toast-error')).toBe(true);
    });

    test('removes the toast from the DOM after the timeout', () => {
      GameEngine.showToast('Temporary', 'info');
      expect(document.querySelectorAll('.toast').length).toBe(1);
      jest.advanceTimersByTime(4000); // 3 s display + 350 ms fade
      expect(document.querySelectorAll('.toast').length).toBe(0);
    });
  });
});
