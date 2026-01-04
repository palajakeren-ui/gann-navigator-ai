// Gann Square of 9 Calculator with complete implementation

export interface SquareOf9Level {
  degree: number;
  price: number;
  type: 'support' | 'resistance' | 'cardinal' | 'ordinal';
  description: string;
}

export interface SquareOf9Result {
  inputPrice: number;
  root: number;
  levels: SquareOf9Level[];
  cardinalLevels: number[];
  ordinalLevels: number[];
}

export interface HexagonLevel {
  degree: number;
  price: number;
  type: string;
  harmonic: string;
}

// Calculate Square of 9 levels
export const calculateSquareOf9 = (centerPrice: number, numLevels: number = 8): SquareOf9Result => {
  const root = Math.sqrt(centerPrice);
  const levels: SquareOf9Level[] = [];
  const cardinalLevels: number[] = [];
  const ordinalLevels: number[] = [];

  // Cardinal angles (0°, 90°, 180°, 270°, 360°)
  const cardinalAngles = [0, 90, 180, 270, 360, 450, 540, 630, 720];
  // Ordinal angles (45°, 135°, 225°, 315°)
  const ordinalAngles = [45, 135, 225, 315, 405, 495, 585, 675];

  // Generate cardinal levels
  cardinalAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    
    cardinalLevels.push(price);
    levels.push({
      degree,
      price,
      type: 'cardinal',
      description: `${degree}° Cardinal - Major S/R`
    });
  });

  // Generate ordinal levels
  ordinalAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    
    ordinalLevels.push(price);
    levels.push({
      degree,
      price,
      type: 'ordinal',
      description: `${degree}° Ordinal - Secondary S/R`
    });
  });

  // Add support levels (below center)
  for (let i = 1; i <= numLevels; i++) {
    const supportRoot = root - (i * 0.25);
    if (supportRoot > 0) {
      const supportPrice = Math.pow(supportRoot, 2);
      levels.push({
        degree: -i * 90,
        price: supportPrice,
        type: 'support',
        description: `Support Level ${i} (-${i * 90}°)`
      });
    }
  }

  // Add resistance levels (above center)
  for (let i = 1; i <= numLevels; i++) {
    const resistanceRoot = root + (i * 0.25);
    const resistancePrice = Math.pow(resistanceRoot, 2);
    levels.push({
      degree: i * 90,
      price: resistancePrice,
      type: 'resistance',
      description: `Resistance Level ${i} (+${i * 90}°)`
    });
  }

  // Sort levels by price
  levels.sort((a, b) => a.price - b.price);

  return {
    inputPrice: centerPrice,
    root,
    levels,
    cardinalLevels: cardinalLevels.sort((a, b) => a - b),
    ordinalLevels: ordinalLevels.sort((a, b) => a - b)
  };
};

// Calculate Hexagon levels
export const calculateHexagonLevels = (centerPrice: number): HexagonLevel[] => {
  const root = Math.sqrt(centerPrice);
  const levels: HexagonLevel[] = [];
  
  // Hexagon angles (60° intervals)
  const hexAngles = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720];
  
  hexAngles.forEach(degree => {
    const angleIncrement = degree / 360;
    const newRoot = root + angleIncrement;
    const price = Math.pow(newRoot, 2);
    
    let harmonic = '';
    if (degree % 180 === 0) harmonic = 'Full Pivot';
    else if (degree % 120 === 0) harmonic = 'Resistance Harmonic';
    else if (degree % 60 === 0) harmonic = 'Support Harmonic';
    
    levels.push({
      degree,
      price,
      type: degree % 180 === 0 ? 'major' : degree % 60 === 0 ? 'minor' : 'tertiary',
      harmonic
    });
  });

  return levels;
};

// Calculate Square of 52 (Weekly cycles)
export const calculateSquareOf52 = (centerPrice: number): number[] => {
  const levels: number[] = [];
  const root = Math.sqrt(centerPrice);
  
  for (let i = -8; i <= 8; i++) {
    const newRoot = root + (i * 52 / 360);
    if (newRoot > 0) {
      levels.push(Math.pow(newRoot, 2));
    }
  }
  
  return levels.sort((a, b) => a - b);
};

// Calculate Square of 90 (Quarter cycle)
export const calculateSquareOf90 = (centerPrice: number): SquareOf9Level[] => {
  const root = Math.sqrt(centerPrice);
  const levels: SquareOf9Level[] = [];
  
  for (let i = -4; i <= 4; i++) {
    if (i === 0) {
      levels.push({
        degree: 0,
        price: centerPrice,
        type: 'cardinal',
        description: 'Center Price'
      });
      continue;
    }
    
    const newRoot = root + (i * 90 / 360);
    if (newRoot > 0) {
      levels.push({
        degree: i * 90,
        price: Math.pow(newRoot, 2),
        type: i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i * 90)}° ${i > 0 ? 'Resistance' : 'Support'}`
      });
    }
  }
  
  return levels.sort((a, b) => a.price - b.price);
};

// Calculate Square of 144 (Fibonacci-based)
export const calculateSquareOf144 = (centerPrice: number): number[] => {
  const levels: number[] = [];
  const root = Math.sqrt(centerPrice);
  
  // Fibonacci sequence for 144 relationships
  const fibAngles = [0, 144, 233, 377, 610, -144, -233, -377];
  
  fibAngles.forEach(angle => {
    const newRoot = root + (angle / 360);
    if (newRoot > 0) {
      levels.push(Math.pow(newRoot, 2));
    }
  });
  
  return levels.sort((a, b) => a - b);
};

// Calculate Square of 360 (Full Year Cycle)
export const calculateSquareOf360 = (centerPrice: number): SquareOf9Level[] => {
  const root = Math.sqrt(centerPrice);
  const levels: SquareOf9Level[] = [];
  
  for (let i = -2; i <= 2; i++) {
    const newRoot = root + i;
    if (newRoot > 0) {
      levels.push({
        degree: i * 360,
        price: Math.pow(newRoot, 2),
        type: i === 0 ? 'cardinal' : i > 0 ? 'resistance' : 'support',
        description: `${Math.abs(i)} Full Cycle${Math.abs(i) !== 1 ? 's' : ''} ${i > 0 ? 'Above' : i < 0 ? 'Below' : ''}`
      });
    }
  }
  
  return levels;
};

// Calculate Gann Fan angles
export const calculateGannFanAngles = (pivotPrice: number, pivotTime: number): Array<{
  ratio: string;
  angle: number;
  slope: number;
  price: number;
  type: 'support' | 'resistance';
}> => {
  const angles = [
    { ratio: '8x1', angle: 82.5, slope: 8 },
    { ratio: '4x1', angle: 75, slope: 4 },
    { ratio: '3x1', angle: 71.5, slope: 3 },
    { ratio: '2x1', angle: 63.5, slope: 2 },
    { ratio: '1x1', angle: 45, slope: 1 },
    { ratio: '1x2', angle: 26.5, slope: 0.5 },
    { ratio: '1x3', angle: 18.5, slope: 0.333 },
    { ratio: '1x4', angle: 15, slope: 0.25 },
    { ratio: '1x8', angle: 7.5, slope: 0.125 },
  ];

  const priceUnit = pivotPrice * 0.001; // 0.1% price unit

  return angles.map(a => ({
    ...a,
    price: pivotPrice + (priceUnit * a.slope * pivotTime),
    type: a.slope >= 1 ? 'resistance' as const : 'support' as const
  }));
};

// Calculate Time Cycles
export const calculateTimeCycles = (startDate: Date): Array<{
  cycle: string;
  days: number;
  targetDate: Date;
  significance: 'high' | 'medium' | 'low';
}> => {
  const cycles = [
    { cycle: '7-Day', days: 7, significance: 'medium' as const },
    { cycle: '21-Day', days: 21, significance: 'high' as const },
    { cycle: '30-Day', days: 30, significance: 'medium' as const },
    { cycle: '45-Day', days: 45, significance: 'medium' as const },
    { cycle: '52-Day (Weekly Cycle)', days: 52, significance: 'high' as const },
    { cycle: '90-Day (Quarter)', days: 90, significance: 'high' as const },
    { cycle: '144-Day (Fibonacci)', days: 144, significance: 'high' as const },
    { cycle: '180-Day (Half Year)', days: 180, significance: 'medium' as const },
    { cycle: '360-Day (Full Year)', days: 360, significance: 'high' as const },
  ];

  return cycles.map(c => ({
    ...c,
    targetDate: new Date(startDate.getTime() + c.days * 24 * 60 * 60 * 1000)
  }));
};

// Natural Square calculations
export const calculateNaturalSquares = (price: number): Array<{
  square: number;
  root: number;
  nearestPrice: number;
  distance: number;
}> => {
  const sqrtPrice = Math.sqrt(price);
  const nearestRoot = Math.round(sqrtPrice);
  const results = [];

  for (let i = nearestRoot - 3; i <= nearestRoot + 3; i++) {
    if (i > 0) {
      const squareValue = i * i;
      results.push({
        square: i,
        root: i,
        nearestPrice: squareValue,
        distance: Math.abs(price - squareValue)
      });
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
};
