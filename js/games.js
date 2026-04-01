// 游戏注册表
const Games = {
  registry: {},

  // 注册游戏
  register(game) {
    this.registry[game.id] = game;
  },

  // 获取单个游戏
  get(id) {
    return this.registry[id];
  },

  // 获取所有游戏
  getAll() {
    return Object.values(this.registry);
  },

  // 获取每日游戏
  getDaily() {
    const today = new Date();
    const dateStr = today.toDateString();

    // 使用日期生成种子
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
      seed = seed & seed;
    }

    const games = this.getAll();
    const index = Math.abs(seed) % games.length;
    return games[index];
  },

  // 检查徽章解锁
  checkBadgeUnlock(gameId) {
    const game = this.get(gameId);
    if (!game || !game.badge) return null;

    const count = Store.getGameCount(gameId);
    if (count >= game.badgeThreshold && !Store.hasBadge(game.badge)) {
      Store.addBadge(game.badge);
      return game.badge;
    }
    return null;
  }
};

// 游戏元数据
const GAME_METADATA = [
  {
    id: 'shop-game',
    title: '猜猜这家店开了几年',
    icon: '🏪',
    description: '路过小店时，和老板聊聊店里的故事',
    badge: 'shop-detective',
    badgeName: '小店侦探',
    badgeThreshold: 3,
    color: '#FF8B66'
  },
  {
    id: 'plant-game',
    title: '认认路边的植物',
    icon: '🌿',
    description: '一起看看梧桐叶、樟树叶长什么样',
    badge: 'plant-lover',
    badgeName: '植物学家',
    badgeThreshold: 3,
    color: '#7AC5A7'
  },
  {
    id: 'sound-game',
    title: '声音小游戏',
    icon: '🎵',
    description: '闭上眼睛听 30 秒，听听路上有什么声音',
    badge: 'sound-hunter',
    badgeName: '声音猎人',
    badgeThreshold: 3,
    color: '#FFD97D'
  },
  {
    id: 'color-game',
    title: '色彩寻宝',
    icon: '🎨',
    description: '边走边找红色、黄色、绿色',
    badge: 'color-explorer',
    badgeName: '色彩探险家',
    badgeThreshold: 3,
    color: '#FF6B9D'
  },
  {
    id: 'people-game',
    title: '看看身边的人',
    icon: '👋',
    description: '和快递员、环卫工人聊聊天',
    badge: 'people-person',
    badgeName: '社交达人',
    badgeThreshold: 3,
    color: '#7D8FFF'
  }
];

// 注册所有游戏
GAME_METADATA.forEach(game => Games.register(game));

// 导出
window.Games = Games;
window.GAME_METADATA = GAME_METADATA;
