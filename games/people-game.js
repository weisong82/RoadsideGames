// 看看身边的人 - 20种职业人士
const PEOPLE_PHOTOS = [
  {
    name: '快递员',
    hint: '每天背着大包小包，把快递送到你家门口',
    fallbackIcon: '📦',
    imageUrl: 'images/people/courier.jpg'
  },
  {
    name: '环卫工人',
    hint: '每天早早起来打扫街道，让城市保持干净',
    fallbackIcon: '🧹',
    imageUrl: 'images/people/street-sweeper.jpg'
  },
  {
    name: '保安叔叔',
    hint: '站在门口守卫，保护大家的安全',
    fallbackIcon: '🔒',
    imageUrl: 'images/people/security-guard.jpg'
  },
  {
    name: '厨师',
    hint: '在厨房里做出美味的饭菜，让大家吃饱吃好',
    fallbackIcon: '👨‍🍳',
    imageUrl: 'images/people/chef.jpg'
  },
  {
    name: '警察叔叔',
    hint: '穿着制服维持秩序，保护我们的安全',
    fallbackIcon: '👮',
    imageUrl: 'images/people/police.jpg'
  },
  {
    name: '医生',
    hint: '穿白大褂，帮助生病的人恢复健康',
    fallbackIcon: '👨‍⚕️',
    imageUrl: 'images/people/doctor.jpg'
  },
  {
    name: '护士',
    hint: '在医院里照顾病人，给病人打针发药',
    fallbackIcon: '👩‍⚕️',
    imageUrl: 'images/people/nurse.jpg'
  },
  {
    name: '消防员',
    hint: '穿着厚重的防护服，冲进火场救人',
    fallbackIcon: '🚒',
    imageUrl: 'images/people/firefighter.jpg'
  },
  {
    name: '建筑工人',
    hint: '戴着安全帽在工地上盖楼房、修道路',
    fallbackIcon: '👷',
    imageUrl: 'images/people/construction-worker.jpg'
  },
  {
    name: '公交司机',
    hint: '开着大巴车，每天把乘客送到目的地',
    fallbackIcon: '🚌',
    imageUrl: 'images/people/bus-driver.jpg'
  },
  {
    name: '理发师',
    hint: '拿着剪刀和梳子，给客人设计漂亮的发型',
    fallbackIcon: '✂️',
    imageUrl: 'images/people/barber.jpg'
  },
  {
    name: '面包师',
    hint: '每天早起揉面团，烤出香喷喷的面包',
    fallbackIcon: '🍞',
    imageUrl: 'images/people/baker.jpg'
  },
  {
    name: '邮递员',
    hint: '骑着车把信件和包裹送到每家每户',
    fallbackIcon: '📮',
    imageUrl: 'images/people/postman.jpg'
  },
  {
    name: '园丁',
    hint: '照料花草树木，让公园和街道变得美丽',
    fallbackIcon: '🌱',
    imageUrl: 'images/people/gardener.jpg'
  },
  {
    name: '修车师傅',
    hint: '在修理店里帮助修好坏掉的汽车和摩托车',
    fallbackIcon: '🔧',
    imageUrl: 'images/people/mechanic.jpg'
  },
  {
    name: '餐厅服务员',
    hint: '在餐厅里端菜上桌，热情招待每位顾客',
    fallbackIcon: '🍽️',
    imageUrl: 'images/people/waiter.jpg'
  },
  {
    name: '收银员',
    hint: '在超市或商店收钱找零，帮顾客结账',
    fallbackIcon: '🛒',
    imageUrl: 'images/people/cashier.jpg'
  },
  {
    name: '老师',
    hint: '在学校里教小朋友读书写字学知识',
    fallbackIcon: '📚',
    imageUrl: 'images/people/teacher.jpg'
  },
  {
    name: '修鞋匠',
    hint: '用针线和胶水把坏掉的鞋子修好',
    fallbackIcon: '👟',
    imageUrl: 'images/people/cobbler.jpg'
  },
  {
    name: '小店老板',
    hint: '经营一家小店，每天招呼顾客买东西',
    fallbackIcon: '🏪',
    imageUrl: 'images/people/shop-owner.jpg'
  }
];

const peopleGame = {
  id: 'people-game',
  title: '看看身边的人',
  icon: '👋',
  description: '和快递员、环卫工人聊聊天',
  color: '#7D8FFF',
  photos: PEOPLE_PHOTOS,
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
      showPhoto: true,
      text: '猜猜这位叔叔/阿姨是做什么工作的？'
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
