/**
 * Complete Astrological Calculation Engine
 * Planetary positions, aspects, lunar phases, planetary hours, market correlations
 */

// ==================== TYPE DEFINITIONS ====================

export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  latitude: number;
  sign: string;
  degree: number;
  minute: number;
  house: number;
  retrograde: boolean;
  speed: number;
}

export interface PlanetaryAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  applying: boolean;
  influence: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  description: string;
}

export interface LunarPhase {
  phase: string;
  percentage: number;
  illumination: number;
  age: number;
  influence: string;
  nextPhase: { phase: string; date: Date };
}

export interface PlanetaryHour {
  hour: number;
  startTime: Date;
  endTime: Date;
  planet: string;
  quality: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export interface MarketSentiment {
  score: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  factors: Array<{ factor: string; weight: number; contribution: number }>;
}

export interface EclipseData {
  type: 'solar' | 'lunar';
  date: Date;
  longitude: number;
  sign: string;
  influence: string;
  daysUntil: number;
}

export interface RetrogradeStatus {
  planet: string;
  isRetrograde: boolean;
  startDate: Date | null;
  endDate: Date | null;
  influence: string;
}

// ==================== ZODIAC HELPERS ====================

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_ELEMENTS = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water'
};

const ZODIAC_MODALITY = {
  Aries: 'Cardinal', Taurus: 'Fixed', Gemini: 'Mutable', Cancer: 'Cardinal',
  Leo: 'Fixed', Virgo: 'Mutable', Libra: 'Cardinal', Scorpio: 'Fixed',
  Sagittarius: 'Mutable', Capricorn: 'Cardinal', Aquarius: 'Fixed', Pisces: 'Mutable'
};

const getZodiacSign = (longitude: number): string => {
  const index = Math.floor(longitude / 30) % 12;
  return ZODIAC_SIGNS[index];
};

const getDegreeInSign = (longitude: number): { degree: number; minute: number } => {
  const degreeInSign = longitude % 30;
  return {
    degree: Math.floor(degreeInSign),
    minute: Math.floor((degreeInSign % 1) * 60)
  };
};

// ==================== PLANETARY CALCULATIONS ====================

// Simplified orbital periods in days (mean values)
const PLANETARY_DATA = [
  { name: 'Sun', period: 365.25, basePos: 280.46, speed: 0.9856 },
  { name: 'Moon', period: 27.32, basePos: 218.32, speed: 13.176 },
  { name: 'Mercury', period: 87.97, basePos: 48.33, speed: 4.092 },
  { name: 'Venus', period: 224.7, basePos: 76.68, speed: 1.602 },
  { name: 'Mars', period: 686.98, basePos: 49.56, speed: 0.524 },
  { name: 'Jupiter', period: 4332.59, basePos: 100.46, speed: 0.083 },
  { name: 'Saturn', period: 10759.22, basePos: 113.66, speed: 0.033 },
  { name: 'Uranus', period: 30688.5, basePos: 74.01, speed: 0.012 },
  { name: 'Neptune', period: 60182, basePos: 131.78, speed: 0.006 },
  { name: 'Pluto', period: 90560, basePos: 110.30, speed: 0.004 }
];

/**
 * Calculate planetary positions for a given date
 */
export const calculatePlanetaryPositions = (date: Date): PlanetaryPosition[] => {
  const epoch = new Date('2000-01-01T12:00:00Z');
  const daysSinceEpoch = (date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24);

  return PLANETARY_DATA.map(planet => {
    // Calculate mean longitude
    const meanLongitude = (planet.basePos + (daysSinceEpoch * planet.speed)) % 360;
    const longitude = meanLongitude < 0 ? meanLongitude + 360 : meanLongitude;
    
    const sign = getZodiacSign(longitude);
    const { degree, minute } = getDegreeInSign(longitude);
    const house = Math.floor(longitude / 30) + 1;
    
    // Simplified retrograde detection (based on synodic cycles)
    const retrograde = planet.name !== 'Sun' && planet.name !== 'Moon' && 
      Math.sin((daysSinceEpoch / planet.period) * 2 * Math.PI) < -0.7;

    return {
      planet: planet.name,
      longitude: Math.round(longitude * 100) / 100,
      latitude: 0, // Simplified - not calculating ecliptic latitude
      sign,
      degree,
      minute,
      house,
      retrograde,
      speed: planet.speed * (retrograde ? -0.5 : 1)
    };
  });
};

// ==================== ASPECT CALCULATIONS ====================

const ASPECT_TYPES = [
  { name: 'Conjunction', angle: 0, orb: 10, influence: 'neutral', strength: 100 },
  { name: 'Sextile', angle: 60, orb: 6, influence: 'bullish', strength: 60 },
  { name: 'Square', angle: 90, orb: 8, influence: 'bearish', strength: 80 },
  { name: 'Trine', angle: 120, orb: 8, influence: 'bullish', strength: 90 },
  { name: 'Opposition', angle: 180, orb: 10, influence: 'bearish', strength: 85 },
  { name: 'Quincunx', angle: 150, orb: 3, influence: 'neutral', strength: 40 },
  { name: 'Semi-sextile', angle: 30, orb: 2, influence: 'neutral', strength: 30 },
  { name: 'Semi-square', angle: 45, orb: 2, influence: 'bearish', strength: 50 },
  { name: 'Sesquiquadrate', angle: 135, orb: 2, influence: 'bearish', strength: 50 }
];

/**
 * Calculate aspects between planetary positions
 */
export const calculatePlanetaryAspects = (positions: PlanetaryPosition[]): PlanetaryAspect[] => {
  const aspects: PlanetaryAspect[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      
      let angle = Math.abs(pos1.longitude - pos2.longitude);
      if (angle > 180) angle = 360 - angle;

      for (const aspectType of ASPECT_TYPES) {
        const orb = Math.abs(angle - aspectType.angle);
        if (orb <= aspectType.orb) {
          // Determine if aspect is applying or separating
          const applying = pos1.speed > pos2.speed;
          
          aspects.push({
            planet1: pos1.planet,
            planet2: pos2.planet,
            aspect: aspectType.name,
            angle: Math.round(angle * 100) / 100,
            orb: Math.round(orb * 100) / 100,
            applying,
            influence: aspectType.influence as 'bullish' | 'bearish' | 'neutral',
            strength: Math.round(aspectType.strength * (1 - orb / aspectType.orb)),
            description: `${pos1.planet} ${aspectType.name.toLowerCase()} ${pos2.planet} (${orb.toFixed(1)}° orb)`
          });
        }
      }
    }
  }

  return aspects.sort((a, b) => b.strength - a.strength);
};

// ==================== LUNAR CALCULATIONS ====================

/**
 * Calculate lunar phase for a given date
 */
export const calculateLunarPhase = (date: Date): LunarPhase => {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.53058867; // Synodic month in days
  
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = daysSinceNewMoon % lunarCycle;
  const percentage = (age / lunarCycle) * 100;
  
  // Calculate illumination (simplified)
  const illumination = Math.round((1 - Math.cos((age / lunarCycle) * 2 * Math.PI)) / 2 * 100);

  let phase: string;
  let influence: string;

  if (percentage < 1.85 || percentage >= 98.15) {
    phase = 'New Moon';
    influence = 'New beginnings, low volatility expected';
  } else if (percentage < 12.5) {
    phase = 'Waxing Crescent';
    influence = 'Growing momentum, bullish bias';
  } else if (percentage < 25) {
    phase = 'First Quarter';
    influence = 'Decision point, increased volatility';
  } else if (percentage < 37.5) {
    phase = 'Waxing Gibbous';
    influence = 'Building strength, trend continuation';
  } else if (percentage < 51.85) {
    phase = 'Full Moon';
    influence = 'Peak activity, potential reversals';
  } else if (percentage < 62.5) {
    phase = 'Waning Gibbous';
    influence = 'Distribution phase, profit taking';
  } else if (percentage < 75) {
    phase = 'Last Quarter';
    influence = 'Reassessment, potential trend change';
  } else {
    phase = 'Waning Crescent';
    influence = 'Consolidation, low energy';
  }

  // Calculate next phase
  const phaseDuration = lunarCycle / 8;
  const currentPhaseIndex = Math.floor(percentage / 12.5);
  const nextPhaseIndex = (currentPhaseIndex + 1) % 8;
  const daysToNextPhase = (nextPhaseIndex * phaseDuration) - age;
  const nextPhaseDate = new Date(date.getTime() + (daysToNextPhase > 0 ? daysToNextPhase : daysToNextPhase + lunarCycle) * 24 * 60 * 60 * 1000);

  const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 
                  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];

  return {
    phase,
    percentage: Math.round(percentage * 100) / 100,
    illumination,
    age: Math.round(age * 100) / 100,
    influence,
    nextPhase: {
      phase: phases[nextPhaseIndex],
      date: nextPhaseDate
    }
  };
};

// ==================== PLANETARY HOURS ====================

const PLANETARY_HOUR_SEQUENCE = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const DAY_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/**
 * Calculate planetary hours for a given date
 */
export const calculatePlanetaryHours = (date: Date): PlanetaryHour[] => {
  const dayOfWeek = date.getDay();
  const dayRuler = DAY_RULERS[dayOfWeek];
  const startIndex = PLANETARY_HOUR_SEQUENCE.indexOf(dayRuler);

  // Simplified sunrise/sunset (6am - 6pm)
  const sunrise = new Date(date);
  sunrise.setHours(6, 0, 0, 0);
  const sunset = new Date(date);
  sunset.setHours(18, 0, 0, 0);

  const dayLength = (sunset.getTime() - sunrise.getTime()) / 12; // 12 day hours
  const nightLength = ((24 * 60 * 60 * 1000) - (sunset.getTime() - sunrise.getTime())) / 12; // 12 night hours

  const hours: PlanetaryHour[] = [];

  for (let i = 0; i < 24; i++) {
    const planetIndex = (startIndex + i) % 7;
    const planet = PLANETARY_HOUR_SEQUENCE[planetIndex];
    
    let startTime: Date;
    let endTime: Date;

    if (i < 12) {
      // Day hours
      startTime = new Date(sunrise.getTime() + i * dayLength);
      endTime = new Date(sunrise.getTime() + (i + 1) * dayLength);
    } else {
      // Night hours
      startTime = new Date(sunset.getTime() + (i - 12) * nightLength);
      endTime = new Date(sunset.getTime() + (i - 11) * nightLength);
    }

    let quality: 'bullish' | 'bearish' | 'neutral';
    let description: string;

    switch (planet) {
      case 'Jupiter':
      case 'Venus':
      case 'Sun':
        quality = 'bullish';
        description = 'Favorable for expansion and gains';
        break;
      case 'Saturn':
      case 'Mars':
        quality = 'bearish';
        description = 'Exercise caution, potential challenges';
        break;
      default:
        quality = 'neutral';
        description = 'Neutral energy, follow the trend';
    }

    hours.push({
      hour: i,
      startTime,
      endTime,
      planet,
      quality,
      description
    });
  }

  return hours;
};

// ==================== MARKET SENTIMENT ====================

/**
 * Calculate market sentiment based on planetary positions
 */
export const calculateMarketSentiment = (
  positions: PlanetaryPosition[],
  aspects: PlanetaryAspect[],
  lunarPhase: LunarPhase
): MarketSentiment => {
  const factors: Array<{ factor: string; weight: number; contribution: number }> = [];
  
  // Factor 1: Planetary signs (Fire/Air = bullish, Earth/Water = bearish)
  let signScore = 0;
  positions.forEach(pos => {
    const element = ZODIAC_ELEMENTS[pos.sign as keyof typeof ZODIAC_ELEMENTS];
    if (element === 'Fire' || element === 'Air') {
      signScore += pos.retrograde ? 0.5 : 1;
    } else {
      signScore -= pos.retrograde ? 1 : 0.5;
    }
  });
  factors.push({
    factor: 'Planetary Signs',
    weight: 0.25,
    contribution: (signScore / positions.length) * 50 + 50
  });

  // Factor 2: Aspects
  let aspectScore = 0;
  aspects.forEach(aspect => {
    if (aspect.influence === 'bullish') {
      aspectScore += aspect.strength / 100;
    } else if (aspect.influence === 'bearish') {
      aspectScore -= aspect.strength / 100;
    }
  });
  factors.push({
    factor: 'Planetary Aspects',
    weight: 0.35,
    contribution: Math.max(0, Math.min(100, (aspectScore / Math.max(1, aspects.length)) * 50 + 50))
  });

  // Factor 3: Lunar Phase
  const lunarScore = lunarPhase.phase.includes('Waxing') || lunarPhase.phase === 'Full Moon' ? 65 : 35;
  factors.push({
    factor: 'Lunar Phase',
    weight: 0.2,
    contribution: lunarScore
  });

  // Factor 4: Retrograde planets
  const retrogradeCount = positions.filter(p => p.retrograde).length;
  const retrogradeScore = 100 - (retrogradeCount * 15);
  factors.push({
    factor: 'Retrograde Planets',
    weight: 0.2,
    contribution: Math.max(20, retrogradeScore)
  });

  // Calculate final score
  const totalScore = factors.reduce((sum, f) => sum + f.weight * f.contribution, 0);
  
  let direction: 'bullish' | 'bearish' | 'neutral';
  if (totalScore >= 60) direction = 'bullish';
  else if (totalScore <= 40) direction = 'bearish';
  else direction = 'neutral';

  return {
    score: Math.round(totalScore),
    direction,
    confidence: Math.abs(totalScore - 50) * 2,
    factors
  };
};

// ==================== RETROGRADE STATUS ====================

/**
 * Get retrograde status for all planets
 */
export const getRetrogradeStatus = (positions: PlanetaryPosition[]): RetrogradeStatus[] => {
  return positions
    .filter(p => p.planet !== 'Sun' && p.planet !== 'Moon')
    .map(pos => ({
      planet: pos.planet,
      isRetrograde: pos.retrograde,
      startDate: null, // Would require ephemeris data
      endDate: null,
      influence: pos.retrograde 
        ? `${pos.planet} retrograde: Review and reassess ${pos.planet.toLowerCase()} matters`
        : `${pos.planet} direct: Forward momentum in ${pos.planet.toLowerCase()} matters`
    }));
};

// ==================== MASTER ASTRO CALCULATOR ====================

/**
 * Master Astro Calculator - combines all astrological calculations
 */
export const calculateAstroMaster = (date: Date = new Date()): {
  positions: PlanetaryPosition[];
  aspects: PlanetaryAspect[];
  lunarPhase: LunarPhase;
  planetaryHours: PlanetaryHour[];
  sentiment: MarketSentiment;
  retrogrades: RetrogradeStatus[];
  currentHour: PlanetaryHour | null;
} => {
  const positions = calculatePlanetaryPositions(date);
  const aspects = calculatePlanetaryAspects(positions);
  const lunarPhase = calculateLunarPhase(date);
  const planetaryHours = calculatePlanetaryHours(date);
  const sentiment = calculateMarketSentiment(positions, aspects, lunarPhase);
  const retrogrades = getRetrogradeStatus(positions);

  // Find current planetary hour
  const currentHour = planetaryHours.find(h => {
    const now = date.getTime();
    return now >= h.startTime.getTime() && now < h.endTime.getTime();
  }) || null;

  return {
    positions,
    aspects,
    lunarPhase,
    planetaryHours,
    sentiment,
    retrogrades,
    currentHour
  };
};
