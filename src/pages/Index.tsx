import { TradingHeader } from "@/components/TradingHeader";
import { NavigationMenu } from "@/components/NavigationMenu";
import { TradingChart } from "@/components/charts/TradingChart";
import { CalculationDemo } from "@/components/CalculationDemo";
import { GannAnalysisPanel } from "@/components/GannAnalysisPanel";
import { GannGeometryPanel } from "@/components/GannGeometryPanel";
import { SignalPanel } from "@/components/SignalPanel";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import { PlanetaryPanel } from "@/components/PlanetaryPanel";
import { TimeCyclesPanel } from "@/components/TimeCyclesPanel";
import { PatternRecognitionPanel } from "@/components/PatternRecognitionPanel";
import { ForecastPanel } from "@/components/ForecastPanel";
import { SupplyDemandPanel } from "@/components/SupplyDemandPanel";
import { OptionsPanel } from "@/components/OptionsPanel";
import { PositionSizePanel } from "@/components/PositionSizePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Comprehensive mock data based on the institutional output template
const mockData = {
  header: {
    symbol: "BTCUSD",
    broker: "Binance Futures, MetaTrader 5",
    accountBalance: 100000,
    riskPerTrade: 2,
    leverage: 5,
    lotSize: 0.19,
    timestamp: "2025-11-05 15:25:00 UTC",
  },
  gann: {
    supports: [103500, 103800, 104100],
    resistances: [104500, 104800, 105100],
    position: 0.68,
    angles: [
      { angle: "1x1", level: 104200, strength: 0.93, confidence: 0.93 },
      { angle: "2x1", level: 104300, strength: 0.89, confidence: 0.89 },
      { angle: "1x2", level: 104700, strength: 0.91, confidence: 0.91 },
      { angle: "3x1", level: 105200, strength: 0.85, confidence: 0.85 },
      { angle: "1x3", level: 104000, strength: 0.87, confidence: 0.87 },
    ],
  },
  gannGeometry: {
    squares: [
      {
        name: "Square of 52 (Weekly Cycle)",
        type: "Weekly",
        midpoint: 104600,
        note: "equilibrium pivot",
      },
      {
        name: "Square of 144 (Daily Time Spiral)",
        type: "Daily",
        target: 105100,
        note: "360° rotation target resistance",
      },
      {
        name: "Square of 360 (Full Year Vibration)",
        type: "Yearly",
        target: 105500,
        note: "full cycle completion",
      },
    ],
    square90Levels: [
      { degree: 90, price: 103800, type: "support" as const },
      { degree: 180, price: 104500, type: "resistance" as const },
      { degree: 270, price: 105100, type: "reversal" as const },
    ],
    hexagonLevels: [
      { degree: 60, price: 103800, type: "support harmonic" },
      { degree: 120, price: 104500, type: "resistance harmonic" },
      { degree: 180, price: 105100, type: "full hexagon pivot" },
    ],
    gannFanAngles: [
      { ratio: "8x1", price: 104000, slope: 82, type: "support" as const },
      { ratio: "4x1", price: 104100, slope: 76, type: "support" as const },
      { ratio: "1x1", price: 104200, slope: 45, type: "support" as const },
      { ratio: "2x1", price: 104300, slope: 26.5, type: "support" as const },
      { ratio: "1x2", price: 104700, slope: 63.5, type: "resistance" as const },
      { ratio: "3x1", price: 105200, slope: 18, type: "resistance" as const },
      { ratio: "1x3", price: 104000, slope: 18.4, type: "support" as const },
      { ratio: "1x4", price: 104150, slope: 14, type: "resistance" as const },
      { ratio: "1x8", price: 104050, slope: 7, type: "resistance" as const },
    ],
  },
  signal: {
    direction: "BUY" as const,
    strength: 0.91,
    confidence: 0.82,
    entry: 104525,
    stopLoss: 103700,
    takeProfit: 105000,
    riskReward: 2.3,
  },
  timeCycles: {
    cycles: [
      { period: "1 hari", confidence: 0, status: "muted" as const },
      { period: "7 hari", confidence: 0.88, status: "active" as const },
      { period: "21 hari", confidence: 0.96, status: "active" as const },
      { period: "30 hari", confidence: 0, status: "muted" as const },
      { period: "90 hari", confidence: 0.92, status: "active" as const },
    ],
    dominantPeriod: 24.0,
    amplitude: "tinggi",
    phase: 0.85,
    interpretation: "Ada high-probability window untuk rally ke 104,700 lalu reversal minor sebelum akhir siklus 30 hari.",
  },
  patterns: {
    patterns: [
      {
        name: "Bullish Engulfing",
        type: "Candlestick",
        confidence: 0.88,
        priceRange: "Konfirmasi: 104,100",
        timeWindow: "valid pada 2025-11-04 15:25:00–16:25:00 UTC",
      },
      {
        name: "Morning Star",
        type: "Candlestick",
        confidence: 0.80,
        priceRange: "Level: 104,325",
        timeWindow: "2025-11-03 → 2025-11-04 (daily close)",
      },
      {
        name: "Elliott Wave — Wave 3 (impulse)",
        type: "Wave Structure",
        confidence: 0.85,
        priceRange: "Target: 104,700",
        timeWindow: "next 7–14 days (peak ~2025-11-11)",
      },
      {
        name: "Gann Wave — Uptrend Cycle 3",
        type: "Time–Price Wave",
        confidence: 0.83,
        priceRange: "Projection: 105,500 (reversal area)",
        timeWindow: "~2025-11-16 ±6–12 hours",
      },
      {
        name: "Harmonic AB=CD (confluence)",
        type: "Harmonic Pattern",
        confidence: 0.76,
        priceRange: "Range: 103,800 → 104,700",
        timeWindow: "5–8 days to completion",
      },
    ],
    summary: [
      "Bullish Engulfing pada 104,100 (konfirmasi intraday 2025-11-04 15:25:00 UTC) memberikan sinyal masuk awal.",
      "Morning Star pada area 104,325 memperkuat setup bagi Wave 3 impulsif — target terukur 104,700 dalam 7–14 hari.",
      "Gann Wave menunjuk reversal window kuat sekitar 2025-11-16 (target 105,500) — gunakan untuk manajemen TP bagian/scale-out.",
    ],
  },
  ehlers: {
    indicators: [
      { name: "Fisher Transform", signal: "Bullish Cross", value: "1.33", confidence: 0.93 },
      { name: "Smoothed RSI", signal: "Bullish", value: "67.2", confidence: 0.87 },
      { name: "Super Smoother", signal: "Trend Up", value: "+0.024", confidence: 0.85 },
      { name: "MAMA (MESA Adaptive)", signal: "Bullish", value: "104,400", confidence: 0.90 },
      { name: "Instantaneous Trendline", signal: "Uptrend", value: "104,100", confidence: 0.89 },
      { name: "Cyber Cycle", signal: "Rising", value: "+0.026", confidence: 0.86 },
      { name: "Dominant Cycle", signal: "Strong", value: "24.0 hari", confidence: 0.96 },
      { name: "Sinewave Indicator", signal: "Bullish phase", value: "+0.021", confidence: 0.84 },
      { name: "Roofing Filter", signal: "Uptrend noise", value: "+0.017", confidence: 0.80 },
      { name: "Decycler", signal: "Bullish", value: "+0.028", confidence: 0.82 },
    ],
    compositeScore: 0.88,
  },
  ml: {
    indicators: [
      { name: "XGBoost", signal: "Bullish", value: "104,700", confidence: 0.86 },
      { name: "Random Forest", signal: "Bullish", value: "104,650", confidence: 0.84 },
      { name: "LSTM", signal: "Bullish", value: "104,720", confidence: 0.89 },
      { name: "Neural ODE", signal: "Bullish", value: "104,680", confidence: 0.85 },
      { name: "Gradient Boosting", signal: "Bullish", value: "104,710", confidence: 0.87 },
      { name: "LightGBM", signal: "Bullish", value: "104,695", confidence: 0.85 },
      { name: "Hybrid Meta-Model", signal: "Bullish", value: "104,700", confidence: 0.88 },
    ],
    compositeScore: 0.88,
  },
  planetary: {
    bullishAspects: [
      { aspect: "Jupiter–Venus Trine (120°)", score: 0.42 },
      { aspect: "Mercury–Neptune Sextile (60°)", score: 0.32 },
    ],
    bearishAspects: [{ aspect: "Saturn–Mars Square (90°)", score: -0.38 }],
    totalScore: 0.36,
    planets: [
      { name: "Jupiter", sign: "Leo", degree: 128, note: "±5° dari 120° → vibrasi positif" },
      { name: "Venus", sign: "Cancer", degree: 98, note: "±5° dari 90° → harmonik" },
      { name: "Saturn", sign: "Libra", degree: 188, note: "±5° dari 180° → tekanan reversal" },
    ],
    retrograde: [
      { planet: "Mercury", period: "2025-11-01 → 2025-11-25", note: "volatilitas tinggi, false breakout risk" },
      { planet: "Saturn", period: "2025-06-30 → 2025-11-15", note: "penundaan/drag tren makro" },
    ],
  },
  forecast: {
    shortTerm: [
      { date: "2025-11-05", price: 104652, probability: 0.62, note: "1x1 angle support" },
      { date: "2025-11-06", price: 104976, probability: 0.67, note: "Square of 9 confluence" },
      { date: "2025-11-07", price: 104679, probability: 0.60, note: "2x1 angle test" },
      { date: "2025-11-08", price: 104998, probability: 0.65, note: "Square of 90 harmonic" },
      { date: "2025-11-09", price: 105322, probability: 0.70, note: "1x2 angle confluence" },
      { date: "2025-11-12", price: 105105, probability: 0.75, note: "ATH window; quarter harmonic" },
    ],
    athAtl: [
      {
        type: "ATH" as const,
        date: "2025-11-12 10:00 UTC",
        price: 105105,
        confidence: 0.86,
        reversal: { date: "2025-11-16 13:40 UTC", price: 105505 },
        aspect: "Mercury–Neptune Sextile (support)",
        gannNote: "Quarter harmonic (Square of 90) + 1x2 angle confluence",
      },
      {
        type: "ATL" as const,
        date: "2025-11-16 13:40 UTC",
        price: 104304,
        confidence: 0.71,
        reversal: { date: "2025-11-19 09:10 UTC", price: 104679 },
        aspect: "Moon square Pluto (tekanan minor)",
        gannNote: "300° cycle rotation with 1x3 angle support",
      },
      {
        type: "ATH" as const,
        date: "2026-03-15 10:00 UTC",
        price: 150000,
        confidence: 0.87,
        reversal: { date: "2026-06-30 13:40 UTC", price: 165000 },
        aspect: "Jupiter–Venus Trine (support)",
        gannNote: "Quarter harmonic (Square of 90) + 1x2 angle confluence",
      },
      {
        type: "ATH" as const,
        date: "2028-05-01 13:40 UTC",
        price: 250000,
        confidence: 0.76,
        reversal: { date: "2028-12-31 23:59 UTC", price: 280000 },
        aspect: "N/A",
        gannNote: "Post-halving peak; full Gann hexagon pivot",
      },
      {
        type: "ATL" as const,
        date: "2029-10-01 11:20 UTC",
        price: 220000,
        confidence: 0.73,
        reversal: { date: "2029-12-31 23:59 UTC", price: 360000 },
        aspect: "Saturn–Mars Square (tekanan)",
        gannNote: "Bear cycle completion; Square of 52 retest",
      },
    ],
  },
  supplyDemand: {
    zones: [
      {
        name: "Demand",
        range: "103,500 – 103,800",
        type: "Accumulation",
        strength: "Strong",
        note: "Square of 9 + 1x3 angle confluence",
      },
      {
        name: "Supply",
        range: "104,500 – 105,100",
        type: "Distribution",
        strength: "Strong",
        note: "Square of 90 + 3x1 angle confluence",
      },
      {
        name: "Mid-Range",
        range: "104,525",
        type: "Equilibrium",
        strength: "Neutral",
        note: "Square of 52 pivot balance point",
      },
    ],
  },
  options: {
    bias: "CALL",
    delta: 0.32,
    expiry: "~14d",
    ivr: 0.45,
    recommendation: {
      type: "BTCUSD-Call",
      strike: 105000,
      premium: 145.30,
    },
    riskReward: 2.2,
  },
  positionSize: {
    accountEquity: 100000,
    riskPerTrade: 2,
    riskAmount: 2000,
    dollarPerPoint: 1,
    stopDistance: 825,
    riskPerLot: 825,
    calculatedLotSize: 2.42,
    adjustedLotSize: 0.19,
    leverage: 5,
    entry: 104525,
    stopLoss: 103700,
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavigationMenu />
      
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6 space-y-4 animate-fade-in">
        <TradingHeader {...mockData.header} />
        
        <TradingChart />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid mb-4 hover-glow transition-all">
            <TabsTrigger value="overview" className="transition-all hover-scale">Overview</TabsTrigger>
            <TabsTrigger value="calculations" className="transition-all hover-scale">Calculations</TabsTrigger>
            <TabsTrigger value="advanced" className="transition-all hover-scale">Advanced Analysis</TabsTrigger>
            <TabsTrigger value="forecasting" className="transition-all hover-scale">Forecasting</TabsTrigger>
            <TabsTrigger value="risk" className="transition-all hover-scale">Risk & Position</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 space-y-4">
                <GannAnalysisPanel {...mockData.gann} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <IndicatorGrid 
                    title="📡 John F. Ehlers' Digital Filters" 
                    indicators={mockData.ehlers.indicators}
                    compositeScore={mockData.ehlers.compositeScore}
                  />
                  
                  <IndicatorGrid 
                    title="🤖 Machine Learning Predictions" 
                    indicators={mockData.ml.indicators}
                    compositeScore={mockData.ml.compositeScore}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <SignalPanel {...mockData.signal} />
                
                <div className="bg-card border border-border rounded-lg p-6 hover-glow transition-all animate-fade-in">
                  <h3 className="text-lg font-bold text-foreground mb-4 gradient-text">Backend Integration</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
                      <p className="text-muted-foreground mb-1">API Endpoint</p>
                      <code className="text-xs font-mono text-primary break-all">
                        http://localhost:8000/api/analysis
                      </code>
                    </div>
                    
                    <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
                      <p className="text-muted-foreground mb-1">WebSocket</p>
                      <code className="text-xs font-mono text-primary break-all">
                        ws://localhost:8000/ws/live-feed
                      </code>
                    </div>
                    
                    <div className="p-3 bg-status-info/10 border border-status-info/30 rounded hover-scale transition-all">
                      <p className="text-xs text-muted-foreground">
                        Connect this UI to your Python backend by implementing the API calls in the components.
                        Current data shown is mock data for demonstration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calculations" className="space-y-4 animate-fade-in">
            <CalculationDemo />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GannGeometryPanel {...mockData.gannGeometry} />
              <TimeCyclesPanel {...mockData.timeCycles} />
              <PatternRecognitionPanel {...mockData.patterns} />
              <PlanetaryPanel {...mockData.planetary} />
            </div>
          </TabsContent>
          
          <TabsContent value="forecasting" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ForecastPanel 
                shortTermForecast={mockData.forecast.shortTerm}
                athAtlEvents={mockData.forecast.athAtl.slice(0, 2)}
              />
              
              <div className="space-y-4">
                <ForecastPanel 
                  shortTermForecast={[]}
                  athAtlEvents={mockData.forecast.athAtl.slice(2)}
                />
                <SupplyDemandPanel {...mockData.supplyDemand} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PositionSizePanel {...mockData.positionSize} />
              <OptionsPanel {...mockData.options} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
