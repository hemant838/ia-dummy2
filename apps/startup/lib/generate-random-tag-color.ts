const tagColors = [
  { bg: 'bg-orange-50', border: 'border-orange-100' },
  { bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { bg: 'bg-cyan-50', border: 'border-cyan-100' },
  { bg: 'bg-green-50', border: 'border-green-100' },
  { bg: 'bg-red-50', border: 'border-red-100' },
  { bg: 'bg-purple-50', border: 'border-purple-100' },
  { bg: 'bg-lime-50', border: 'border-lime-100' },
  { bg: 'bg-yellow-50', border: 'border-yellow-100' }
];

export const getRandomTagColor = () => {
  const randomIndex = Math.floor(Math.random() * tagColors.length);
  return tagColors[randomIndex];
};
