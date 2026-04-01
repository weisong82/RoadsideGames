# 路上小游戏 - 产品设计文档

**版本：** 1.0  
**日期：** 2026-04-01  
**类型：** 亲子互动移动端网页

---

## 1. 产品概述

### 1.1 产品愿景
帮助家长和孩子在路上的时光变得更有趣，通过简单的小游戏让孩子放下手机、感受周围，同时让大人也被治愈，重新发现生活中的美好。

### 1.2 目标用户
- **主要用户：** 5-12 岁儿童及其家长
- **使用场景：** 放学路上、出门办事、小区散步、逛菜市场等日常出行

### 1.3 核心价值
- 放下手机，眼睛没那么紧绷
- 边走边聊，心情变好
- 看见身边的烟火气
- 观察力变好，发现小美好
- 攒下温暖的亲子回忆

---

## 2. 产品架构

### 2.1 技术架构

```
┌─────────────────────────────────────┐
│         纯静态网页 (HTML/CSS/JS)      │
├─────────────────────────────────────┤
│  部署：GitHub Pages / Vercel        │
│  数据存储：localStorage             │
│  零后端，零成本，免维护              │
└─────────────────────────────────────┘
```

### 2.2 页面结构

```
/ (首页)
├── 今日游戏 (每日挑战)
├── 游戏列表
│   ├── 猜猜这家店开了几年
│   ├── 认认路边的植物
│   ├── 声音小游戏
│   ├── 色彩寻宝
│   └── 看看身边的人
├── 我的徽章
└── 关于
```

### 2.3 目录结构

```
microgames/
├── index.html          # 首页
├── css/
│   ├── main.css        # 主样式
│   └── components.css  # 组件样式
├── js/
│   ├── app.js          # 应用入口
│   ├── router.js       # 路由
│   ├── store.js        # 状态管理 (localStorage)
│   ├── daily.js        # 每日挑战逻辑
│   └── badges.js       # 徽章系统
├── games/
│   ├── shop-game.js    # 猜猜店铺
│   ├── plant-game.js   # 植物认知
│   ├── sound-game.js   # 声音小游戏
│   ├── color-game.js   # 色彩寻宝
│   └── people-game.js  # 看看身边的人
├── components/
│   ├── game-card.js    # 游戏卡片
│   ├── badge.js        # 徽章展示
│   └── guide-modal.js  # 引导弹窗
├── assets/
│   ├── icons/          # 图标
│   ├── badges/         # 徽章图片
│   └── illustrations/  # 插图
└── docs/
    └── superpowers/specs/
        └── 2026-04-01-road-games-design.md
```

---

## 3. 核心功能设计

### 3.1 游戏框架

每个游戏包含以下结构：

```javascript
{
  id: "shop-game",
  title: "猜猜这家店开了几年",
  icon: "🏪",
  description: "路过小店时，和老板聊聊店里的故事",
  steps: [
    { type: "intro", text: "路过一家小店时，我们来看看..." },
    { type: "observation", text: "看看招牌，猜猜这家店开了多少年？", timer: null },
    { type: "input", text: "你觉得开了几年？", inputType: "number" },
    { type: "challenge", text: "要不要进去和老板聊两句？问问店里最老的东西是什么" },
    { type: "complete", text: "太棒了！你又发现了一个小店故事！" }
  ],
  badge: "shop-detective"
}
```

### 3.2 游戏引导流程

```
开始游戏
    ↓
展示游戏介绍卡片
    ↓
用户点击"开始"
    ↓
逐步展示引导步骤
    ↓
每步可选择"完成"或"跳过"
    ↓
最后一步完成
    ↓
展示成就获得弹窗
    ↓
返回首页
```

### 3.3 每日挑战系统

**逻辑：**
- 使用日期种子 (date seed) 生成当日推荐游戏
- 确保同一天所有用户看到的是同一个推荐
- 5 个游戏循环推荐

```javascript
function getDailyGame() {
  const today = new Date().toDateString();
  const seed = hashCode(today);
  const gameIndex = seed % GAMES.length;
  return GAMES[gameIndex];
}
```

### 3.4 徽章系统

**徽章列表（首发）：**

| 徽章 ID | 名称 | 获得条件 | 图标 |
|--------|------|---------|------|
| shop-detective | 小店侦探 | 完成 3 次店铺游戏 | 🏪 |
| plant-lover | 植物学家 | 完成 3 次植物游戏 | 🌿 |
| sound-hunter | 声音猎人 | 完成 3 次声音游戏 | 🎵 |
| color-explorer | 色彩探险家 | 完成 3 次色彩游戏 | 🎨 |
| people-person | 社交达人 | 完成 3 次人物游戏 | 👋 |
| daily-champion | 每日冠军 | 连续 7 天玩每日挑战 | 🏆 |
| master-observer | 观察大师 | 完成所有游戏各 5 次 | ⭐ |

**数据存储：**
```javascript
{
  badges: ["shop-detective"],
  gameStats: {
    "shop-game": 3,
    "plant-game": 1
  },
  streak: 5,
  lastPlayDate: "2026-04-01"
}
```

---

## 4. UI/UX 设计

### 4.1 设计风格
- **色调：** 温暖、明亮、活泼
- **字体：** 圆润可爱，适合儿童阅读
- **布局：** 大按钮、大文字、简单导航
- **动效：** 轻柔、友好，给孩子正反馈

### 4.2 核心页面线框

**首页：**
```
┌────────────────────────┐
│   🌟 路上小游戏 🌟      │
├────────────────────────┤
│                        │
│   ┌────────────────┐   │
│   │  🎮 今日游戏    │   │
│   │  猜猜这家店     │   │
│   │  开了几年       │   │
│   │   [开始玩]     │   │
│   └────────────────┘   │
│                        │
│   其他游戏：           │
│   ┌──┐ ┌──┐ ┌──┐      │
│   │🌿│ │🎵│ │🎨│      │
│   │植│ │声│ │色│      │
│   │物│ │音│ │彩│      │
│   └──┘ └──┘ └──┘      │
│                        │
│  [我的徽章]  [关于]    │
└────────────────────────┘
```

**游戏进行中：**
```
┌────────────────────────┐
│ ← 猜猜这家店开了几年    │
├────────────────────────┤
│                        │
│        🏪              │
│                        │
│  看看招牌，猜猜这家店   │
│  开了多少年？           │
│                        │
│  [1 年] [3 年] [5 年+]   │
│                        │
│  [跳过]    [完成 ✓]    │
└────────────────────────┘
```

**徽章收集页：**
```
┌────────────────────────┐
│   🏅 我的徽章          │
├────────────────────────┤
│  已收集 3/7             │
│                        │
│  🏪 ✅ 小店侦探         │
│  🌿 ✅ 植物学家         │
│  🎵 ✅ 声音猎人         │
│  🎨 🔒 色彩探险家       │
│  👋 🔒 社交达人         │
│  🏆 🔒 每日冠军         │
│  ⭐ 🔒 观察大师         │
│                        │
└────────────────────────┘
```

---

## 5. 数据流设计

### 5.1 状态管理

```javascript
// store.js
const Store = {
  state: {
    badges: [],
    gameStats: {},
    streak: 0,
    lastPlayDate: null
  },

  load() {
    const saved = localStorage.getItem('roadGames');
    if (saved) this.state = JSON.parse(saved);
  },

  save() {
    localStorage.setItem('roadGames', JSON.stringify(this.state));
  },

  addBadge(badgeId) {
    if (!this.state.badges.includes(badgeId)) {
      this.state.badges.push(badgeId);
      this.save();
      return true; // 新解锁
    }
    return false; // 已获得
  },

  incrementGame(gameId) {
    this.state.gameStats[gameId] = (this.state.gameStats[gameId] || 0) + 1;
    this.save();
  }
};
```

### 5.2 徽章解锁检查

```javascript
function checkBadgeUnlock(gameId) {
  const stats = Store.state.gameStats;
  const newBadges = [];

  // 检查单项徽章
  const badgeMap = {
    'shop-game': { threshold: 3, badge: 'shop-detective' },
    'plant-game': { threshold: 3, badge: 'plant-lover' },
    'sound-game': { threshold: 3, badge: 'sound-hunter' },
    'color-game': { threshold: 3, badge: 'color-explorer' },
    'people-game': { threshold: 3, badge: 'people-person' }
  };

  if (badgeMap[gameId] && stats[gameId] >= badgeMap[gameId].threshold) {
    if (Store.addBadge(badgeMap[gameId].badge)) {
      newBadges.push(badgeMap[gameId].badge);
    }
  }

  return newBadges;
}
```

---

## 6. 技术实现细节

### 6.1 路由方案
使用简单的 Hash 路由：
```javascript
const routes = {
  '/': HomePage,
  '/game/:id': GamePage,
  '/badges': BadgePage,
  '/about': AboutPage
};

function router() {
  const hash = window.location.hash.slice(1) || '/';
  const route = routes[hash] || routes['/'];
  route.render();
}
```

### 6.2 响应式设计
```css
/* 移动端优先 */
.container {
  width: 100%;
  max-width: 480px; /* 手机宽度上限 */
  margin: 0 auto;
  padding: 16px;
}

/* 按钮至少 44px 高度，符合触控规范 */
.btn {
  min-height: 44px;
  min-width: 44px;
}
```

### 6.3 性能优化
- 首屏 CSS 内联
- 图片使用 SVG/WebP
- 懒加载非首屏资源
- localStorage 数据限制在 5MB 内

---

## 7. 成功指标

### 7.1 产品指标
- 日活跃用户数 (DAU)
- 平均游戏完成率
- 7 日留存率
- 徽章收集进度

### 7.2 体验指标
- 用户停留时长（不是越长越好，而是适中）
- 每日挑战参与率
- 分享次数

---

## 8. 未来迭代方向

### Phase 2 (可选)
- PWA 支持，离线可用
- 家庭共享，多个孩子进度同步
- 季节性限定游戏（春天找新芽、秋天找落叶）
- 生成分享图功能

### Phase 3 (可选)
- 后端支持，云端保存
- 用户生成内容，分享自己设计的游戏
- 社区功能，看看其他家庭在路上发现了什么

---

## 9. 风险与注意事项

1. **屏幕时间平衡** - 游戏设计要引导孩子少看屏幕、多看现实
2. **隐私保护** - 不收集任何个人信息，所有数据存本地
3. **内容安全** - 引导孩子与陌生人互动时要注意安全措辞
4. **可访问性** - 考虑色弱儿童（色彩游戏不能用唯一标识）

---

## 10. 附录

### 10.1 游戏文案风格
- 温暖、鼓励、不评判
- 用"我们"而不是"你"
- 允许跳过，没有压力

### 10.2 音效设计（可选）
- 开始游戏：轻快的提示音
- 完成步骤：柔和的"叮"声
- 获得徽章：欢快的短旋律
