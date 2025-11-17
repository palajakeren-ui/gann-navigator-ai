import { TradingHeader } from "@/components/TradingHeader";
import { GannAnalysisPanel } from "@/components/GannAnalysisPanel";
import { SignalPanel } from "@/components/SignalPanel";
import { IndicatorGrid } from "@/components/IndicatorGrid";
import { PlanetaryPanel } from "@/components/PlanetaryPanel";
import { ForecastPanel } from "@/components/ForecastPanel";

// Mock data - in production this will come from your Python backend
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
  signal: {
    direction: "BUY" as const,
    strength: 0.91,
    confidence: 0.82,
    entry: 104525,
    stopLoss: 103700,
    takeProfit: 105000,
    riskReward: 2.3,
  },
  ehlers: {
    indicators: [
      { name: "Fisher Transform", signal: "Bullish Cross", value: "1.33", confidence: 0.93 },
      { name: "Smoothed RSI", signal: "Bullish", value: "67.2", confidence: 0.87 },
      { name: "Super Smoother", signal: "Trend Up", value: "+0.024", confidence: 0.85 },
      { name: "MAMA", signal: "Bullish", value: "104,400", confidence: 0.90 },
      { name: "Cyber Cycle", signal: "Rising", value: "+0.026", confidence: 0.86 },
      { name: "Sinewave", signal: "Bullish phase", value: "+0.021", confidence: 0.84 },
    ],
    compositeScore: 0.88,
  },
  ml: {
    indicators: [
      { name: "XGBoost", signal: "Bullish", value: "104,700", confidence: 0.86 },
      { name: "Random Forest", signal: "Bullish", value: "104,650", confidence: 0.84 },
      { name: "LSTM", signal: "Bullish", value: "104,720", confidence: 0.89 },
      { name: "Neural ODE", signal: "Bullish", value: "104,680", confidence: 0.85 },
      { name: "Hybrid Meta", signal: "Bullish", value: "104,700", confidence: 0.88 },
    ],
    compositeScore: 0.88,
  },
  planetary: {
    bullishAspects: [
      { aspect: "Jupiter–Venus Trine (120°)", score: 0.42 },
      { aspect: "Mercury–Neptune Sextile (60°)", score: 0.32 },
    ],
    bearishAspects: [
      { aspect: "Saturn–Mars Square (90°)", score: -0.38 },
    ],
    totalScore: 0.36,
    planets: [
      { name: "Jupiter", sign: "Leo", degree: 128, note: "±5° dari 120° → vibrasi positif" },
      { name: "Venus", sign: "Cancer", degree: 98, note: "±5° dari 90° → harmonik" },
      { name: "Saturn", sign: "Libra", degree: 188, note: "±5° dari 180° → tekanan reversal" },
    ],
    retrograde: [
      { planet: "Mercury", period: "2025-11-01 → 2025-11-25", note: "volatilitas tinggi" },
      { planet: "Saturn", period: "2025-06-30 → 2025-11-15", note: "penundaan tren makro" },
    ],
  },
  forecast: {
    shortTerm: [
      { date: "2025-11-05", price: 104652, probability: 0.62, note: "1x1 angle support" },
      { date: "2025-11-06", price: 104976, probability: 0.67, note: "Square of 9 confluence" },
      { date: "2025-11-07", price: 104679, probability: 0.60, note: "2x1 angle test" },
      { date: "2025-11-08", price: 104998, probability: 0.65, note: "Square of 90 harmonic" },
      { date: "2025-11-09", price: 105322, probability: 0.70, note: "1x2 angle confluence" },
      { date: "2025-11-12", price: 105105, probability: 0.75, note: "ATH window" },
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
    ],
  },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4">
        <TradingHeader {...mockData.header} />
        
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
            
            <PlanetaryPanel {...mockData.planetary} />
            
            <ForecastPanel 
              shortTermForecast={mockData.forecast.shortTerm}
              athAtlEvents={mockData.forecast.athAtl}
            />
          </div>
          
          <div className="space-y-4">
            <SignalPanel {...mockData.signal} />
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Backend Integration</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-secondary/30 rounded">
                  <p className="text-muted-foreground mb-1">API Endpoint</p>
                  <code className="text-xs font-mono text-primary break-all">
                    http://localhost:8000/api/analysis
                  </code>
                </div>
                
                <div className="p-3 bg-secondary/30 rounded">
                  <p className="text-muted-foreground mb-1">WebSocket</p>
                  <code className="text-xs font-mono text-primary break-all">
                    ws://localhost:8000/ws/live-feed
                  </code>
                </div>
                
                <div className="p-3 bg-status-info/10 border border-status-info/30 rounded">
                  <p className="text-xs text-muted-foreground">
                    Connect this UI to your Python backend by implementing the API calls in the components.
                    Current data shown is mock data for demonstration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
