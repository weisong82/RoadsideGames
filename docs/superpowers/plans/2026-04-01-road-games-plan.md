# "路上小游戏" 移动端网页实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个纯静态的亲子互动游戏网页，包含 5 个首发游戏、徽章系统和每日挑战功能

**Architecture:** 
- 纯静态 HTML/CSS/JS，无构建工具
- Hash 路由实现页面切换
- localStorage 存储用户进度和徽章数据
- 模块化设计：每个游戏独立文件，共享游戏引擎框架

**Tech Stack:** Vanilla HTML5, CSS3, ES6 JavaScript

---

## 文件结构总览

```
microgames/
├── index.html              # 主页面
├── css/
│   └── main.css           # 全部样式
├── js/
│   ├── app.js             # 应用入口、路由
│   ├── store.js           # localStorage 状态管理
│   ├── games.js           # 游戏注册表、每日挑战逻辑
│   ├── badges.js          # 徽章系统
│   └── game-engine.js     # 游戏引擎、引导流程
├── games/
│   ├── shop-game.js       # 猜猜这家店开了几年
│   ├── plant-game.js      # 认认路边的植物
│   ├── sound-game.js      # 声音小游戏
│   ├── color-game.js      # 色彩寻宝
│   └── people-game.js     # 看看身边的人
├── components/
│   ├── game-card.js       # 游戏卡片组件
│   ├── badge-card.js      # 徽章卡片组件
│   └── guide-modal.js     # 引导弹窗组件
└── assets/
    ├── icons/             # SVG 图标
    └── badges/            # 徽章 SVG 图片
```

---

## Phase 1: 项目基础框架

### Task 1: 创建 HTML 主页面

**Files:**
- Create: `index.html`

- [ ] **Step 1: 创建 index.html 基础结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="路上小游戏 - 和孩子一起发现路上的美好">
  <title>路上小游戏</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <div id="app">
    <header class="header">
      <h1 class="logo">🌟 路上小游戏</h1>
    </header>
    <main id="main-content"></main>
    <nav class="bottom-nav">
      <a href="#/" class="nav-item active">首页</a>
      <a href="#/badges" class="nav-item">我的徽章</a>
      <a href="#/about" class="nav-item">关于</a>
    </nav>
  </div>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 验证 HTML 结构正确**

在浏览器中打开 `index.html`，确认能看到标题和导航栏。

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: 创建 HTML 主页面结构"
```

---

### Task 2: 创建基础 CSS 样式

**Files:**
- Create: `css/main.css`

- [ ] **Step 1: 创建 CSS Reset 和基础样式**

```css
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --color-primary: #FF8B66;
  --color-secondary: #7AC5A7;
  --color-accent: #FFD97D;
  --color-text: #2C3E50;
  --color-text-light: #7F8C8D;
  --color-bg: #FFF9F5;
  --color-white: #FFFFFF;
  --color-border: #E8E8E8;
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 布局 */
#app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Header */
.header {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
}

/* Main content */
#main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-white);
  position: sticky;
  bottom: 0;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-item.active {
  color: var(--color-primary);
  font-weight: 600;
}

/* 通用按钮样式 */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
  min-height: 44px;
  min-width: 44px;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), #FF6B4A);
  color: var(--color-white);
  box-shadow: 0 4px 12px rgba(255, 139, 102, 0.4);
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-white);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/main.css
git commit -m "feat: 创建基础样式系统"
```

---

### Task 3: 创建路由系统

**Files:**
- Create: `js/app.js`

- [ ] **Step 1: 创建简单的 Hash 路由**

```javascript
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
    routes['/']();
  }
}

// 监听路由变化
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// 占位渲染函数（后续任务实现）
function renderHome() {
  document.getElementById('main-content').innerHTML = '<div>首页 - 开发中</div>';
}

function renderBadges() {
  document.getElementById('main-content').innerHTML = '<div>我的徽章 - 开发中</div>';
}

function renderAbout() {
  document.getElementById('main-content').innerHTML = '<div>关于 - 开发中</div>';
}

function renderGame(id) {
  document.getElementById('main-content').innerHTML = `<div>游戏 ${id} - 开发中</div>`;
}
```

- [ ] **Step 2: 测试路由**

打开浏览器，依次访问：
- `#/` 应该显示"首页"
- `#/badges` 应该显示"我的徽章"
- `#/about` 应该显示"关于"
- `#/game/shop-game` 应该显示"游戏 shop-game"

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: 实现 Hash 路由系统"
```

---

## Phase 2: 状态管理与数据层

### Task 4: 创建 Store 状态管理

**Files:**
- Create: `js/store.js`

- [ ] **Step 1: 创建 localStorage 状态管理**

```javascript
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
```

- [ ] **Step 2: 测试 Store**

在浏览器控制台执行：
```javascript
Store.incrementGame('test-game');
Store.addBadge('test-badge');
console.log(Store.state);
```

- [ ] **Step 3: Commit**

```bash
git add js/store.js
git commit -m "feat: 实现 localStorage 状态管理"
```

---

### Task 5: 创建游戏注册表和每日挑战

**Files:**
- Create: `js/games.js`

- [ ] **Step 1: 创建游戏定义和注册表**

```javascript
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

// 游戏元数据（具体游戏实现在 games/ 目录）
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
```

- [ ] **Step 2: 测试游戏注册表**

在浏览器控制台：
```javascript
console.log(Games.getAll());
console.log(Games.getDaily());
```

- [ ] **Step 3: Commit**

```bash
git add js/games.js
git commit -m "feat: 实现游戏注册表和每日挑战逻辑"
```

---

## Phase 3: 游戏引擎框架

### Task 6: 创建游戏引擎

**Files:**
- Create: `js/game-engine.js`

- [ ] **Step 1: 创建游戏引导流程引擎**

```javascript
const GameEngine = {
  currentGame: null,
  currentStepIndex: 0,
  onComplete: null,

  // 开始游戏
  start(gameId, callbacks = {}) {
    const game = Games.get(gameId);
    if (!game) {
      console.error('Game not found:', gameId);
      return;
    }

    this.currentGame = game;
    this.currentStepIndex = 0;
    this.onComplete = callbacks.onComplete || (() => {});

    // 记录游戏开始
    Store.incrementGame(gameId);

    // 渲染游戏界面
    this.renderStep();
  },

  // 渲染当前步骤
  renderStep() {
    const game = this.currentGame;
    const stepIndex = this.currentStepIndex;
    const steps = game.steps || [];

    if (stepIndex >= steps.length) {
      // 游戏完成
      this.complete();
      return;
    }

    const step = steps[stepIndex];
    const mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
      <div class="game-container">
        <div class="game-header">
          <button class="back-btn" onclick="window.history.back()">←</button>
          <h2>${game.icon} ${game.title}</h2>
          <div class="step-progress">${stepIndex + 1}/${steps.length}</div>
        </div>
        
        <div class="step-content">
          ${this.renderStepContent(step)}
        </div>

        <div class="step-actions">
          ${this.renderStepActions(step)}
        </div>
      </div>
    `;
  },

  // 渲染步骤内容
  renderStepContent(step) {
    switch (step.type) {
      case 'intro':
        return `
          <div class="step-intro">
            <div class="step-icon">${this.currentGame.icon}</div>
            <p class="step-text">${step.text}</p>
          </div>
        `;

      case 'observation':
        return `
          <div class="step-observation">
            <div class="step-icon">👀</div>
            <p class="step-text">${step.text}</p>
            ${step.timer ? `<div class="timer" data-seconds="${step.timer}">${step.timer}秒</div>` : ''}
          </div>
        `;

      case 'input':
        return `
          <div class="step-input">
            <p class="step-text">${step.text}</p>
            ${step.inputType === 'number' 
              ? `<input type="number" class="input-field" placeholder="输入你的答案">`
              : `<input type="text" class="input-field" placeholder="输入你的答案">`
            }
          </div>
        `;

      case 'challenge':
        return `
          <div class="step-challenge">
            <div class="step-icon">🎯</div>
            <p class="step-text">${step.text}</p>
            <p class="step-hint">完成后点击"我做到了"</p>
          </div>
        `;

      case 'complete':
        return `
          <div class="step-complete">
            <div class="step-icon">🎉</div>
            <p class="step-text">${step.text}</p>
          </div>
        `;

      default:
        return `
          <div class="step-default">
            <p class="step-text">${step.text}</p>
          </div>
        `;
    }
  },

  // 渲染步骤操作按钮
  renderStepActions(step) {
    const isLastStep = this.currentStepIndex >= (this.currentGame.steps?.length - 1);
    
    if (isLastStep) {
      return `
        <button class="btn btn-primary complete-btn" onclick="GameEngine.next()">
          完成！
        </button>
      `;
    }

    return `
      <button class="btn btn-outline" onclick="GameEngine.skip()">跳过</button>
      <button class="btn btn-primary" onclick="GameEngine.next()">下一步</button>
    `;
  },

  // 下一步
  next() {
    this.currentStepIndex++;
    this.renderStep();
  },

  // 跳过
  skip() {
    if (confirm('确定要跳过这步吗？')) {
      this.currentStepIndex++;
      this.renderStep();
    }
  },

  // 游戏完成
  complete() {
    const gameId = this.currentGame.id;
    const unlockedBadge = Games.checkBadgeUnlock(gameId);

    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="game-complete">
        <div class="complete-icon">🏆</div>
        <h2>太棒了！</h2>
        <p>你又完成了一次探索！</p>
        ${unlockedBadge ? `
          <div class="badge-unlocked">
            <div class="new-badge">🎖️</div>
            <p>解锁新徽章：${this.getBadgeName(unlockedBadge)}</p>
          </div>
        ` : ''}
        <button class="btn btn-primary" onclick="window.location.hash='#/'">返回首页</button>
      </div>
    `;

    // 回调
    if (this.onComplete) {
      this.onComplete({ gameId, unlockedBadge });
    }

    this.currentGame = null;
  },

  // 获取徽章名称
  getBadgeName(badgeId) {
    const metadata = GAME_METADATA.find(g => g.badge === badgeId);
    return metadata ? metadata.badgeName : badgeId;
  }
};

// 导出
window.GameEngine = GameEngine;
```

- [ ] **Step 2: 添加游戏界面样式到 CSS**

**Modify:** `css/main.css` - 追加以下内容

```css
/* Game Container */
.game-container {
  padding: 16px 0;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.game-header h2 {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: var(--color-text);
}

.step-progress {
  font-size: 14px;
  color: var(--color-text-light);
}

/* Step Content */
.step-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
}

.step-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.step-text {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: 16px;
}

.step-hint {
  font-size: 14px;
  color: var(--color-text-light);
}

/* Timer */
.timer {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  margin-top: 16px;
}

/* Input Field */
.input-field {
  width: 100%;
  max-width: 200px;
  padding: 12px 16px;
  font-size: 18px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Step Actions */
.step-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 24px 16px;
}

/* Game Complete */
.game-complete {
  text-align: center;
  padding: 48px 16px;
}

.complete-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.game-complete h2 {
  font-size: 24px;
  margin-bottom: 8px;
}

.badge-unlocked {
  background: linear-gradient(135deg, var(--color-accent), #FFE5A3);
  padding: 24px;
  border-radius: var(--radius-lg);
  margin: 24px 0;
}

.new-badge {
  font-size: 64px;
}
```

- [ ] **Step 3: Commit**

```bash
git add js/game-engine.js css/main.css
git commit -m "feat: 实现游戏引擎框架"
```

---

## Phase 4: 实现 5 个首发游戏

### Task 7: 实现"猜猜这家店开了几年"游戏

**Files:**
- Create: `games/shop-game.js`

- [ ] **Step 1: 创建店铺游戏逻辑**

```javascript
// 猜猜这家店开了几年
const shopGame = {
  id: 'shop-game',
  title: '猜猜这家店开了几年',
  icon: '🏪',
  description: '路过小店时，和老板聊聊店里的故事',
  color: '#FF8B66',
  steps: [
    {
      type: 'intro',
      text: '路过一家小店时，我们停下来看一看...'
    },
    {
      type: 'observation',
      text: '看看招牌，观察一下这家店。你觉得它开了多少年？'
    },
    {
      type: 'input',
      inputType: 'number',
      text: '猜猜看，这家店开了几年？'
    },
    {
      type: 'observation',
      text: '看看店里有什么东西看起来很老？可能是开业时就有的哦'
    },
    {
      type: 'challenge',
      text: '要不要进去和老板聊两句？可以问："老板，您这家店开了很久了吧？"'
    },
    {
      type: 'complete',
      text: '太棒了！你又发现了一个小店故事！每一家小店都有自己的回忆呢'
    }
  ],
  badge: 'shop-detective',
  badgeName: '小店侦探',
  badgeThreshold: 3
};

// 注册游戏
Games.register(shopGame);
```

- [ ] **Step 2: 在 index.html 中引入游戏文件**

**Modify:** `index.html` - 在 `</body>` 前添加
```html
<script src="games/shop-game.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add games/shop-game.js index.html
git commit -m "feat: 实现猜猜这家店开了几年游戏"
```

---

### Task 8: 实现"认认路边的植物"游戏

**Files:**
- Create: `games/plant-game.js`

- [ ] **Step 1: 创建植物游戏逻辑**

```javascript
// 认认路边的植物
const plantGame = {
  id: 'plant-game',
  title: '认认路边的植物',
  icon: '🌿',
  description: '一起看看梧桐叶、樟树叶长什么样',
  color: '#7AC5A7',
  steps: [
    {
      type: 'intro',
      text: '我们来找找路边的植物朋友吧！'
    },
    {
      type: 'observation',
      text: '看看周围有什么树？它们的叶子长什么样？'
    },
    {
      type: 'challenge',
      text: '找一片你最喜欢的叶子，仔细观察它的形状、颜色'
    },
    {
      type: 'input',
      inputType: 'text',
      text: '这片叶子是什么形状的？像什么？'
    },
    {
      type: 'observation',
      text: '看看树上有没有新芽或者花苞？四季在悄悄变化呢'
    },
    {
      type: 'complete',
      text: '你真棒！又认识了一种植物朋友！'
    }
  ],
  badge: 'plant-lover',
  badgeName: '植物学家',
  badgeThreshold: 3
};

// 注册游戏
Games.register(plantGame);
```

- [ ] **Step 2: 在 index.html 中引入**

**Modify:** `index.html` - 添加
```html
<script src="games/plant-game.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add games/plant-game.js index.html
git commit -m "feat: 实现认认路边的植物游戏"
```

---

### Task 9: 实现"声音小游戏"游戏

**Files:**
- Create: `games/sound-game.js`

- [ ] **Step 1: 创建声音游戏逻辑**

```javascript
// 声音小游戏
const soundGame = {
  id: 'sound-game',
  title: '声音小游戏',
  icon: '🎵',
  description: '闭上眼睛听 30 秒，听听路上有什么声音',
  color: '#FFD97D',
  steps: [
    {
      type: 'intro',
      text: '我们来玩一个听声音的游戏！'
    },
    {
      type: 'observation',
      text: '找一个安全的地方，闭上眼睛...',
      timer: 30
    },
    {
      type: 'input',
      inputType: 'text',
      text: '你听到了什么声音？（可以说出或输入）'
    },
    {
      type: 'observation',
      text: '再仔细听听，还有没有更小的声音？鸟叫？风声？'
    },
    {
      type: 'challenge',
      text: '数一数，你一共听到了几种不同的声音？'
    },
    {
      type: 'input',
      inputType: 'number',
      text: '你听到了几种声音？'
    },
    {
      type: 'complete',
      text: '哇！你的小耳朵真灵敏！世界上有好多美妙的声音等着我们去听呢'
    }
  ],
  badge: 'sound-hunter',
  badgeName: '声音猎人',
  badgeThreshold: 3
};

// 注册游戏
Games.register(soundGame);
```

- [ ] **Step 2: 在 index.html 中引入**

**Modify:** `index.html` - 添加
```html
<script src="games/sound-game.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add games/sound-game.js index.html
git commit -m "feat: 实现声音小游戏"
```

---

### Task 10: 实现"色彩寻宝"游戏

**Files:**
- Create: `games/color-game.js`

- [ ] **Step 1: 创建色彩游戏逻辑**

```javascript
// 色彩寻宝
const colorGame = {
  id: 'color-game',
  title: '色彩寻宝',
  icon: '🎨',
  description: '边走边找红色、黄色、绿色',
  color: '#FF6B9D',
  steps: [
    {
      type: 'intro',
      text: '我们来玩色彩寻宝游戏！'
    },
    {
      type: 'observation',
      text: '今天我们要找这三种颜色：🔴 红色、🟡 黄色、🟢 绿色'
    },
    {
      type: 'challenge',
      text: '先来找红色的东西！招牌、路灯、衣服都可以哦'
    },
    {
      type: 'input',
      inputType: 'text',
      text: '你找到了什么红色的东西？'
    },
    {
      type: 'challenge',
      text: '太棒了！现在来找黄色的东西！'
    },
    {
      type: 'input',
      inputType: 'text',
      text: '你找到了什么黄色的东西？'
    },
    {
      type: 'challenge',
      text: '最后来找绿色的东西！'
    },
    {
      type: 'input',
      inputType: 'text',
      text: '你找到了什么绿色的东西？'
    },
    {
      type: 'complete',
      text: '你真是色彩小达人！世界是不是变得 colorful 了？'
    }
  ],
  badge: 'color-explorer',
  badgeName: '色彩探险家',
  badgeThreshold: 3
};

// 注册游戏
Games.register(colorGame);
```

- [ ] **Step 2: 在 index.html 中引入**

**Modify:** `index.html` - 添加
```html
<script src="games/color-game.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add games/color-game.js index.html
git commit -m "feat: 实现色彩寻宝游戏"
```

---

### Task 11: 实现"看看身边的人"游戏

**Files:**
- Create: `games/people-game.js`

- [ ] **Step 1: 创建人物游戏逻辑**

```javascript
// 看看身边的人
const peopleGame = {
  id: 'people-game',
  title: '看看身边的人',
  icon: '👋',
  description: '和快递员、环卫工人聊聊天',
  color: '#7D8FFF',
  steps: [
    {
      type: 'intro',
      text: '我们来认识一下身边那些可爱的人！'
    },
    {
      type: 'observation',
      text: '看看周围，有没有快递员叔叔、环卫工人、保安叔叔或者小店老板？'
    },
    {
      type: 'observation',
      text: '他们在做什么工作呢？仔细观察一下'
    },
    {
      type: 'challenge',
      text: '如果有机会，跟他们打个招呼吧！说声"您好"或者"辛苦了"'
    },
    {
      type: 'input',
      inputType: 'text',
      text: '你跟谁打招呼了？或者你想跟谁打招呼？'
    },
    {
      type: 'observation',
      text: '每一份工作都很重要，都在让我们的城市变得更美好'
    },
    {
      type: 'complete',
      text: '你真棒！懂得尊重和感谢每一个人，这是很珍贵的品质哦！'
    }
  ],
  badge: 'people-person',
  badgeName: '社交达人',
  badgeThreshold: 3
};

// 注册游戏
Games.register(peopleGame);
```

- [ ] **Step 2: 在 index.html 中引入**

**Modify:** `index.html` - 添加
```html
<script src="games/people-game.js"></script>
```

- [ ] **Step 3: Commit**

```bash
git add games/people-game.js index.html
git commit -m "feat: 实现看看身边的人游戏"
```

---

## Phase 5: 首页与 UI 组件

### Task 12: 实现首页渲染

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 实现首页渲染函数**

**Modify:** `js/app.js` - 替换 `renderHome` 函数

```javascript
function renderHome() {
  const mainContent = document.getElementById('main-content');
  const dailyGame = Games.getDaily();

  const allGames = Games.getAll();

  mainContent.innerHTML = `
    <div class="home-page">
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
  // 游戏页面会自动调用 GameEngine.start()
}
```

- [ ] **Step 2: 添加首页样式**

**Modify:** `css/main.css` - 追加

```css
/* Home Page */
.home-page {
  padding-bottom: 24px;
}

/* Daily Card */
.daily-card {
  background: linear-gradient(135deg, var(--color-primary), #FF6B4A);
  border-radius: var(--radius-lg);
  padding: 24px;
  color: var(--color-white);
  margin-bottom: 24px;
  box-shadow: var(--shadow-card);
}

.daily-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  margin-bottom: 12px;
}

.daily-card h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.daily-card p {
  font-size: 14px;
  opacity: 0.95;
  margin-bottom: 16px;
}

.btn-white {
  background: var(--color-white);
  color: var(--color-text);
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
}

/* Games Section */
.games-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-text);
}

.games-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Game Card */
.game-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
  box-shadow: var(--shadow-soft);
}

.game-card:active {
  transform: scale(0.98);
}

.game-card-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.game-card-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--color-text);
}

.game-card-info p {
  font-size: 13px;
  color: var(--color-text-light);
}
```

- [ ] **Step 3: Commit**

```bash
git add js/app.js css/main.css
git commit -m "feat: 实现首页渲染和游戏卡片"
```

---

### Task 13: 实现游戏页面路由

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 实现游戏页面渲染**

**Modify:** `js/app.js` - 替换 `renderGame` 函数

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add js/app.js
git commit -m "feat: 实现游戏页面路由"
```

---

## Phase 6: 徽章页面

### Task 14: 实现徽章页面

**Files:**
- Modify: `js/app.js`
- Create: `components/badge-card.js`

- [ ] **Step 1: 创建徽章卡片组件**

```javascript
// 徽章卡片组件
function BadgeCard({ badgeId, unlocked, badgeName, icon }) {
  return `
    <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="badge-icon">${unlocked ? icon : '🔒'}</div>
      <div class="badge-name">${badgeName}</div>
      ${unlocked ? '<div class="badge-date">已收集</div>' : ''}
    </div>
  `;
}

window.BadgeCard = BadgeCard;
```

- [ ] **Step 2: 实现徽章页面渲染**

**Modify:** `js/app.js` - 替换 `renderBadges` 函数

```javascript
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
```

- [ ] **Step 3: 添加徽章页面样式**

**Modify:** `css/main.css` - 追加

```css
/* Badges Page */
.badges-page {
  padding-bottom: 24px;
}

.badges-header {
  text-align: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, var(--color-accent), #FFE5A3);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
}

.badges-header h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.badges-header p {
  font-size: 14px;
  color: var(--color-text-light);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.badge-card {
  background: var(--color-white);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.badge-card.unlocked {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(255, 217, 125, 0.3);
}

.badge-card.locked {
  opacity: 0.6;
  filter: grayscale(1);
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.badge-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.badge-date {
  font-size: 11px;
  color: var(--color-text-light);
  margin-top: 4px;
}

/* Error Page */
.error-page {
  text-align: center;
  padding: 48px 16px;
}

.error-page h2 {
  margin-bottom: 24px;
}
```

- [ ] **Step 4: Commit**

```bash
git add components/badge-card.js js/app.js css/main.css
git commit -m "feat: 实现徽章收集页面"
```

---

### Task 15: 实现关于页面

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: 实现关于页面渲染**

**Modify:** `js/app.js` - 替换 `renderAbout` 函数

```javascript
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
```

- [ ] **Step 2: 添加关于页面样式**

**Modify:** `css/main.css` - 追加

```css
/* About Page */
.about-page {
  padding-bottom: 24px;
}

.about-header {
  text-align: center;
  padding: 32px 16px;
  background: linear-gradient(135deg, var(--color-secondary), #5FB390);
  border-radius: var(--radius-lg);
  color: var(--color-white);
  margin-bottom: 24px;
}

.about-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.about-header p {
  font-size: 16px;
  opacity: 0.95;
}

.about-content {
  padding: 0 16px;
}

.about-section {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-soft);
}

.about-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-text);
}

.about-section p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-light);
}

.about-list {
  font-size: 14px;
  line-height: 2;
  color: var(--color-text-light);
  padding-left: 20px;
}

.about-footer {
  text-align: center;
  padding: 24px 16px;
  color: var(--color-text-light);
  font-size: 12px;
}
```

- [ ] **Step 3: Commit**

```bash
git add js/app.js css/main.css
git commit -m "feat: 实现关于页面"
```

---

## Phase 7: 增强功能

### Task 16: 添加定时器功能

**Files:**
- Modify: `js/game-engine.js`

- [ ] **Step 1: 为带 timer 的步骤添加倒计时功能**

**Modify:** `js/game-engine.js` - 在 `renderStep` 方法后添加定时器逻辑

```javascript
// 在 renderStep 方法内，如果是 timer 步骤，启动倒计时
startTimer(element, seconds) {
  let remaining = seconds;
  const timerEl = element.querySelector('.timer');
  
  const interval = setInterval(() => {
    remaining--;
    if (timerEl) {
      timerEl.textContent = `${remaining}秒`;
    }
    
    if (remaining <= 0) {
      clearInterval(interval);
      // 时间到，可以播放提示音或提示用户
      if (Store.state.soundEnabled) {
        this.playSound('timer-complete');
      }
    }
  }, 1000);
},

// 简单的音效播放（可选）
playSound(type) {
  // 预留音效功能接口
  console.log('Play sound:', type);
}
```

- [ ] **Step 2: Commit**

```bash
git add js/game-engine.js
git commit -m "feat: 添加步骤定时器功能"
```

---

### Task 17: 添加解锁徽章通知

**Files:**
- Modify: `js/game-engine.js`

- [ ] **Step 1: 优化徽章解锁展示**

**Modify:** `js/game-engine.js` - 优化 `complete` 方法中的徽章展示

```javascript
// 修改 complete 方法中的徽章展示部分
badge-unlocked {
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add css/main.css
git commit -m "feat: 添加徽章解锁动画"
```

---

## 总结

**最终验证清单：**

- [ ] 打开首页能看到"今日游戏"推荐
- [ ] 5 个游戏都能正常进入和游玩
- [ ] 游戏流程能正常走完
- [ ] 完成游戏后能解锁徽章
- [ ] 徽章页面能看到已收集的徽章
- [ ] 关于页面内容正确显示
- [ ] 所有数据保存在 localStorage

**部署建议：**
```bash
# 部署到 GitHub Pages
git push origin main

# 或使用 Vercel
vercel deploy --prod
```
