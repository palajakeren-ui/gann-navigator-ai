/**
 * Astrological Calculation Engine for Financial Markets
 * Planetary cycles and aspects affecting market behavior
 */

export interface PlanetaryPosition {
  planet: string;
  longitude: number;
  sign: string;
  house: number;
  retrograde: boolean;
}

export interface PlanetaryAspect {
  planet1: string;
  planet2: string;
  aspect: string;
  angle: number;
  orb: number;
  influence: string;
}

/**
 * Calculate planetary positions (simplified ephemeris)
 */
export const calculatePlanetaryPositions = (date: Date): PlanetaryPosition[] => {
  const daysSinceEpoch = Math.floor((date.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24));
  
  const planets = [
    { name: "Sun", period: 365.25, basePos: 280 },
    { name: "Moon", period: 27.32, basePos: 130 },
    { name: "Mercury", period: 87.97, basePos: 240 },
    { name: "Venus", period: 224.7, basePos: 320 },
    { name: "Mars", period: 686.98, basePos: 30 },
    { name: "Jupiter", period: 4332.59, basePos: 120 },
    { name: "Saturn", period: 10759.22, basePos: 200 },
    { name: "Uranus", period: 30688.5, basePos: 15 },
    { name: "Neptune", period: 60182, basePos: 330 },
  ];

  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  return planets.map(planet => {
    const longitude = (planet.basePos + (daysSinceEpoch / planet.period) * 360) % 360;
    const sign = zodiacSigns[Math.floor(longitude / 30)];
    const house = Math.floor(longitude / 30) + 1;
    const retrograde = Math.random() > 0.85; // Simplified retrograde detection

    return {
      planet: planet.name,
      longitude: Math.round(longitude * 100) / 100,
      sign,
      house,
      retrograde
    };
  });
};

/**
 * Calculate aspects between planets
 */
export const calculatePlanetaryAspects = (positions: PlanetaryPosition[]): PlanetaryAspect[] => {
  const aspects: PlanetaryAspect[] = [];
  const aspectTypes = [
    { name: "Conjunction", angle: 0, orb: 8, influence: "Strong" },
    { name: "Sextile", angle: 60, orb: 6, influence: "Positive" },
    { name: "Square", angle: 90, orb: 8, influence: "Challenging" },
    { name: "Trine", angle: 120, orb: 8, influence: "Harmonious" },
    { name: "Opposition", angle: 180, orb: 8, influence: "Tension" },
  ];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const angle = Math.abs(positions[i].longitude - positions[j].longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      for (const aspectType of aspectTypes) {
        if (Math.abs(normalizedAngle - aspectType.angle) <= aspectType.orb) {
          aspects.push({
            planet1: positions[i].planet,
            planet2: positions[j].planet,
            aspect: aspectType.name,
            angle: Math.round(normalizedAngle * 100) / 100,
            orb: Math.round(Math.abs(normalizedAngle - aspectType.angle) * 100) / 100,
            influence: aspectType.influence,
          });
        }
      }
    }
  }

  return aspects;
};

/**
 * Calculate lunar phases and their market influence
 */
export const calculateLunarPhase = (date: Date): { phase: string; percentage: number; influence: string } => {
  const knownNewMoon = new Date('2000-01-06');
  const lunarCycle = 29.53059; // days
  const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = (daysSinceNewMoon % lunarCycle) / lunarCycle;
  
  let phase: string;
  let influence: string;
  
  if (cyclePosition < 0.125) {
    phase = "New Moon";
    influence = "New Beginnings";
  } else if (cyclePosition < 0.25) {
    phase = "Waxing Crescent";
    influence = "Growth Phase";
  } else if (cyclePosition < 0.375) {
    phase = "First Quarter";
    influence = "Action Required";
  } else if (cyclePosition < 0.5) {
    phase = "Waxing Gibbous";
    influence = "Refinement";
  } else if (cyclePosition < 0.625) {
    phase = "Full Moon";
    influence = "Peak Activity";
  } else if (cyclePosition < 0.75) {
    phase = "Waning Gibbous";
    influence = "Reflection";
  } else if (cyclePosition < 0.875) {
    phase = "Last Quarter";
    influence = "Release";
  } else {
    phase = "Waning Crescent";
    influence = "Rest Phase";
  }

  return {
    phase,
    percentage: Math.round(cyclePosition * 100),
    influence,
  };
};

/**
 * Calculate planetary hours for intraday trading
 */
export const calculatePlanetaryHours = (date: Date): Array<{ hour: number; planet: string; quality: string }> => {
  const planetaryRulers = ["Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars"];
  const qualities = ["Leadership", "Harmony", "Communication", "Emotion", "Structure", "Expansion", "Action"];
  
  const dayOfWeek = date.getDay();
  const startPlanet = planetaryRulers[dayOfWeek];
  const startIndex = planetaryRulers.indexOf(startPlanet);

  const hours = [];
  for (let i = 0; i < 24; i++) {
    const planetIndex = (startIndex + i) % 7;
    hours.push({
      hour: i,
      planet: planetaryRulers[planetIndex],
      quality: qualities[planetIndex],
    });
  }

  return hours;
};

/**
 * Calculate market sentiment based on planetary positions
 */
export const calculateMarketSentiment = (positions: PlanetaryPosition[]): { sentiment: string; score: number; description: string } => {
  let bullishCount = 0;
  let bearishCount = 0;

  positions.forEach(pos => {
    // Fire signs (Aries, Leo, Sagittarius) = Bullish
    if (["Aries", "Leo", "Sagittarius"].includes(pos.sign)) {
      bullishCount += pos.retrograde ? 0.5 : 1;
    }
    // Earth signs (Taurus, Virgo, Capricorn) = Neutral to Bearish
    if (["Taurus", "Virgo", "Capricorn"].includes(pos.sign)) {
      bearishCount += pos.retrograde ? 1 : 0.5;
    }
    // Air signs (Gemini, Libra, Aquarius) = Bullish
    if (["Gemini", "Libra", "Aquarius"].includes(pos.sign)) {
      bullishCount += pos.retrograde ? 0.5 : 1;
    }
    // Water signs (Cancer, Scorpio, Pisces) = Bearish
    if (["Cancer", "Scorpio", "Pisces"].includes(pos.sign)) {
      bearishCount += pos.retrograde ? 1 : 0.5;
    }
  });

  const totalCount = bullishCount + bearishCount;
  const score = Math.round((bullishCount / totalCount) * 100);

  let sentiment: string;
  let description: string;

  if (score >= 70) {
    sentiment = "Strong Bull";
    description = "Planetary alignments favor upward momentum";
  } else if (score >= 55) {
    sentiment = "Moderate Bull";
    description = "Positive planetary influences dominate";
  } else if (score >= 45) {
    sentiment = "Neutral";
    description = "Balanced planetary forces";
  } else if (score >= 30) {
    sentiment = "Moderate Bear";
    description = "Negative planetary influences present";
  } else {
    sentiment = "Strong Bear";
    description = "Planetary alignments suggest downward pressure";
  }

  return { sentiment, score, description };
};
