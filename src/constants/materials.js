export const MATERIALS = {
  brick: {
    types: [
      {
        id: 'single',
        name: 'Одинарный',
        size: '250x120x65 мм',
        perM2: 51,
        weight: 3.5,
      },
      {
        id: 'oneAndHalf',
        name: 'Полуторный',
        size: '250x120x88 мм',
        perM2: 39,
        weight: 4.2,
      },
      {
        id: 'double',
        name: 'Двойной',
        size: '250x120x140 мм',
        perM2: 26,
        weight: 5.4,
      },
    ],
    wasteFactor: 0.05, // 5% на бой и брак
  },
  concrete: {
    grades: [
      { label: 'M100', cement: 175 },
      { label: 'M150', cement: 215 },
      { label: 'M200', cement: 255 },
      { label: 'M250', cement: 295 },
      { label: 'M300', cement: 335 },
      { label: 'M350', cement: 380 },
      { label: 'M400', cement: 420 },
      { label: 'M450', cement: 460 },
      { label: 'M500', cement: 500 },
    ],
  },
  mortar: {
    types: [
      { label: '1:3', cement: 450, sand: 1350 },
      { label: '1:4', cement: 350, sand: 1400 },
      { label: '1:5', cement: 280, sand: 1400 },
      { label: '1:6', cement: 240, sand: 1440 },
    ],
  },
  tile: {
    wasteFactor: 0.1, // 10% на подрезку
  },
};

export const RESERVE_FACTORS = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 15, label: '15%' },
  { value: 20, label: '20%' },
];