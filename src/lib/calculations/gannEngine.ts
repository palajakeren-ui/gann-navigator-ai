/**
 * Complete Gann Calculation Engine
 * Square of 9/24/52/90/144/360, Gann Angles (16x1 to 1x16), Time Cycles, Price Vibration
 */

// ==================== TYPE DEFINITIONS ====================

export interface GannLevel {
  degree: number;
  price: number;
  type: 'support' | 'resistance' | 'cardinal' | 'ordinal' | 'pivot';
  description: string;
  strength: number;
  significance: 'high' | 'medium' | 'low';
}

export interface GannAngle {
  ratio: string;
  angle: number;
  slope: number;
  type: 'bullish' | 'bearish';
  description: string;
}

export interface TimeCycle {
  name: string;
  days: number;
  targetDate: Date;
  significance: 'high' | 'medium' | 'low';
  type: 'gann' | 'fibonacci' | 'natural';
}

export interface PriceVibration {
  frequency: number;
  period: number;
  amplitude: number;
  phase: number;
  harmonics: number[];
}

export interface GannSquareResult {
  inputPrice: number;
  root: number;
  levels: GannLevel[];
  cardinalCross: number[];
  ordinalCross: number[];
}

// ==================== CORE GANN CALCULATIONS ====================

/**
 * Calculate Square of 9 (Original Gann)
 */
export const calculateSquareOf9 = (centerPrice: number, rings: number = 8): GannSquareResult => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];
  const cardinalCross: number[] = [];
  const ordinalCross: number[] = [];

  // Center point
  levels.push({
    degree: 0,
    price: centerPrice,
    type: 'pivot',
    description: 'Center Price',
    strength: 100,
    significance: 'high',
  });

  // Generate levels for each ring
  for (let ring = 1; ring <= rings; ring++) {
    // Cardinal angles (0°, 90°, 180°, 270°)
    [0, 90, 180, 270].forEach((baseDegree) => {
      const degree = ring * 360 + baseDegree;
      const angleIncrement = degree / 360;
      const newRoot = root + angleIncrement;
      const price = Math.pow(newRoot, 2);

      cardinalCross.push(price);
      levels.push({
        degree,
        price,
        type: 'cardinal',
        description: `${degree}° Cardinal - Ring ${ring}`,
        strength: 90 - ring * 5,
        significance: ring <= 2 ? 'high' : ring <= 4 ? 'medium' : 'low',
      });
    });

    // Ordinal angles (45°, 135°, 225°, 315°)
    [45, 135, 225, 315].forEach((baseDegree) => {
      const degree = (ring - 1) * 360 + baseDegree;
      const angleIncrement = degree / 360;
      const newRoot = root + angleIncrement;
      const price = Math.pow(newRoot, 2);

      ordinalCross.push(price);
      levels.push({
        degree,
        price,
        type: 'ordinal',
        description: `${degree}° Ordinal - Ring ${ring}`,
        strength: 80 - ring * 5,
        significance: ring <= 2 ? 'high' : 'medium',
      });
    });
  }

  // Sort by price
  levels.sort((a, b) => a.price - b.price);
  cardinalCross.sort((a, b) => a - b);
  ordinalCross.sort((a, b) => a - b);

  return {
    inputPrice: centerPrice,
    root,
    levels,
    cardinalCross,
    ordinalCross,
  };
};

/**
 * Calculate Square of 24 (Hourly Cycle)
 */
export const calculateSquareOf24 = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  for (let i = -12; i <= 12; i++) {
    const newRoot = root + (i * 24 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: i * 24,
        price: Math.pow(newRoot, 2),
        type: i === 0 ? 'pivot' : i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i * 24)}° ${i > 0 ? 'Above' : i < 0 ? 'Below' : 'Center'}`,
        strength: 100 - Math.abs(i) * 5,
        significance: Math.abs(i) <= 3 ? 'high' : Math.abs(i) <= 6 ? 'medium' : 'low',
      });
    }
  }

  return levels.sort((a, b) => a.price - b.price);
};

/**
 * Calculate Square of 52 (Weekly Cycle)
 */
export const calculateSquareOf52 = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  for (let i = -8; i <= 8; i++) {
    const newRoot = root + (i * 52 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: i * 52,
        price: Math.pow(newRoot, 2),
        type: i === 0 ? 'pivot' : i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i)} Weekly Cycle${Math.abs(i) !== 1 ? 's' : ''} ${i > 0 ? 'Above' : i < 0 ? 'Below' : ''}`,
        strength: 100 - Math.abs(i) * 8,
        significance: Math.abs(i) <= 2 ? 'high' : Math.abs(i) <= 4 ? 'medium' : 'low',
      });
    }
  }

  return levels.sort((a, b) => a.price - b.price);
};

/**
 * Calculate Square of 90 (Quarterly Cycle)
 */
export const calculateSquareOf90 = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  for (let i = -4; i <= 4; i++) {
    const newRoot = root + (i * 90 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: i * 90,
        price: Math.pow(newRoot, 2),
        type: i === 0 ? 'cardinal' : i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i * 90)}° ${i > 0 ? 'Resistance' : i < 0 ? 'Support' : 'Center'}`,
        strength: 100 - Math.abs(i) * 15,
        significance: Math.abs(i) <= 1 ? 'high' : 'medium',
      });
    }
  }

  return levels.sort((a, b) => a.price - b.price);
};

/**
 * Calculate Square of 144 (Fibonacci-based Cycle)
 */
export const calculateSquareOf144 = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  // 144 is a key Fibonacci number (12² = 144)
  const fibMultipliers = [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3];

  fibMultipliers.forEach((mult) => {
    const newRoot = root + (mult * 144 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: mult * 144,
        price: Math.pow(newRoot, 2),
        type: mult === 0 ? 'pivot' : mult > 0 ? 'resistance' : 'support',
        description: `${Math.abs(mult * 144)}° Fibonacci Harmonic`,
        strength: 100 - Math.abs(mult) * 20,
        significance: Math.abs(mult) <= 1 ? 'high' : 'medium',
      });
    }
  });

  return levels.sort((a, b) => a.price - b.price);
};

/**
 * Calculate Square of 360 (Full Year Cycle)
 */
export const calculateSquareOf360 = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  for (let i = -3; i <= 3; i++) {
    const newRoot = root + i;
    if (newRoot > 0) {
      levels.push({
        degree: i * 360,
        price: Math.pow(newRoot, 2),
        type: i === 0 ? 'pivot' : i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i)} Full Year Cycle${Math.abs(i) !== 1 ? 's' : ''} ${i > 0 ? 'Above' : i < 0 ? 'Below' : ''}`,
        strength: 100,
        significance: 'high',
      });
    }
  }

  return levels.sort((a, b) => a.price - b.price);
};

// ==================== GANN ANGLES (16x1 to 1x16) ====================

/**
 * Calculate all Gann Angles from 16x1 to 1x16
 */
export const calculateGannAngles = (
  pivotPrice: number,
  pivotTime: number,
  priceUnit: number = 1
): GannAngle[] => {
  const angles: GannAngle[] = [
    // Bullish angles (price rises faster than time)
    { ratio: '16x1', angle: 86.4, slope: 16, type: 'bullish', description: 'Extreme Bull' },
    { ratio: '8x1', angle: 82.9, slope: 8, type: 'bullish', description: 'Very Strong Bull' },
    { ratio: '4x1', angle: 76.0, slope: 4, type: 'bullish', description: 'Strong Bull' },
    { ratio: '3x1', angle: 71.6, slope: 3, type: 'bullish', description: 'Moderate Bull' },
    { ratio: '2x1', angle: 63.4, slope: 2, type: 'bullish', description: 'Bull' },
    { ratio: '3x2', angle: 56.3, slope: 1.5, type: 'bullish', description: 'Mild Bull' },
    
    // 1x1 - Balance angle
    { ratio: '1x1', angle: 45.0, slope: 1, type: 'bullish', description: 'Balance Line (45°)' },
    
    // Bearish angles (time moves faster than price)
    { ratio: '2x3', angle: 33.7, slope: 0.667, type: 'bearish', description: 'Mild Bear' },
    { ratio: '1x2', angle: 26.6, slope: 0.5, type: 'bearish', description: 'Bear' },
    { ratio: '1x3', angle: 18.4, slope: 0.333, type: 'bearish', description: 'Moderate Bear' },
    { ratio: '1x4', angle: 14.0, slope: 0.25, type: 'bearish', description: 'Strong Bear' },
    { ratio: '1x8', angle: 7.1, slope: 0.125, type: 'bearish', description: 'Very Strong Bear' },
    { ratio: '1x16', angle: 3.6, slope: 0.0625, type: 'bearish', description: 'Extreme Bear' },
  ];

  return angles.map((angle) => ({
    ...angle,
    // Calculate projected price at given time
    projectedPrice: pivotPrice + angle.slope * priceUnit * pivotTime,
  })) as GannAngle[];
};

/**
 * Calculate Gann Fan projections
 */
export const calculateGannFan = (
  startPrice: number,
  endPrice: number,
  periods: number,
  direction: 'up' | 'down' = 'up'
): Array<{ period: number; prices: Record<string, number> }> => {
  const priceRange = endPrice - startPrice;
  const pricePerPeriod = priceRange / periods;
  const multiplier = direction === 'up' ? 1 : -1;

  const angles = calculateGannAngles(startPrice, 1);
  const projections: Array<{ period: number; prices: Record<string, number> }> = [];

  for (let i = 0; i <= periods; i++) {
    const prices: Record<string, number> = {};
    angles.forEach((angle) => {
      prices[angle.ratio] = startPrice + multiplier * angle.slope * pricePerPeriod * i;
    });
    projections.push({ period: i, prices });
  }

  return projections;
};

// ==================== TIME CYCLES ====================

/**
 * Calculate comprehensive Gann Time Cycles
 */
export const calculateTimeCycles = (startDate: Date): TimeCycle[] => {
  const baseCycles = [
    // Gann-specific cycles
    { name: '7-Day Minor', days: 7, significance: 'low' as const, type: 'gann' as const },
    { name: '14-Day', days: 14, significance: 'medium' as const, type: 'gann' as const },
    { name: '21-Day', days: 21, significance: 'high' as const, type: 'gann' as const },
    { name: '28-Day Lunar', days: 28, significance: 'high' as const, type: 'gann' as const },
    { name: '30-Day', days: 30, significance: 'medium' as const, type: 'gann' as const },
    { name: '45-Day', days: 45, significance: 'high' as const, type: 'gann' as const },
    { name: '49-Day (7²)', days: 49, significance: 'high' as const, type: 'gann' as const },
    { name: '52-Day Weekly', days: 52, significance: 'high' as const, type: 'gann' as const },
    { name: '60-Day', days: 60, significance: 'medium' as const, type: 'gann' as const },
    { name: '72-Day', days: 72, significance: 'medium' as const, type: 'gann' as const },
    { name: '90-Day Quarter', days: 90, significance: 'high' as const, type: 'gann' as const },
    { name: '120-Day', days: 120, significance: 'medium' as const, type: 'gann' as const },
    { name: '144-Day Fibonacci', days: 144, significance: 'high' as const, type: 'fibonacci' as const },
    { name: '180-Day Half-Year', days: 180, significance: 'high' as const, type: 'gann' as const },
    { name: '270-Day', days: 270, significance: 'medium' as const, type: 'gann' as const },
    { name: '360-Day Full Year', days: 360, significance: 'high' as const, type: 'gann' as const },
    { name: '365-Day Calendar', days: 365, significance: 'high' as const, type: 'natural' as const },
    { name: '81-Day (9²)', days: 81, significance: 'medium' as const, type: 'natural' as const },
    { name: '100-Day (10²)', days: 100, significance: 'medium' as const, type: 'natural' as const },
    { name: '121-Day (11²)', days: 121, significance: 'medium' as const, type: 'natural' as const },
    { name: '169-Day (13²)', days: 169, significance: 'medium' as const, type: 'natural' as const },
    { name: '21-Day Fib', days: 21, significance: 'high' as const, type: 'fibonacci' as const },
    { name: '34-Day Fib', days: 34, significance: 'medium' as const, type: 'fibonacci' as const },
    { name: '55-Day Fib', days: 55, significance: 'high' as const, type: 'fibonacci' as const },
    { name: '89-Day Fib', days: 89, significance: 'high' as const, type: 'fibonacci' as const },
    { name: '233-Day Fib', days: 233, significance: 'high' as const, type: 'fibonacci' as const },
  ];

  return baseCycles.map((cycle) => ({
    ...cycle,
    targetDate: new Date(startDate.getTime() + cycle.days * 24 * 60 * 60 * 1000),
  }));
};

// ==================== PRICE-TIME VIBRATION ====================

/**
 * Calculate Price-Time Vibration (Gann's Natural Vibration Theory)
 */
export const calculatePriceVibration = (
  price: number,
  historicalPrices: number[]
): PriceVibration => {
  // Calculate dominant frequency from price swings
  const swings: number[] = [];
  for (let i = 1; i < historicalPrices.length; i++) {
    swings.push(Math.abs(historicalPrices[i] - historicalPrices[i - 1]));
  }

  const avgSwing = swings.reduce((a, b) => a + b, 0) / swings.length;
  const frequency = 1 / avgSwing;
  const period = avgSwing;

  // Calculate amplitude
  const max = Math.max(...historicalPrices);
  const min = Math.min(...historicalPrices);
  const amplitude = (max - min) / 2;

  // Calculate phase based on current position
  const phase = ((price - min) / (max - min)) * 2 * Math.PI;

  // Harmonic frequencies (2x, 3x, 4x, etc.)
  const harmonics = [2, 3, 4, 5, 8].map((h) => frequency * h);

  return {
    frequency,
    period,
    amplitude,
    phase,
    harmonics,
  };
};

// ==================== ATH/ATL PROJECTIONS ====================

/**
 * Calculate ATH/ATL Time-Price Projections
 */
export const calculateATHATLProjections = (
  ath: { price: number; date: Date },
  atl: { price: number; date: Date },
  currentPrice: number
): {
  priceProjections: GannLevel[];
  timeProjections: TimeCycle[];
  confluence: Array<{ price: number; date: Date; strength: number }>;
} => {
  const priceRange = ath.price - atl.price;
  const timeRange = Math.abs(ath.date.getTime() - atl.date.getTime()) / (1000 * 60 * 60 * 24);

  // Fibonacci price retracements from ATH
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2, 2.618];
  const priceProjections: GannLevel[] = fibLevels.map((fib) => ({
    degree: fib * 360,
    price: atl.price + priceRange * fib,
    type: fib <= 0.5 ? 'support' : 'resistance',
    description: `${(fib * 100).toFixed(1)}% Fibonacci Level`,
    strength: fib === 0.618 || fib === 0.382 ? 100 : 80,
    significance: [0.382, 0.5, 0.618].includes(fib) ? 'high' : 'medium',
  }));

  // Time projections from ATL
  const timeProjections = calculateTimeCycles(atl.date);

  // Find confluence zones
  const confluence: Array<{ price: number; date: Date; strength: number }> = [];
  timeProjections.forEach((timeCycle) => {
    priceProjections.forEach((priceLevel) => {
      if (timeCycle.significance === 'high' && priceLevel.significance === 'high') {
        confluence.push({
          price: priceLevel.price,
          date: timeCycle.targetDate,
          strength: (timeCycle.significance === 'high' ? 50 : 30) + priceLevel.strength / 2,
        });
      }
    });
  });

  return {
    priceProjections,
    timeProjections,
    confluence: confluence.sort((a, b) => b.strength - a.strength).slice(0, 10),
  };
};

// ==================== HEXAGON CHART ====================

/**
 * Calculate Hexagon Chart Levels
 */
export const calculateHexagonLevels = (centerPrice: number): GannLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: GannLevel[] = [];

  // Hexagon angles (60° intervals)
  const hexAngles = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720];

  hexAngles.forEach((degree) => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);

    let harmonic = '';
    let type: GannLevel['type'] = 'ordinal';

    if (degree % 180 === 0) {
      harmonic = 'Full Pivot';
      type = 'cardinal';
    } else if (degree % 120 === 0) {
      harmonic = 'Trine';
      type = 'resistance';
    } else if (degree % 60 === 0) {
      harmonic = 'Sextile';
      type = 'support';
    }

    levels.push({
      degree,
      price,
      type,
      description: `${degree}° ${harmonic}`,
      strength: degree % 180 === 0 ? 100 : degree % 120 === 0 ? 80 : 60,
      significance: degree % 180 === 0 ? 'high' : 'medium',
    });
  });

  return levels;
};

// ==================== NATURAL SQUARES ====================

/**
 * Calculate Natural Square Numbers relative to price
 */
export const calculateNaturalSquares = (
  price: number
): Array<{ n: number; square: number; distance: number; type: 'support' | 'resistance' }> => {
  const sqrtPrice = Math.sqrt(price);
  const nearestN = Math.round(sqrtPrice);
  const results: Array<{ n: number; square: number; distance: number; type: 'support' | 'resistance' }> = [];

  for (let i = nearestN - 5; i <= nearestN + 5; i++) {
    if (i > 0) {
      const square = i * i;
      results.push({
        n: i,
        square,
        distance: Math.abs(price - square),
        type: square > price ? 'resistance' : 'support',
      });
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
};

// ==================== MASTER CALCULATOR ====================

/**
 * Master Gann Calculator - combines all calculations
 */
export const calculateGannMaster = (
  price: number,
  options: {
    includeSquareOf9?: boolean;
    includeSquareOf24?: boolean;
    includeSquareOf52?: boolean;
    includeSquareOf90?: boolean;
    includeSquareOf144?: boolean;
    includeSquareOf360?: boolean;
    includeHexagon?: boolean;
    includeNaturalSquares?: boolean;
  } = {}
): {
  allLevels: GannLevel[];
  nearestSupport: GannLevel | null;
  nearestResistance: GannLevel | null;
  keyLevels: GannLevel[];
} => {
  const {
    includeSquareOf9 = true,
    includeSquareOf24 = true,
    includeSquareOf52 = true,
    includeSquareOf90 = true,
    includeSquareOf144 = true,
    includeSquareOf360 = true,
    includeHexagon = true,
    includeNaturalSquares = true,
  } = options;

  let allLevels: GannLevel[] = [];

  if (includeSquareOf9) {
    allLevels = [...allLevels, ...calculateSquareOf9(price).levels];
  }
  if (includeSquareOf24) {
    allLevels = [...allLevels, ...calculateSquareOf24(price)];
  }
  if (includeSquareOf52) {
    allLevels = [...allLevels, ...calculateSquareOf52(price)];
  }
  if (includeSquareOf90) {
    allLevels = [...allLevels, ...calculateSquareOf90(price)];
  }
  if (includeSquareOf144) {
    allLevels = [...allLevels, ...calculateSquareOf144(price)];
  }
  if (includeSquareOf360) {
    allLevels = [...allLevels, ...calculateSquareOf360(price)];
  }
  if (includeHexagon) {
    allLevels = [...allLevels, ...calculateHexagonLevels(price)];
  }
  if (includeNaturalSquares) {
    const natSquares = calculateNaturalSquares(price);
    allLevels = [
      ...allLevels,
      ...natSquares.map((ns) => ({
        degree: 0,
        price: ns.square,
        type: ns.type,
        description: `Natural Square ${ns.n}²`,
        strength: 100 - ns.distance / price * 100,
        significance: 'high' as const,
      })),
    ];
  }

  // Remove duplicates (within 0.1% tolerance)
  const uniqueLevels: GannLevel[] = [];
  allLevels.forEach((level) => {
    const isDuplicate = uniqueLevels.some(
      (existing) => Math.abs(existing.price - level.price) / level.price < 0.001
    );
    if (!isDuplicate) {
      uniqueLevels.push(level);
    }
  });

  // Sort by price
  uniqueLevels.sort((a, b) => a.price - b.price);

  // Find nearest support and resistance
  const supports = uniqueLevels.filter((l) => l.price < price && (l.type === 'support' || l.type === 'cardinal'));
  const resistances = uniqueLevels.filter((l) => l.price > price && (l.type === 'resistance' || l.type === 'cardinal'));

  const nearestSupport = supports.length > 0 ? supports[supports.length - 1] : null;
  const nearestResistance = resistances.length > 0 ? resistances[0] : null;

  // Key levels (high significance)
  const keyLevels = uniqueLevels.filter((l) => l.significance === 'high');

  return {
    allLevels: uniqueLevels,
    nearestSupport,
    nearestResistance,
    keyLevels,
  };
};
