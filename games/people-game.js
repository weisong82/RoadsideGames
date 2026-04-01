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
