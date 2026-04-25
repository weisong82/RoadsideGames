// 路由处理
const routes = {
  '/': () => renderHome(),
  '/badges': () => renderBadges(),
  '/about': () => renderAbout(),
  '/game/:id': (id) => renderGame(id)
};

function router() {
  const hash = window.location.hash.slice(1) || '/';
  const mainContent = document.getElementById('main-content');

  // 更新导航状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${hash}`) {
      item.classList.add('active');
    }
  });

  // 路由匹配
  if (hash.startsWith('/game/')) {
    const gameId = hash.split('/')[2];
    routes['/game/:id'](gameId);
  } else if (routes[hash]) {
    routes[hash]();
  } else {
    renderNotFound();
  }
}

// 监听路由变化
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// 导出供测试使用
window.adjustColor = adjustColor;
window.router = router;

// 辅助函数：调整颜色亮度
function adjustColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}

// 全局函数：开始游戏
function startGame(gameId) {
  window.location.hash = `#/game/${gameId}`;
}

// 首页渲染
function renderHome() {
  const mainContent = document.getElementById('main-content');
  const dailyGame = Games.getDaily();
  const allGames = Games.getAll();

  // 连续打卡横幅
  const streak = Store.state.streak;
  const lastPlayDate = Store.state.lastPlayDate;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = yesterday.toDateString();

  let streakBanner = '';
  if (streak > 1 && lastPlayDate === today) {
    // 今天已经玩了，显示当前连续天数
    streakBanner = `
      <div class="streak-banner">
        <span class="streak-icon">🔥</span>
        <span>连续打卡 <strong>${streak}</strong> 天！继续保持！</span>
      </div>`;
  } else if (streak > 0 && lastPlayDate === yesterdayStr) {
    // 昨天玩了，今天还没玩，提醒不要断打卡
    streakBanner = `
      <div class="streak-banner streak-warning">
        <span class="streak-icon">⏰</span>
        <span>连续打卡 <strong>${streak}</strong> 天！今天还没玩，快来保住连击！</span>
      </div>`;
  }

  mainContent.innerHTML = `
    <div class="home-page">
      ${streakBanner}
      <!-- 每日挑战卡片 -->
      <div class="daily-card" style="background: linear-gradient(135deg, ${dailyGame.color}, ${adjustColor(dailyGame.color, -20)})">
        <div class="daily-badge">🌟 今日推荐</div>
        <h2>${dailyGame.icon} ${dailyGame.title}</h2>
        <p>${dailyGame.description}</p>
        <button class="btn btn-white" onclick="startGame('${dailyGame.id}')">开始玩</button>
      </div>

      <!-- 其他游戏列表 -->
      <div class="games-section">
        <h3 class="section-title">其他游戏</h3>
        <div class="games-grid">
          ${allGames.filter(g => g.id !== dailyGame.id).map(game => `
            <div class="game-card" onclick="startGame('${game.id}')" style="border-left-color: ${game.color}">
              <div class="game-card-icon">${game.icon}</div>
              <div class="game-card-info">
                <h4>${game.title}</h4>
                <p>${game.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 徽章页面渲染
function renderBadges() {
  const mainContent = document.getElementById('main-content');
  const userBadges = Store.getAllBadges();

  // 所有可能的徽章
  const allBadges = [
    { id: 'shop-detective', name: '小店侦探', icon: '🏪' },
    { id: 'plant-lover', name: '植物学家', icon: '🌿' },
    { id: 'sound-hunter', name: '声音猎人', icon: '🎵' },
    { id: 'color-explorer', name: '色彩探险家', icon: '🎨' },
    { id: 'people-person', name: '社交达人', icon: '👋' },
    { id: 'daily-champion', name: '每日冠军', icon: '🏆' },
    { id: 'master-observer', name: '观察大师', icon: '⭐' }
  ];

  const collected = allBadges.filter(b => userBadges.includes(b.id)).length;

  mainContent.innerHTML = `
    <div class="badges-page">
      <div class="badges-header">
        <h2>🏅 我的徽章</h2>
        <p>已收集 ${collected}/${allBadges.length}</p>
      </div>

      <div class="badges-grid">
        ${allBadges.map(badge =>
          BadgeCard({
            badgeId: badge.id,
            unlocked: userBadges.includes(badge.id),
            badgeName: badge.name,
            icon: badge.icon
          })
        ).join('')}
      </div>
    </div>
  `;
}

// 关于页面渲染
function renderAbout() {
  const mainContent = document.getElementById('main-content');

  mainContent.innerHTML = `
    <div class="about-page">
      <div class="about-header">
        <h1>🌟 路上小游戏</h1>
        <p>发现路上的美好</p>
      </div>

      <div class="about-content">
        <section class="about-section">
          <h3>关于这个游戏</h3>
          <p>这是一套专门为亲子互动设计的小游戏，希望能帮助你和孩子在路上的时光变得更有趣。</p>
        </section>

        <section class="about-section">
          <h3>怎么玩</h3>
          <ul class="about-list">
            <li>每天打开应用，看看"今日推荐"</li>
            <li>或者从列表中选择任意一个游戏</li>
            <li>按照引导和孩子一起完成任务</li>
            <li>收集徽章，记录你们的探索足迹</li>
          </ul>
        </section>

        <section class="about-section">
          <h3>温馨提示</h3>
          <ul class="about-list">
            <li>游戏过程中请注意交通安全</li>
            <li>鼓励孩子多观察、多提问</li>
            <li>不需要追求"正确答案"，过程最重要</li>
            <li>放下手机，用心感受周围的美好</li>
          </ul>
        </section>
      </div>

      <div class="about-footer">
        <p>Made with ❤️ for curious families</p>
      </div>
    </div>
  `;
}

// 404 页面渲染
function renderNotFound() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <div class="error-page">
      <div class="error-icon">🗺️</div>
      <h2>页面不见了</h2>
      <p>找不到你要去的地方</p>
      <button class="btn btn-primary" onclick="window.location.hash='#/'">回到首页</button>
    </div>
  `;
}

// 游戏页面渲染
function renderGame(gameId) {
  const game = Games.get(gameId);
  if (!game) {
    document.getElementById('main-content').innerHTML = `
      <div class="error-page">
        <h2>游戏未找到</h2>
        <button class="btn btn-primary" onclick="window.location.hash='#/'">返回首页</button>
      </div>
    `;
    return;
  }

  // 启动游戏引擎
  GameEngine.start(gameId, {
    onComplete: ({ gameId, unlockedBadge }) => {
      console.log('Game completed:', gameId, unlockedBadge);
    }
  });
}
