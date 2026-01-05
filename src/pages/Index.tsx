import { useState, useEffect } from "react";
import { TradingHeader } from "@/components/TradingHeader";
import { NavigationMenu } from "@/components/NavigationMenu";
import { TradingChart } from "@/components/charts/TradingChart";
import { LiveMarketCard } from "@/components/dashboard/LiveMarketCard";
import { SignalStrengthCard } from "@/components/dashboard/SignalStrengthCard";
import { GannLevelsCard } from "@/components/dashboard/GannLevelsCard";
import { PlanetaryCard } from "@/components/dashboard/PlanetaryCard";
import { EhlersIndicatorsCard } from "@/components/dashboard/EhlersIndicatorsCard";
import { MLPredictionsCard } from "@/components/dashboard/MLPredictionsCard";
import { MarketHeatMap } from "@/components/dashboard/MarketHeatMap";
import { QuickTradeCard } from "@/components/dashboard/QuickTradeCard";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { PerformanceCard } from "@/components/dashboard/PerformanceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  useRealTimeData, 
  useGannLevels, 
  useSignalGenerator, 
  usePlanetaryData, 
  useEhlersIndicators, 
  useMLPredictions 
} from "@/hooks/useRealTimeData";
import { 
  TrendingUp, TrendingDown, Activity, Target, Clock, 
  RefreshCw, Wifi, Settings, BarChart3, Calendar,
  Sparkles, Moon, Brain, Zap, Shield, Layout, Maximize2
} from "lucide-react";

const timeframes = [
  { label: "1M", value: "M1" },
  { label: "5M", value: "M5" },
  { label: "15M", value: "M15" },
  { label: "30M", value: "M30" },
  { label: "1H", value: "H1" },
  { label: "4H", value: "H4" },
  { label: "1D", value: "D1" },
  { label: "1W", value: "W1" },
  { label: "1MO", value: "MN" },
];

const watchlist = [
  { symbol: "BTCUSD", name: "Bitcoin", basePrice: 104525 },
  { symbol: "ETHUSD", name: "Ethereum", basePrice: 3890 },
  { symbol: "XAUUSD", name: "Gold", basePrice: 2045 },
  { symbol: "EURUSD", name: "Euro/USD", basePrice: 1.0875 },
  { symbol: "SOLUSD", name: "Solana", basePrice: 156 },
  { symbol: "GBPUSD", name: "GBP/USD", basePrice: 1.2654 },
];

const Index = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("H4");
  const [activeSymbol, setActiveSymbol] = useState("BTCUSD");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [layoutMode, setLayoutMode] = useState<"compact" | "full">("full");

  // Real-time data hooks
  const { data: marketData, isConnected } = useRealTimeData(activeSymbol, 104525, 2000);
  const gannLevels = useGannLevels(marketData.price);
  const signal = useSignalGenerator(marketData, gannLevels);
  const planetaryData = usePlanetaryData();
  const { indicators: ehlersIndicators, compositeScore: ehlersScore } = useEhlersIndicators([]);
  const { predictions: mlPredictions, compositeScore: mlScore, consensusPrice } = useMLPredictions();

  useEffect(() => {
    const timer = setInterval(() => setLastUpdate(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate overall confluence score
  const calculateConfluenceScore = () => {
    const scores = [
      signal?.strength || 0,
      signal?.confidence || 0,
      ehlersScore,
      mlScore,
      planetaryData.totalScore > 0 ? 0.6 + planetaryData.totalScore : 0.4,
    ];
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const confluenceScore = calculateConfluenceScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <NavigationMenu />
      
      <div className="max-w-[1920px] mx-auto p-4 lg:p-6 space-y-4 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">GANN AI Trading Dashboard</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span>Institutional Analysis System</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-success animate-pulse" />
                    <span className="text-success">Live</span>
                  </>
                ) : (
                  <span className="text-destructive">Disconnected</span>
                )}
              </span>
              <span>•</span>
              <span>Last: {lastUpdate.toLocaleTimeString()}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={activeSymbol} onValueChange={setActiveSymbol}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {watchlist.map(item => (
                  <SelectItem key={item.symbol} value={item.symbol}>
                    {item.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-1 bg-secondary/30 p-1 rounded-lg overflow-x-auto max-w-[400px]">
              {timeframes.map(tf => (
                <Button
                  key={tf.value}
                  variant={activeTimeframe === tf.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTimeframe(tf.value)}
                  className="h-7 px-2 text-xs shrink-0"
                >
                  {tf.label}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setLayoutMode(prev => prev === "compact" ? "full" : "compact")}
            >
              {layoutMode === "compact" ? <Maximize2 className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
            </Button>
            
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-bold">${marketData.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              {marketData.changePercent >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Signal</p>
                <p className={`text-lg font-bold ${
                  signal?.direction === 'BUY' ? 'text-success' : 
                  signal?.direction === 'SELL' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {signal?.direction || 'WAIT'}
                </p>
              </div>
              <Target className="w-5 h-5 text-primary" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Confluence</p>
                <p className="text-lg font-bold text-primary">{(confluenceScore * 100).toFixed(0)}%</p>
              </div>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Strength</p>
                <p className="text-lg font-bold text-accent">{((signal?.strength || 0) * 100).toFixed(0)}%</p>
              </div>
              <Zap className="w-5 h-5 text-accent" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ehlers</p>
                <p className="text-lg font-bold text-success">{(ehlersScore * 100).toFixed(0)}%</p>
              </div>
              <Activity className="w-5 h-5 text-success" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">ML Score</p>
                <p className="text-lg font-bold text-accent">{(mlScore * 100).toFixed(0)}%</p>
              </div>
              <Brain className="w-5 h-5 text-accent" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Astro</p>
                <p className={`text-lg font-bold ${planetaryData.totalScore >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {planetaryData.totalScore >= 0 ? '+' : ''}{planetaryData.totalScore.toFixed(2)}
                </p>
              </div>
              <Moon className="w-5 h-5 text-primary" />
            </div>
          </Card>
          
          <Card className="p-3 hover-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Risk</p>
                <p className="text-lg font-bold text-success">LOW</p>
              </div>
              <Shield className="w-5 h-5 text-success" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid mb-4 hover-glow transition-all">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="indicators" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Indicators
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Risk
            </TabsTrigger>
            <TabsTrigger value="trade" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Trade
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 animate-fade-in">
            {/* Chart + Signal Panel */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              <div className="xl:col-span-3 space-y-4">
                <TradingChart />
                
                {/* Market Watchlist */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                  {watchlist.map(item => (
                    <LiveMarketCard 
                      key={item.symbol}
                      symbol={item.symbol}
                      basePrice={item.basePrice}
                      name={item.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <SignalStrengthCard signal={signal} />
                <AlertsCard />
                <PerformanceCard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <GannLevelsCard levels={gannLevels} currentPrice={marketData.price} />
              <PlanetaryCard planetaryData={planetaryData} />
              
              {/* Time Cycles */}
              <Card className="hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Time Cycles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { cycle: '7-Day', confidence: 0.88, daysRemaining: 3 },
                    { cycle: '21-Day', confidence: 0.96, daysRemaining: 12 },
                    { cycle: '90-Day (Quarter)', confidence: 0.92, daysRemaining: 45 },
                    { cycle: '360-Day', confidence: 0.78, daysRemaining: 180 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.cycle}</p>
                        <p className="text-xs text-muted-foreground">{item.daysRemaining} days to target</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.confidence * 100} className="w-16 h-2" />
                        <Badge variant="outline">{(item.confidence * 100).toFixed(0)}%</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Square of 9 Quick View */}
              <Card className="hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Square of 9
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: '90°', value: 103800, type: 'support' },
                      { label: '180°', value: 104500, type: 'pivot' },
                      { label: '270°', value: 105100, type: 'resistance' },
                      { label: '360°', value: 105800, type: 'resistance' },
                      { label: '450°', value: 106500, type: 'resistance' },
                      { label: '540°', value: 107200, type: 'resistance' },
                    ].map((level, idx) => (
                      <div 
                        key={idx}
                        className={`p-2 rounded ${
                          level.type === 'support' ? 'bg-success/10' :
                          level.type === 'resistance' ? 'bg-destructive/10' :
                          'bg-primary/10'
                        }`}
                      >
                        <p className="text-xs text-muted-foreground">{level.label}</p>
                        <p className={`text-sm font-mono font-bold ${
                          level.type === 'support' ? 'text-success' :
                          level.type === 'resistance' ? 'text-destructive' :
                          'text-primary'
                        }`}>
                          {level.value.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Pattern Recognition */}
              <Card className="hover-glow lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Pattern Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'Bullish Engulfing', type: 'Candlestick', confidence: 88, target: '104,700' },
                      { name: 'Morning Star', type: 'Candlestick', confidence: 80, target: '104,325' },
                      { name: 'Elliott Wave 3', type: 'Wave Structure', confidence: 85, target: '104,700' },
                      { name: 'Harmonic AB=CD', type: 'Harmonic', confidence: 76, target: '104,800' },
                    ].map((pattern, idx) => (
                      <div key={idx} className="p-3 rounded bg-secondary/30 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{pattern.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">{pattern.type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Target</p>
                          <p className="text-sm font-mono font-bold text-success">{pattern.target}</p>
                          <Progress value={pattern.confidence} className="w-16 h-1 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="indicators" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EhlersIndicatorsCard indicators={ehlersIndicators} compositeScore={ehlersScore} />
              <MLPredictionsCard 
                predictions={mlPredictions}
                compositeScore={mlScore}
                consensusPrice={consensusPrice}
              />
            </div>
            
            <MarketHeatMap />
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* 24h Forecast */}
              <Card className="hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    24h Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Target Price</p>
                    <p className="text-3xl font-bold text-success">${consensusPrice.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-2 bg-success/10 text-success border-success/20">
                      +{((consensusPrice - marketData.price) / marketData.price * 100).toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground">Support</p>
                      <p className="font-mono font-bold text-success">${(marketData.price * 0.98).toFixed(0)}</p>
                    </div>
                    <div className="p-2 rounded bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground">Resistance</p>
                      <p className="font-mono font-bold text-destructive">${(marketData.price * 1.02).toFixed(0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Weekly Forecast */}
              <Card className="hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Weekly Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { day: 'Mon', price: 104800, direction: 'up' },
                    { day: 'Tue', price: 105200, direction: 'up' },
                    { day: 'Wed', price: 104950, direction: 'down' },
                    { day: 'Thu', price: 105500, direction: 'up' },
                    { day: 'Fri', price: 105300, direction: 'down' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                      <span className="text-sm font-medium">{item.day}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">${item.price.toLocaleString()}</span>
                        {item.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Key Events */}
              <Card className="hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Key Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { event: 'FOMC Meeting', date: 'Jan 8', impact: 'High' },
                    { event: 'CPI Release', date: 'Jan 12', impact: 'High' },
                    { event: 'Mercury Retrograde End', date: 'Jan 15', impact: 'Medium' },
                    { event: 'Full Moon', date: 'Jan 18', impact: 'Low' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                      <div>
                        <p className="text-sm font-medium">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <Badge variant={
                        item.impact === 'High' ? 'destructive' :
                        item.impact === 'Medium' ? 'default' :
                        'secondary'
                      }>
                        {item.impact}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="risk" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Risk Status */}
              <Card className="hover-glow lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-success" />
                      Risk Status
                    </CardTitle>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-lg px-4 py-1">
                      LOW RISK
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                      <p className="text-xl font-bold text-success">67.8%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Avg R:R</p>
                      <p className="text-xl font-bold text-foreground">2.4</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
                      <p className="text-xl font-bold text-success">2.34</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Profit Factor</p>
                      <p className="text-xl font-bold text-foreground">2.15</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xs text-muted-foreground mb-1">Kelly %</p>
                      <p className="text-xl font-bold text-accent">12.5%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <PerformanceCard />
            </div>
          </TabsContent>
          
          <TabsContent value="trade" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <QuickTradeCard symbol={activeSymbol} currentPrice={marketData.price} />
              <SignalStrengthCard signal={signal} />
              <GannLevelsCard levels={gannLevels} currentPrice={marketData.price} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
