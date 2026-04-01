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
