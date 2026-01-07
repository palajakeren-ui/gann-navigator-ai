import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Activity, DollarSign, Percent, Layers, RefreshCw, Wifi } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from "recharts";
import { GannSquareChart } from "@/components/charts/GannSquareChart";
import { GannWheelChart } from "@/components/charts/GannWheelChart";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { GannCalculator } from "@/components/calculators/GannCalculator";
import { GannFanChart } from "@/components/charts/GannFanChart";
import { GannBoxChart } from "@/components/charts/GannBoxChart";
import { GannForecastingCalculator } from "@/components/calculators/GannForecastingCalculator";
import HexagonGeometryChart from "@/components/charts/HexagonGeometryChart";
import GannFanFullModule from "@/components/charts/GannFanFullModule";
import { Button } from "@/components/ui/button";
import TradingInstrumentSelector from "@/components/TradingInstrumentSelector";
import { useLiveData } from "@/hooks/useLiveData";
import LiveSignalCard from "@/components/dashboard/LiveSignalCard";
import GannLevelsPanel from "@/components/dashboard/GannLevelsPanel";
import AstroSummaryCard from "@/components/dashboard/AstroSummaryCard";
import { useState, useMemo } from "react";

const Index = () => {
  // Use unified live data hook
  const {
    marketData,
    gannLevels,
    nearestSupport,
    nearestResistance,
    timeCycles,
    astroData,
    ehlersData,
    mlPredictions,
    tradingSignal,
    isConnected,
    toggleConnection,
    refresh
  } = useLiveData({
    symbol: 'BTCUSDT',
    enabled: true,
    updateInterval: 2000,
    basePrice: 105000
  });

  const currentPrice = marketData.price;
  const priceChange = marketData.change;
  const priceChangePercent = marketData.changePercent;
  const lastUpdate = marketData.timestamp;

  // Generate chart data from price
  const mockPriceData = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const base = currentPrice + Math.sin(i / 5) * (currentPrice * 0.04);
    const date = new Date(2024, 9, 21 + i);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: base + Math.random() * (currentPrice * 0.02),
      volume: 800000 + Math.random() * 800000,
    };
  }), [currentPrice]);

  return (
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">Gann Navigator</h1>
          <p className="text-xs md:text-base text-muted-foreground">BTCUSD - Binance Futures, MetaTrader 5</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={isConnected ? "border-success text-success" : "border-destructive text-destructive"}>
            <Wifi className="w-3 h-3 mr-1" />
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isConnected ? 'animate-spin' : ''}`} />
            {isConnected ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={refresh}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Trading Signal */}
      <LiveSignalCard 
        signal={tradingSignal} 
        marketData={marketData} 
        mlPredictions={mlPredictions}
        ehlersScore={ehlersData.score}
      />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gann Levels Panel */}
        <GannLevelsPanel 
          levels={gannLevels}
          currentPrice={currentPrice}
          nearestSupport={nearestSupport}
          nearestResistance={nearestResistance}
        />

        {/* Astro Summary Card */}
        <AstroSummaryCard 
          astroData={astroData}
          timeCycles={timeCycles}
        />

        {/* Quick Stats Card */}
        <Card className="p-4 border-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Market Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="font-bold text-foreground">${currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <span className={`font-bold ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm text-muted-foreground">Ehlers Score</span>
              <Badge variant={ehlersData.score > 60 ? "default" : "secondary"} className={ehlersData.score > 60 ? "bg-success" : ""}>
                {ehlersData.score.toFixed(0)}%
              </Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm text-muted-foreground">ML Confidence</span>
              <Badge variant="outline">{mlPredictions.consensusConfidence.toFixed(0)}%</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
              <span className="text-sm text-muted-foreground">Dominant Cycle</span>
              <span className="font-mono text-foreground">{ehlersData.dominantCycle} bars</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Account Stats */}
      <Card className="p-3 md:p-6 border-border bg-card">
        <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">Live Analysis</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Account Balance</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              100,000
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Risk/Trade</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <Percent className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              2%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Leverage</p>
            <p className="text-lg md:text-2xl font-bold text-foreground flex items-center">
              <Layers className="w-4 h-4 md:w-5 md:h-5 mr-1" />
              5x
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground">Lot Size</p>
            <p className="text-lg md:text-2xl font-bold text-foreground">0.19</p>
          </div>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground mt-3 md:mt-4">
          Last Update: {lastUpdate.toISOString().replace('T', ' ').split('.')[0]} UTC
        </p>
      </Card>

      {/* Charts Section */}
      <Card className="p-3 md:p-6 border-border bg-card">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="text-lg md:text-2xl font-bold text-foreground">Advanced Trading Charts</h2>
            <div className="text-left sm:text-right">
              <p className="text-xl md:text-3xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              <p className={`text-sm md:text-lg flex items-center sm:justify-end ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="1d" className="w-full">
          <div className="mb-3 md:mb-4 overflow-x-auto">
            <TabsList className="inline-flex flex-wrap gap-1 h-auto p-1 md:p-2 min-w-max">
              {["m1", "m5", "m15", "m30", "1h", "4h", "1d", "1w", "1mo"].map((tf) => (
                <TabsTrigger key={tf} value={tf} className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2">
                  {tf.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {["m1", "m5", "m15", "m30"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="price" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <YAxis yAxisId="volume" orientation="right" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line yAxisId="price" type="monotone" dataKey="price" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                  <Bar yAxisId="volume" dataKey="volume" fill="hsl(var(--accent))" opacity={0.3} />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}

          {["1h", "4h"].map((tf) => (
            <TabsContent key={tf} value={tf} className="h-[250px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}

          <TabsContent value="1d" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPriceData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1w" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="1mo" className="h-[250px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPriceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} width={50} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Trading Instrument Selector */}
      <TradingInstrumentSelector />

      {/* Gann Analysis Tabs */}
      <Tabs defaultValue="calculations" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-5 gap-1">
            <TabsTrigger value="overview" className="text-xs md:text-sm whitespace-nowrap">Overview</TabsTrigger>
            <TabsTrigger value="calculations" className="text-xs md:text-sm whitespace-nowrap">Calculations</TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs md:text-sm whitespace-nowrap">Analysis</TabsTrigger>
            <TabsTrigger value="forecasting" className="text-xs md:text-sm whitespace-nowrap">Forecast</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs md:text-sm whitespace-nowrap">Risk</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Market Overview (Real-Time)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-xl font-bold text-foreground">${currentPrice.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">24h Change</p>
                <p className={`text-xl font-bold ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Gann Level</p>
                <p className="text-xl font-bold text-primary">{nearestResistance?.degree || 90}°</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Signal</p>
                <Badge className={tradingSignal?.direction === 'LONG' ? "bg-success" : tradingSignal?.direction === 'SHORT' ? "bg-destructive" : ""}>
                  {tradingSignal?.direction || 'NEUTRAL'}
                </Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="calculations" className="space-y-4 mt-4">
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 md:mb-4">
            Live Calculation Engines (${currentPrice.toLocaleString()})
          </h3>

          {/* Hexagon Geometry and Gann Fan Full Module */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <HexagonGeometryChart currentPrice={currentPrice} />
            <GannFanFullModule currentPrice={currentPrice} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-success" />
                WD Gann Angles Summary
              </h4>
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {gannLevels.slice(0, 12).map((level, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="text-sm font-bold text-accent">{level.degree}°</span>
                    <span className="text-sm font-mono text-foreground">${level.price.toFixed(2)}</span>
                    <Badge variant="outline" className={`text-xs ${level.type === 'support' ? 'border-success text-success' : 'border-destructive text-destructive'}`}>
                      {level.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 md:p-6 border-border bg-card">
              <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-accent" />
                Fibonacci Levels
              </h4>
              <div className="space-y-2">
                {[
                  { level: "0.0%", price: `$${(currentPrice * 0.95).toFixed(2)}` },
                  { level: "23.6%", price: `$${(currentPrice * 0.976).toFixed(2)}` },
                  { level: "38.2%", price: `$${(currentPrice * 0.992).toFixed(2)}` },
                  { level: "50.0%", price: `$${(currentPrice * 1.00).toFixed(2)}` },
                  { level: "61.8%", price: `$${(currentPrice * 1.018).toFixed(2)}` },
                  { level: "78.6%", price: `$${(currentPrice * 1.036).toFixed(2)}` },
                  { level: "100%", price: `$${(currentPrice * 1.05).toFixed(2)}` },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="text-sm font-mono text-primary">{item.level}</span>
                    <span className="text-sm font-mono text-foreground">{item.price}</span>
                  </div>
                ))}
              </div>
            </Card>

            <GannCalculator currentPrice={currentPrice} />
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Gann Square of 9</h3>
              <GannSquareChart currentPrice={currentPrice} />
            </Card>
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Gann Wheel</h3>
              <GannWheelChart currentPrice={currentPrice} />
            </Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Gann Fan Chart</h3>
              <GannFanChart currentPrice={currentPrice} />
            </Card>
            <Card className="p-4 border-border bg-card">
              <h3 className="text-lg font-semibold mb-4">Gann Box</h3>
              <GannBoxChart currentPrice={currentPrice} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4 mt-4">
          <GannForecastingCalculator currentPrice={currentPrice} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-4 mt-4">
          <Card className="p-4 md:p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">Position Size Calculator</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Entry Price</p>
                <p className="text-xl font-bold">${currentPrice.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Stop Loss</p>
                <p className="text-xl font-bold text-destructive">${(currentPrice * 0.99).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Take Profit</p>
                <p className="text-xl font-bold text-success">${(currentPrice * 1.03).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Position Size</p>
                <p className="text-xl font-bold text-primary">0.19 lots</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
