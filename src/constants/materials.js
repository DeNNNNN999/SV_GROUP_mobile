// Константы для расчета строительных материалов по ГОСТ

export const MATERIALS = {
  // Кирпич по ГОСТ 530-2012
  brick: {
    name: 'Кирпич',
    types: [
      { 
        id: 'single', 
        name: 'Одинарный (1НФ)', 
        size: '250×120×65 мм',
        perM2: 51, 
        perM3: 394,
        weight: 3.5,
        gost: 'ГОСТ 530-2012'
      },
      { 
        id: 'oneAndHalf', 
        name: 'Полуторный (1.4НФ)', 
        size: '250×120×88 мм',
        perM2: 39, 
        perM3: 302,
        weight: 4.2,
        gost: 'ГОСТ 530-2012'
      },
      { 
        id: 'double', 
        name: 'Двойной (2.1НФ)', 
        size: '250×120×138 мм',
        perM2: 26, 
        perM3: 200,
        weight: 5.4,
        gost: 'ГОСТ 530-2012'
      }
    ],
    mortar: {
      horizontal: 12, // мм - горизонтальный шов
      vertical: 10    // мм - вертикальный шов
    },
    wasteFactor: 0.05 // 5% на бой и брак по СНиП
  },
  
  // Бетон по ГОСТ 26633-2015
  concrete: {
    name: 'Бетон',
    grades: [
      { 
        id: 'm100', 
        name: 'М100 (В7.5)', 
        class: 'B7.5',
        cement: 170, 
        sand: 755, 
        crushed: 1150,
        water: 185,
        density: 2350,
        usage: 'Подготовительные работы, подбетонка',
        gost: 'ГОСТ 26633-2015'
      },
      { 
        id: 'm200', 
        name: 'М200 (В15)', 
        class: 'B15',
        cement: 250, 
        sand: 700, 
        crushed: 1200,
        water: 180,
        density: 2380,
        usage: 'Фундаменты малоэтажных зданий',
        gost: 'ГОСТ 26633-2015'
      },
      { 
        id: 'm300', 
        name: 'М300 (В22.5)', 
        class: 'B22.5',
        cement: 300, 
        sand: 650, 
        crushed: 1250,
        water: 175,
        density: 2400,
        usage: 'Монолитные конструкции',
        gost: 'ГОСТ 26633-2015'
      },
      { 
        id: 'm400', 
        name: 'М400 (В30)', 
        class: 'B30',
        cement: 400, 
        sand: 600, 
        crushed: 1300,
        water: 170,
        density: 2430,
        usage: 'Гидротехнические сооружения',
        gost: 'ГОСТ 26633-2015'
      },
      { 
        id: 'm500', 
        name: 'М500 (В40)', 
        class: 'B40',
        cement: 500, 
        sand: 550, 
        crushed: 1350,
        water: 165,
        density: 2450,
        usage: 'Специальные конструкции',
        gost: 'ГОСТ 26633-2015'
      }
    ],
    additives: {
      plasticizer: 0.5, // % от массы цемента
      antifreeze: 2.0,  // % от массы цемента для зимних работ
    },
    wasteFactor: 0.03 // 3% потери при транспортировке
  },
  
  // Плитка по ГОСТ 6787-2001
  tile: {
    name: 'Плитка керамическая',
    sizes: [
      { id: '20x20', name: '200×200 мм', area: 0.04, packSize: 25 },
      { id: '25x25', name: '250×250 мм', area: 0.0625, packSize: 16 },
      { id: '30x30', name: '300×300 мм', area: 0.09, packSize: 11 },
      { id: '33x33', name: '330×330 мм', area: 0.1089, packSize: 9 },
      { id: '40x40', name: '400×400 мм', area: 0.16, packSize: 7 },
      { id: '45x45', name: '450×450 мм', area: 0.2025, packSize: 5 },
      { id: '60x60', name: '600×600 мм', area: 0.36, packSize: 4 }
    ],
    seamWidth: 3, // мм - ширина шва
    adhesive: 4.5, // кг/м² - расход клея
    wasteFactor: 0.10, // 10% на подрезку
    gost: 'ГОСТ 6787-2001'
  },
  
  // Краска по ГОСТ 28196-89
  paint: {
    name: 'Краска',
    types: [
      { 
        id: 'water', 
        name: 'Водоэмульсионная ВД-АК', 
        coverage: 150, // г/м² на один слой
        layers: 2,
        dryTime: 2, // часов
        gost: 'ГОСТ 28196-89'
      },
      { 
        id: 'acrylic', 
        name: 'Акриловая', 
        coverage: 120, 
        layers: 2,
        dryTime: 4,
        gost: 'ГОСТ 28196-89'
      },
      { 
        id: 'latex', 
        name: 'Латексная', 
        coverage: 100, 
        layers: 1,
        dryTime: 3,
        gost: 'ГОСТ 28196-89'
      },
      { 
        id: 'silicone', 
        name: 'Силиконовая', 
        coverage: 110, 
        layers: 2,
        dryTime: 6,
        gost: 'ГОСТ 28196-89'
      }
    ],
    primer: 100, // г/м² - расход грунтовки
    wasteFactor: 0.10 // 10% запас
  },
  
  // Цементно-песчаный раствор по ГОСТ 28013-98
  mortar: {
    name: 'Раствор',
    types: [
      {
        id: 'm50',
        name: 'М50',
        cement: 220, // кг/м³
        sand: 1680,  // кг/м³
        water: 340,  // л/м³
        usage: 'Кладка перегородок'
      },
      {
        id: 'm75',
        name: 'М75',
        cement: 270,
        sand: 1650,
        water: 330,
        usage: 'Кладка стен'
      },
      {
        id: 'm100',
        name: 'М100',
        cement: 340,
        sand: 1550,
        water: 320,
        usage: 'Кладка несущих стен'
      },
      {
        id: 'm150',
        name: 'М150',
        cement: 450,
        sand: 1400,
        water: 300,
        usage: 'Штукатурные работы'
      }
    ],
    gost: 'ГОСТ 28013-98'
  }
};

// Единицы измерения
export const UNITS = {
  area: 'м²',
  volume: 'м³',
  length: 'м',
  pieces: 'шт',
  liters: 'л',
  kg: 'кг',
  packs: 'уп',
  rolls: 'рул',
  bags: 'меш'
};

// Коэффициенты запаса по СНиП
export const RESERVE_FACTORS = [
  { value: 0, label: 'Без запаса', description: 'Точный расчет' },
  { value: 5, label: '5% запас', description: 'Минимальный запас' },
  { value: 10, label: '10% запас', description: 'Рекомендуемый запас' },
  { value: 15, label: '15% запас', description: 'Увеличенный запас' },
  { value: 20, label: '20% запас', description: 'Максимальный запас' }
];

// Типы фундаментов
export const FOUNDATION_TYPES = [
  { 
    id: 'strip', 
    name: 'Ленточный', 
    description: 'Для домов с подвалом',
    widthFactor: 0.4 // ширина ленты в метрах
  },
  { 
    id: 'slab', 
    name: 'Плитный', 
    description: 'Для слабых грунтов',
    widthFactor: 1.0 // вся площадь
  },
  { 
    id: 'column', 
    name: 'Столбчатый', 
    description: 'Для легких построек',
    widthFactor: 0.16 // площадь одного столба 0.4x0.4м
  }
];

// Цены (примерные, для расчета стоимости)
export const PRICES = {
  concrete: {
    m100: 3200,
    m200: 3500,
    m300: 3800,
    m400: 4200,
    m500: 4800
  },
  cement: 350, // за мешок 50кг
  sand: 800, // за м³
  crushed: 1500, // за м³
  brick: {
    single: 12,
    oneAndHalf: 14,
    double: 18
  }
};