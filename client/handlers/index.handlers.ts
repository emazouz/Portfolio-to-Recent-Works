export const formatCategory = (category: string) => {
  return category.replace(/_/g, " ");
};

export const getChartGradientVar = (chartKey: string): string => {
  return `var(--${chartKey})`;
};
