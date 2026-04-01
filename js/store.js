const Store = {
  state: {
    badges: [],
    gameStats: {},
    streak: 0,
    lastPlayDate: null,
    settings: {
      soundEnabled: true,
      notificationsEnabled: false
    }
  },

  // 初始化加载
  init() {
    const saved = localStorage.getItem('roadGames');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return this;
  },

  // 保存到 localStorage
  save() {
    localStorage.setItem('roadGames', JSON.stringify(this.state));
    this.emitChange();
  },

  // 添加徽章
  addBadge(badgeId) {
    if (!this.state.badges.includes(badgeId)) {
      this.state.badges.push(badgeId);
      this.save();
      return true; // 新解锁
    }
    return false; // 已获得
  },

  // 增加游戏次数
  incrementGame(gameId) {
    this.state.gameStats[gameId] = (this.state.gameStats[gameId] || 0) + 1;
    this.save();
    return this.state.gameStats[gameId];
  },

  // 获取游戏次数
  getGameCount(gameId) {
    return this.state.gameStats[gameId] || 0;
  },

  // 检查是否拥有徽章
  hasBadge(badgeId) {
    return this.state.badges.includes(badgeId);
  },

  // 获取所有徽章
  getAllBadges() {
    return [...this.state.badges];
  },

  // 更新连续天数
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.lastPlayDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (this.state.lastPlayDate === yesterday.toDateString()) {
        this.state.streak++;
      } else if (this.state.lastPlayDate !== today) {
        this.state.streak = 1;
      }

      this.state.lastPlayDate = today;
      this.save();
    }
    return this.state.streak;
  },

  // 变化事件（用于 UI 更新）
  onChange(callback) {
    this._changeCallback = callback;
  },

  emitChange() {
    if (this._changeCallback) {
      this._changeCallback(this.state);
    }
  }
};

// 导出
window.Store = Store.init();
