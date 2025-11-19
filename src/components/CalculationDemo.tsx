import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Moon, TrendingUp, Activity } from "lucide-react";
import { 
  calculateGannAngles, 
  calculateSquareOfNine, 
  calculateFibonacciLevels,
  calculateTimeCycles
} from "@/lib/calculations/gannCalculator";
import {
  calculatePlanetaryPositions,
  calculatePlanetaryAspects,
  calculateLunarPhase,
  calculateMarketSentiment
} from "@/lib/calculations/astroCalculator";
import {
  calculateSMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  detectPatterns
} from "@/lib/calculations/technicalIndicators";

export const CalculationDemo = () => {
  const [gannResults, setGannResults] = useState<any>(null);
  const [astroResults, setAstroResults] = useState<any>(null);
  const [technicalResults, setTechnicalResults] = useState<any>(null);

  useEffect(() => {
    // Sample price data
    const currentPrice = 50000;
    const currentTime = Date.now();
    const prices = Array.from({ length: 50 }, (_, i) => 50000 + Math.sin(i * 0.3) * 5000 + Math.random() * 1000);

    // Gann calculations
    const gannAngles = calculateGannAngles(currentPrice, currentTime);
    const squareOfNine = calculateSquareOfNine(currentPrice);
    const fibLevels = calculateFibonacciLevels(55000, 45000);
    const timeCycles = calculateTimeCycles(new Date());

    setGannResults({ gannAngles, squareOfNine, fibLevels, timeCycles });

    // Astro calculations
    const positions = calculatePlanetaryPositions(new Date());
    const aspects = calculatePlanetaryAspects(positions);
    const lunarPhase = calculateLunarPhase(new Date());
    const sentiment = calculateMarketSentiment(positions);

    setAstroResults({ positions, aspects, lunarPhase, sentiment });

    // Technical indicators
    const sma20 = calculateSMA(prices, 20);
    const rsi = calculateRSI(prices, 14);
    const macd = calculateMACD(prices);
    const bollinger = calculateBollingerBands(prices, 20, 2);
    const patterns = detectPatterns(prices);

    setTechnicalResults({ sma20, rsi, macd, bollinger, patterns, prices });
  }, []);

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary animate-pulse-glow" />
            Live Calculation Engines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gann" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="gann">Gann Analysis</TabsTrigger>
              <TabsTrigger value="astro">Planetary</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            {/* Gann Calculations Tab */}
            <TabsContent value="gann" className="space-y-4 animate-fade-in">
              {gannResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Gann Angles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {gannResults.gannAngles.slice(0, 5).map((angle: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="font-medium">{angle.type}</span>
                            <span className="text-primary">${angle.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Square of Nine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {gannResults.squareOfNine.slice(0, 5).map((square: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span>Level {square.level}</span>
                            <div className="text-right">
                              <div className="text-primary">${square.price.toFixed(0)}</div>
                              <div className="text-xs text-muted-foreground">{square.significance}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Fibonacci Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(gannResults.fibLevels).slice(0, 7).map(([level, price]: [string, any], idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="font-medium">{level}</span>
                            <span className="text-primary">${price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Time Cycles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {gannResults.timeCycles.map((cycle: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <span className="font-medium">{cycle.cycle}</span>
                            <div className="text-right">
                              <div className="text-xs text-primary">{cycle.date.toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">{cycle.significance}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Astro Calculations Tab */}
            <TabsContent value="astro" className="space-y-4 animate-fade-in">
              {astroResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        Planetary Positions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {astroResults.positions.map((pos: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                            <div>
                              <div className="font-medium">{pos.planet}</div>
                              <div className="text-xs text-muted-foreground">{pos.sign}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-primary">{pos.longitude.toFixed(2)}°</div>
                              {pos.retrograde && <div className="text-xs text-orange-500">Retrograde</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Market Sentiment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <div className="text-3xl font-bold gradient-text">{astroResults.sentiment.sentiment}</div>
                          <div className="text-sm text-muted-foreground mt-2">{astroResults.sentiment.description}</div>
                          <div className="mt-4">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all" 
                                style={{ width: `${astroResults.sentiment.score}%` }}
                              />
                            </div>
                            <div className="text-sm mt-1">{astroResults.sentiment.score}% Bullish</div>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="font-medium mb-2">Lunar Phase</div>
                          <div className="flex justify-between items-center">
                            <span className="text-primary">{astroResults.lunarPhase.phase}</span>
                            <span className="text-sm">{astroResults.lunarPhase.percentage}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">{astroResults.lunarPhase.influence}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm">Planetary Aspects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {astroResults.aspects.slice(0, 8).map((aspect: any, idx: number) => (
                          <div key={idx} className="p-2 bg-muted/30 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">{aspect.planet1} {aspect.aspect} {aspect.planet2}</div>
                                <div className="text-xs text-muted-foreground">{aspect.influence}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-primary">{aspect.angle.toFixed(1)}°</div>
                                <div className="text-xs text-muted-foreground">Orb: {aspect.orb.toFixed(1)}°</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Technical Indicators Tab */}
            <TabsContent value="technical" className="space-y-4 animate-fade-in">
              {technicalResults && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Moving Averages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">SMA 20</span>
                            <span className="text-primary">
                              ${technicalResults.sma20[technicalResults.sma20.length - 1]?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Current Price</span>
                            <span className="text-primary">
                              ${technicalResults.prices[technicalResults.prices.length - 1]?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">RSI (14)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-3xl font-bold gradient-text">
                            {technicalResults.rsi[technicalResults.rsi.length - 1]?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {(technicalResults.rsi[technicalResults.rsi.length - 1] || 0) > 70 ? 'Overbought' : 
                             (technicalResults.rsi[technicalResults.rsi.length - 1] || 0) < 30 ? 'Oversold' : 'Neutral'}
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all" 
                            style={{ width: `${technicalResults.rsi[technicalResults.rsi.length - 1] || 0}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">MACD</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <span>MACD Line</span>
                          <span className="text-primary">
                            {technicalResults.macd.macd[technicalResults.macd.macd.length - 1]?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <span>Signal Line</span>
                          <span className="text-primary">
                            {technicalResults.macd.signal[technicalResults.macd.signal.length - 1]?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted/30 rounded">
                          <span>Histogram</span>
                          <span className="text-primary">
                            {technicalResults.macd.histogram[technicalResults.macd.histogram.length - 1]?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Pattern Detection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {technicalResults.patterns.length > 0 ? (
                          technicalResults.patterns.map((pattern: any, idx: number) => (
                            <div key={idx} className="p-2 bg-muted/30 rounded">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-sm">{pattern.pattern}</div>
                                  <div className="text-xs text-muted-foreground">{pattern.description}</div>
                                </div>
                                <div className="text-xs text-primary">{pattern.confidence}%</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground text-center p-4">
                            No patterns detected in current data
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
