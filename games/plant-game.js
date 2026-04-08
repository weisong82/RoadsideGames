// 认认路边的植物 - 20张植物照片（树和叶子）
const PLANT_PHOTOS = [
  {
    name: '银杏',
    hint: '扇形叶片，秋天变金黄',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Ginkgo_biloba_at_Stockholm_2011.jpg/480px-Ginkgo_biloba_at_Stockholm_2011.jpg'
  },
  {
    name: '香樟',
    hint: '叶片椭圆有光泽，搓揉有香气',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Cinnamomum_camphora_foliage.jpg/480px-Cinnamomum_camphora_foliage.jpg'
  },
  {
    name: '广玉兰',
    hint: '叶片大而厚，正面深绿色有光泽',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Magnolia_grandiflora_foliage.jpg/480px-Magnolia_grandiflora_foliage.jpg'
  },
  {
    name: '悬铃木',
    hint: '叶片像手掌，树皮呈斑驳灰绿色',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Platanus_hispanica_leaf.jpg/480px-Platanus_hispanica_leaf.jpg'
  },
  {
    name: '垂柳',
    hint: '细长的叶片，枝条向下垂挂',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Salix_babylonica_leaves_2.jpg/480px-Salix_babylonica_leaves_2.jpg'
  },
  {
    name: '鸡爪槭',
    hint: '叶片分裂像鸡爪，秋天变红',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Acer_palmatum_leaves.jpg/480px-Acer_palmatum_leaves.jpg'
  },
  {
    name: '水杉',
    hint: '羽毛状的小叶片，排成两排',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Metasequoia_glyptostroboides_leaves.jpg/480px-Metasequoia_glyptostroboides_leaves.jpg'
  },
  {
    name: '合欢',
    hint: '叶片像羽毛，夜晚叶片会合拢',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Albizia_julibrissin_leaves.jpg/480px-Albizia_julibrissin_leaves.jpg'
  },
  {
    name: '棕榈',
    hint: '叶片像扇子，茎干上有褐色纤维',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Trachycarpus_fortunei_foliage.jpg/480px-Trachycarpus_fortunei_foliage.jpg'
  },
  {
    name: '芭蕉',
    hint: '叶片巨大宽阔，像绿色的船帆',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Musa_basjoo_in_Jena.jpg/480px-Musa_basjoo_in_Jena.jpg'
  },
  {
    name: '竹',
    hint: '细长的叶片，空心的竹节',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Phyllostachys_aurea_leaves.jpg/480px-Phyllostachys_aurea_leaves.jpg'
  },
  {
    name: '桂花',
    hint: '小而厚实的椭圆叶，秋天开黄白色小花',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Osmanthus_fragrans_leaves.jpg/480px-Osmanthus_fragrans_leaves.jpg'
  },
  {
    name: '月季',
    hint: '叶片边缘有锯齿，茎上有刺',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Rosa_chinensis_leaves.jpg/480px-Rosa_chinensis_leaves.jpg'
  },
  {
    name: '紫薇',
    hint: '叶片对生，树皮光滑像被摸过',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Lagerstroemia_indica_leaves.jpg/480px-Lagerstroemia_indica_leaves.jpg'
  },
  {
    name: '爬山虎',
    hint: '叶片像三角形，能紧贴墙壁攀爬',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Parthenocissus_tricuspidata_leaves.jpg/480px-Parthenocissus_tricuspidata_leaves.jpg'
  },
  {
    name: '夹竹桃',
    hint: '狭长的叶片三片轮生，全株有毒',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nerium_oleander_leaves.jpg/480px-Nerium_oleander_leaves.jpg'
  },
  {
    name: '女贞',
    hint: '叶片对生，四季常绿有光泽',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Ligustrum_lucidum_leaves.jpg/480px-Ligustrum_lucidum_leaves.jpg'
  },
  {
    name: '三角梅',
    hint: '叶片椭圆，苞片鲜艳像花瓣',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Bougainvillea_leaves.jpg/480px-Bougainvillea_leaves.jpg'
  },
  {
    name: '木槿',
    hint: '叶片三裂像菱形，夏秋开喇叭形花',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Hibiscus_syriacus_leaf.jpg/480px-Hibiscus_syriacus_leaf.jpg'
  },
  {
    name: '梧桐',
    hint: '叶片大而掌状分裂，叶柄很长',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Firmiana_simplex_foliage.jpg/480px-Firmiana_simplex_foliage.jpg'
  }
];

const plantGame = {
  id: 'plant-game',
  title: '认认路边的植物',
  icon: '🌿',
  description: '一起看看梧桐叶、樟树叶长什么样',
  color: '#7AC5A7',
  photos: PLANT_PHOTOS,
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
      showPhoto: true,
      text: '你认识这是什么植物吗？说说它的名字或特征'
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
