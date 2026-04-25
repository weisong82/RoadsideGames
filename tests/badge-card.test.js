'use strict';

describe('BadgeCard()', () => {
  let BadgeCard;

  beforeEach(() => {
    jest.resetModules();
    require('../components/badge-card.js');
    BadgeCard = global.BadgeCard;
  });

  test('applies "unlocked" CSS class for an unlocked badge', () => {
    const html = BadgeCard({ badgeId: 'shop-detective', unlocked: true, badgeName: '小店侦探', icon: '🏪' });
    expect(html).toContain('badge-card unlocked');
  });

  test('applies "locked" CSS class for a locked badge', () => {
    const html = BadgeCard({ badgeId: 'shop-detective', unlocked: false, badgeName: '小店侦探', icon: '🏪' });
    expect(html).toContain('badge-card locked');
  });

  test('shows the badge icon when unlocked', () => {
    const html = BadgeCard({ badgeId: 'shop-detective', unlocked: true, badgeName: '小店侦探', icon: '🏪' });
    expect(html).toContain('🏪');
  });

  test('shows the lock icon 🔒 when locked', () => {
    const html = BadgeCard({ badgeId: 'shop-detective', unlocked: false, badgeName: '小店侦探', icon: '🏪' });
    expect(html).toContain('🔒');
    expect(html).not.toContain('🏪');
  });

  test('includes the badge name in both locked and unlocked states', () => {
    const unlocked = BadgeCard({ badgeId: 'x', unlocked: true, badgeName: '植物学家', icon: '🌿' });
    const locked = BadgeCard({ badgeId: 'x', unlocked: false, badgeName: '植物学家', icon: '🌿' });
    expect(unlocked).toContain('植物学家');
    expect(locked).toContain('植物学家');
  });

  test('shows "已收集" label when unlocked', () => {
    const html = BadgeCard({ badgeId: 'x', unlocked: true, badgeName: 'Test', icon: '⭐' });
    expect(html).toContain('已收集');
  });

  test('does not show "已收集" label when locked', () => {
    const html = BadgeCard({ badgeId: 'x', unlocked: false, badgeName: 'Test', icon: '⭐' });
    expect(html).not.toContain('已收集');
  });

  test('does not include the badge-date element when locked', () => {
    const html = BadgeCard({ badgeId: 'x', unlocked: false, badgeName: 'Test', icon: '⭐' });
    expect(html).not.toContain('badge-date');
  });

  test('renders valid HTML containing a root badge-card element', () => {
    const html = BadgeCard({ badgeId: 'abc', unlocked: true, badgeName: 'Name', icon: '🏆' });
    expect(html.trim()).toMatch(/^<div class="badge-card/);
  });

  test('handles all five game badges correctly', () => {
    const badges = [
      { badgeId: 'shop-detective', badgeName: '小店侦探', icon: '🏪' },
      { badgeId: 'plant-lover', badgeName: '植物学家', icon: '🌿' },
      { badgeId: 'sound-hunter', badgeName: '声音猎人', icon: '🎵' },
      { badgeId: 'color-explorer', badgeName: '色彩探险家', icon: '🎨' },
      { badgeId: 'people-person', badgeName: '社交达人', icon: '👋' }
    ];

    badges.forEach(({ badgeId, badgeName, icon }) => {
      const html = BadgeCard({ badgeId, unlocked: true, badgeName, icon });
      expect(html).toContain(badgeName);
      expect(html).toContain(icon);
      expect(html).toContain('已收集');
    });
  });
});
