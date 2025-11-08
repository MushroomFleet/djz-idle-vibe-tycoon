/**
 * Game Formulas - Logarithmic progression system
 * Based on idle clicker best practices from research
 */

/**
 * Calculate upgrade cost using logarithmic scaling
 * Formula: cost = base * (1.15 ^ level) * log(1 + level)
 */
export const calculateUpgradeCost = (baseCost: number, currentLevel: number): number => {
  if (currentLevel === 0) return baseCost;
  
  const exponentialGrowth = Math.pow(1.15, currentLevel);
  const logarithmicModifier = Math.log(1 + currentLevel) + 1;
  
  return Math.floor(baseCost * exponentialGrowth * logarithmicModifier);
};

/**
 * Calculate production rate for automation
 * Formula: rate = base * level * log(1 + level/2)
 */
export const calculateProductionRate = (baseRate: number, level: number): number => {
  if (level === 0) return 0;
  
  const logModifier = Math.log(1 + level / 2) + 1;
  return baseRate * level * logModifier;
};

/**
 * Calculate progress gain per click with diminishing returns
 * Formula: gain = base * (1 / log(1 + level/3))
 */
export const calculateClickProgress = (baseProgress: number, level: number): number => {
  if (level < 3) return baseProgress;
  
  const diminishingFactor = 1 / (Math.log(1 + level / 3) + 0.5);
  return baseProgress * diminishingFactor;
};

/**
 * Calculate prestige reward multiplier
 * Formula: multiplier = log(total_apps_delivered + 1) * 0.1
 */
export const calculatePrestigeMultiplier = (totalApps: number): number => {
  return Math.log(totalApps + 1) * 0.1 + 1;
};

/**
 * Calculate time to complete level (for balancing)
 * Early levels: 5-10 minutes
 * Mid levels: 1-2 hours with automation
 */
export const estimateCompletionTime = (level: number, automationPower: number): number => {
  const baseTime = 300; // 5 minutes in seconds
  const levelModifier = Math.pow(1.5, level);
  const automationReduction = 1 / (1 + automationPower / 100);
  
  return baseTime * levelModifier * automationReduction;
};

/**
 * Format large numbers for display
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
  return (num / 1000000000000).toFixed(1) + 'T';
};

/**
 * Calculate total production rate from all automations
 */
export const calculateTotalProduction = (automations: Array<{ baseProductionRate: number; currentLevel: number }>): number => {
  return automations.reduce((total, auto) => {
    return total + calculateProductionRate(auto.baseProductionRate, auto.currentLevel);
  }, 0);
};
