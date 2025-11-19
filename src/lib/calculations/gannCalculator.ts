/**
 * Gann Analysis Calculation Engine
 * Provides advanced calculations for Gann angles, squares, and cycles
 */

export interface GannAngle {
  angle: number;
  price: number;
  type: string;
  description: string;
}

export interface GannSquare {
  level: number;
  price: number;
  time: number;
  significance: string;
}

/**
 * Calculate Gann Angles from a pivot point
 */
export const calculateGannAngles = (pivotPrice: number, pivotTime: number): GannAngle[] => {
  const angles = [
    { ratio: 8, name: "8x1" },
    { ratio: 4, name: "4x1" },
    { ratio: 3, name: "3x1" },
    { ratio: 2, name: "2x1" },
    { ratio: 1, name: "1x1" },
    { ratio: 0.5, name: "1x2" },
    { ratio: 0.333, name: "1x3" },
    { ratio: 0.25, name: "1x4" },
    { ratio: 0.125, name: "1x8" },
  ];

  return angles.map((angle) => ({
    angle: angle.ratio,
    price: pivotPrice * (1 + angle.ratio * 0.1),
    type: angle.name,
    description: `Gann ${angle.name} angle from pivot at $${pivotPrice.toFixed(2)}`,
  }));
};

/**
 * Calculate Gann Square of 9 levels
 */
export const calculateSquareOfNine = (centerPrice: number): GannSquare[] => {
  const squares: GannSquare[] = [];
  const baseValue = Math.sqrt(centerPrice);
  
  for (let i = 1; i <= 9; i++) {
    const level = Math.pow(baseValue + i * 0.5, 2);
    squares.push({
      level: i,
      price: level,
      time: i * 30, // days
      significance: i % 3 === 0 ? "Major" : i % 2 === 0 ? "Moderate" : "Minor",
    });
  }
  
  return squares;
};

/**
 * Calculate Fibonacci retracement levels
 */
export const calculateFibonacciLevels = (high: number, low: number): Record<string, number> => {
  const diff = high - low;
  
  return {
    "0.0%": low,
    "23.6%": low + diff * 0.236,
    "38.2%": low + diff * 0.382,
    "50.0%": low + diff * 0.5,
    "61.8%": low + diff * 0.618,
    "78.6%": low + diff * 0.786,
    "100.0%": high,
    "161.8%": high + diff * 0.618,
    "261.8%": high + diff * 1.618,
  };
};

/**
 * Calculate price projection based on Gann Fan
 */
export const calculateGannFan = (
  startPrice: number,
  endPrice: number,
  periods: number
): Array<{ period: number; price: number; angle: string }> => {
  const priceChange = endPrice - startPrice;
  const fanLines = [1, 2, 3, 4, 8];
  const results: Array<{ period: number; price: number; angle: string }> = [];

  fanLines.forEach((multiplier) => {
    for (let i = 1; i <= periods; i++) {
      results.push({
        period: i,
        price: startPrice + (priceChange / periods) * i * multiplier,
        angle: `1x${multiplier}`,
      });
    }
  });

  return results;
};

/**
 * Calculate Gann Swing indicator
 */
export const calculateGannSwing = (prices: number[]): Array<{ index: number; type: 'high' | 'low'; price: number }> => {
  const swings: Array<{ index: number; type: 'high' | 'low'; price: number }> = [];
  let currentTrend: 'up' | 'down' | null = null;
  let lastSwingPrice = prices[0];
  let lastSwingIndex = 0;

  for (let i = 1; i < prices.length - 1; i++) {
    const prev = prices[i - 1];
    const curr = prices[i];
    const next = prices[i + 1];

    // Detect local high
    if (curr > prev && curr > next) {
      if (currentTrend !== 'up') {
        swings.push({ index: i, type: 'high', price: curr });
        currentTrend = 'up';
        lastSwingPrice = curr;
        lastSwingIndex = i;
      }
    }

    // Detect local low
    if (curr < prev && curr < next) {
      if (currentTrend !== 'down') {
        swings.push({ index: i, type: 'low', price: curr });
        currentTrend = 'down';
        lastSwingPrice = curr;
        lastSwingIndex = i;
      }
    }
  }

  return swings;
};

/**
 * Calculate time cycles based on Gann's natural cycles
 */
export const calculateTimeCycles = (startDate: Date): Array<{ date: Date; cycle: string; significance: string }> => {
  const cycles = [
    { days: 7, name: "Weekly", significance: "Minor" },
    { days: 30, name: "Monthly", significance: "Moderate" },
    { days: 90, name: "Quarterly", significance: "Major" },
    { days: 144, name: "Fibonacci 144", significance: "Major" },
    { days: 180, name: "Semi-Annual", significance: "Major" },
    { days: 365, name: "Annual", significance: "Critical" },
  ];

  return cycles.map((cycle) => {
    const futureDate = new Date(startDate);
    futureDate.setDate(futureDate.getDate() + cycle.days);
    return {
      date: futureDate,
      cycle: cycle.name,
      significance: cycle.significance,
    };
  });
};

/**
 * Calculate support and resistance levels using Gann methodology
 */
export const calculateSupportResistance = (
  currentPrice: number,
  historicalHigh: number,
  historicalLow: number
): { support: number[]; resistance: number[] } => {
  const range = historicalHigh - historicalLow;
  const gannLevels = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];

  const levels = gannLevels.map((level) => historicalLow + range * level);

  return {
    support: levels.filter((level) => level < currentPrice),
    resistance: levels.filter((level) => level > currentPrice),
  };
};
