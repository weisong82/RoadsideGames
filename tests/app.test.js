'use strict';

/**
 * Loads the complete dependency chain for app.js tests.
 * window.location is replaced with a plain mutable object so that
 * hash-based routing can be exercised without jsdom navigation warnings.
 */
function loadAppDeps() {
  require('../js/store.js');
  require('../js/games.js');
  require('../games/shop-game.js');
  require('../games/plant-game.js');
  require('../games/color-game.js');
  require('../games/sound-game.js');
  require('../games/people-game.js');
  require('../js/game-engine.js');
  require('../components/badge-card.js');
  require('../js/app.js');
}

describe('adjustColor()', () => {
  let adjustColor;

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    document.body.innerHTML = '<div id="main-content"></div>';

    // Replace window.location so hash writes do not trigger jsdom navigation
    delete global.window.location;
    global.window.location = { hash: '#/', href: 'http://localhost/#/' };

    loadAppDeps();
    adjustColor = global.adjustColor;
  });

  test('returns a valid 6-digit lower-case hex string', () => {
    expect(adjustColor('#7AC5A7', 10)).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('brightening a colour increases channel values', () => {
    // #7A in decimal = 122; adding ~26 → 148 = 0x94
    const result = adjustColor('#7AC5A7', 10);
    const r = parseInt(result.slice(1, 3), 16);
    expect(r).toBeGreaterThan(parseInt('7A', 16));
  });

  test('darkening a colour decreases channel values', () => {
    // R component of #FF0000 is 255; darken by 20 → 255-51 = 204 = 0xCC
    const result = adjustColor('#FF0000', -20);
    expect(result.slice(1, 3).toLowerCase()).toBe('cc');
  });

  test('clamps channels at 255 when brightening beyond maximum', () => {
    const result = adjustColor('#FFFFFF', 50);
    expect(result).toBe('#ffffff');
  });

  test('clamps channels at 0 when darkening below minimum', () => {
    const result = adjustColor('#000000', -50);
    expect(result).toBe('#000000');
  });

  test('returns the same colour for a 0% adjustment', () => {
    // The implementation uses Math.round so amt=0, channels unchanged
    const result = adjustColor('#7AC5A7', 0);
    expect(result.toLowerCase()).toBe('#7ac5a7');
  });

  test('processes a mid-range colour correctly — darken #FF0000 by 20%', () => {
    // amt = Math.round(2.55 * -20) = -51
    // R = 255 - 51 = 204 = 0xCC, G = 0-51→0, B = 0-51→0
    expect(adjustColor('#FF0000', -20).toLowerCase()).toBe('#cc0000');
  });
});

// ─── router() ─────────────────────────────────────────────────────────────────

describe('router()', () => {
  let router;

  function setHash(hash) {
    global.window.location.hash = hash;
  }

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div id="main-content"></div>
      <nav>
        <a class="nav-item" href="#/">首页</a>
        <a class="nav-item" href="#/badges">徽章</a>
        <a class="nav-item" href="#/about">关于</a>
      </nav>
    `;

    delete global.window.location;
    global.window.location = { hash: '#/', href: 'http://localhost/#/' };

    loadAppDeps();
    router = global.router;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the home page for the "/" route', () => {
    setHash('#/');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('home-page');
  });

  test('renders the badges page for the "/badges" route', () => {
    setHash('#/badges');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('badges-page');
  });

  test('renders the about page for the "/about" route', () => {
    setHash('#/about');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('about-page');
  });

  test('launches the game engine for a "/game/:id" route', () => {
    setHash('#/game/shop-game');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('game-container');
  });

  test('renders an error page for an unknown route', () => {
    setHash('#/this-does-not-exist');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('error-page');
  });

  test('renders an error page for an unknown game id', () => {
    setHash('#/game/nonexistent-game');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('error-page');
  });

  test('marks the matching nav-item as active', () => {
    setHash('#/badges');
    router();
    const activeItems = document.querySelectorAll('.nav-item.active');
    expect(activeItems.length).toBeGreaterThan(0);
    expect(activeItems[0].getAttribute('href')).toBe('#/badges');
  });

  test('removes the "active" class from previously active nav-items', () => {
    // Activate badges, then switch to about
    setHash('#/badges');
    router();
    setHash('#/about');
    router();
    const activeItems = document.querySelectorAll('.nav-item.active');
    const hrefs = Array.from(activeItems).map(el => el.getAttribute('href'));
    expect(hrefs).not.toContain('#/badges');
  });

  test('renders home page when hash is empty (default route)', () => {
    global.window.location.hash = '';
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('home-page');
  });
});

// ─── renderHome() streak banner ───────────────────────────────────────────────

describe('renderHome() streak banner', () => {
  let router, Store;

  function setHash(hash) {
    global.window.location.hash = hash;
  }

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    jest.useFakeTimers();
    document.body.innerHTML = '<div id="main-content"></div>';

    delete global.window.location;
    global.window.location = { hash: '#/', href: 'http://localhost/#/' };

    loadAppDeps();
    router = global.router;
    Store = global.Store;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('shows a streak banner when the user played today with a streak > 1', () => {
    Store.state.streak = 3;
    Store.state.lastPlayDate = new Date().toDateString();
    setHash('#/');
    router();
    expect(document.getElementById('main-content').innerHTML).toContain('streak-banner');
    expect(document.getElementById('main-content').innerHTML).toContain('3');
  });

  test('shows a warning banner when the user played yesterday but not today', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    Store.state.streak = 5;
    Store.state.lastPlayDate = yesterday.toDateString();
    setHash('#/');
    router();
    const html = document.getElementById('main-content').innerHTML;
    expect(html).toContain('streak-warning');
  });

  test('shows no streak banner when streak is 0', () => {
    Store.state.streak = 0;
    setHash('#/');
    router();
    expect(document.getElementById('main-content').innerHTML).not.toContain('streak-banner');
  });
});
