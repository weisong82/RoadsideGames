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
