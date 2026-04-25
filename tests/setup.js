// Global test setup — runs before each test file in the jsdom environment.
// Stubs browser APIs that are not fully implemented in jsdom.

// Suppress Web Audio API (not available in jsdom)
global.AudioContext = undefined;
global.webkitAudioContext = undefined;

// Stub requestAnimationFrame / cancelAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Default confirm() to true; individual tests can override with jest.fn()
global.confirm = jest.fn(() => true);
