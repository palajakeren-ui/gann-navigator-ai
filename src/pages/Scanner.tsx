import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, TrendingUp, TrendingDown, Minus, RefreshCw, 
  Download, Filter, Bell, Star, ArrowUpDown, Eye,
  Activity, Target, Brain, Telescope
} from "lucide-react";
import { useState } from "react";

const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN"];

const scanResults = [
  { 
    symbol: "BTCUSD", 
    asset: "Crypto",
    timeframe: "H4",
    signal: "BUY", 
    strength: "STRONG",
    price: 104525, 
    change: 2.34, 
    pattern: "Bullish Gann Fan",
    gann: 92,
    astro: 85,
    ehlers: 88,
    ml: 90,
    confluence: 5,
    entry: 104525,
    sl: 103700,
    tp: 106000,
    rr: 1.79,
    starred: true,
  },
  { 
    symbol: "ETHUSD", 
    asset: "Crypto",
    timeframe: "H1",
    signal: "BUY", 
    strength: "STRONG",
    price: 3890, 
    change: 1.56, 
    pattern: "Square of 9 Support",
    gann: 88,
    astro: 82,
    ehlers: 85,
    ml: 87,
    confluence: 4,
    entry: 3890,
    sl: 3750,
    tp: 4150,
    rr: 1.86,
    starred: true,
  },
  { 
    symbol: "XAUUSD", 
    asset: "Commodity",
    timeframe: "D1",
    signal: "SELL", 
    strength: "MEDIUM",
    price: 2045.30, 
    change: -0.45, 
    pattern: "Bearish Divergence",
    gann: 45,
    astro: 38,
    ehlers: 42,
    ml: 48,
    confluence: 2,
    entry: 2045.30,
    sl: 2065,
    tp: 2010,
    rr: 1.79,
    starred: false,
  },
  { 
    symbol: "EURUSD", 
    asset: "Forex",
    timeframe: "H4",
    signal: "BUY", 
    strength: "MEDIUM",
    price: 1.0875, 
    change: 0.12, 
    pattern: "1x1 Angle Support",
    gann: 72,
    astro: 68,
    ehlers: 70,
    ml: 75,
    confluence: 3,
    entry: 1.0875,
    sl: 1.0820,
    tp: 1.0980,
    rr: 1.91,
    starred: false,
  },
  { 
    symbol: "GBPUSD", 
    asset: "Forex",
    timeframe: "M30",
    signal: "BUY", 
    strength: "STRONG",
    price: 1.2654, 
    change: 0.23, 
    pattern: "Planetary Confluence",
    gann: 82,
    astro: 90,
    ehlers: 78,
    ml: 84,
    confluence: 4,
    entry: 1.2654,
    sl: 1.2600,
    tp: 1.2750,
    rr: 1.78,
    starred: true,
  },
  { 
    symbol: "SOLUSD", 
    asset: "Crypto",
    timeframe: "H1",
    signal: "BUY", 
    strength: "STRONG",
    price: 156, 
    change: 3.45, 
    pattern: "Square of 9 Breakout",
    gann: 90,
    astro: 85,
    ehlers: 82,
    ml: 88,
    confluence: 5,
    entry: 156,
    sl: 148,
    tp: 172,
    rr: 2.0,
    starred: false,
  },
  { 
    symbol: "US500", 
    asset: "Index",
    timeframe: "D1",
    signal: "NEUTRAL", 
    strength: "WEAK",
    price: 4782.50, 
    change: 0.08, 
    pattern: "Consolidation",
    gann: 52,
    astro: 48,
    ehlers: 55,
    ml: 50,
    confluence: 2,
    entry: 4782.50,
    sl: 4720,
    tp: 4850,
    rr: 1.08,
    starred: false,
  },
];

const Scanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState("all");
  const [selectedSignal, setSelectedSignal] = useState("all");
  const [sortBy, setSortBy] = useState("confluence");

  const filteredResults = scanResults
    .filter(r => {
      if (searchTerm && !r.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedTimeframe !== "all" && r.timeframe !== selectedTimeframe) return false;
      if (selectedAsset !== "all" && r.asset !== selectedAsset) return false;
      if (selectedSignal !== "all" && r.signal !== selectedSignal) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "confluence") return b.confluence - a.confluence;
      if (sortBy === "strength") return b.gann - a.gann;
      if (sortBy === "change") return Math.abs(b.change) - Math.abs(a.change);
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Market Scanner</h1>
          <p className="text-muted-foreground">Real-time multi-asset pattern detection with confluence analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-1" />
            Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Scan Now
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 glass-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger>
              <SelectValue placeholder="Asset Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Forex">Forex</SelectItem>
              <SelectItem value="Commodity">Commodities</SelectItem>
              <SelectItem value="Index">Indices</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Timeframes</SelectItem>
              {timeframes.map(tf => (
                <SelectItem key={tf} value={tf}>{tf}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSignal} onValueChange={setSelectedSignal}>
            <SelectTrigger>
              <SelectValue placeholder="Signal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signals</SelectItem>
              <SelectItem value="BUY">Buy Only</SelectItem>
              <SelectItem value="SELL">Sell Only</SelectItem>
              <SelectItem value="NEUTRAL">Neutral</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confluence">Confluence Score</SelectItem>
              <SelectItem value="strength">Signal Strength</SelectItem>
              <SelectItem value="change">Price Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Signals</p>
          <p className="text-2xl font-bold text-foreground">{filteredResults.length}</p>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Buy Signals</p>
          <p className="text-2xl font-bold text-success">{filteredResults.filter(r => r.signal === "BUY").length}</p>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Sell Signals</p>
          <p className="text-2xl font-bold text-destructive">{filteredResults.filter(r => r.signal === "SELL").length}</p>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Strong Signals</p>
          <p className="text-2xl font-bold text-accent">{filteredResults.filter(r => r.strength === "STRONG").length}</p>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="p-6 glass-card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Scan Results
          </h2>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            Last scan: Just now
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground"></th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">Symbol</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">TF</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">Signal</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Price</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">Gann</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">Astro</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">Ehlers</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">ML</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">Confluence</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Entry</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">SL</th>
                <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">TP</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">R:R</th>
                <th className="text-center py-3 px-2 text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result, idx) => (
                <tr 
                  key={`${result.symbol}-${result.timeframe}`} 
                  className="border-b border-border hover:bg-secondary/50 transition-all"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="py-3 px-2">
                    <Star className={`w-4 h-4 cursor-pointer ${result.starred ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-bold text-foreground">{result.symbol}</p>
                      <p className="text-xs text-muted-foreground">{result.pattern}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant="secondary" className="font-mono text-xs">{result.timeframe}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={result.signal === "BUY" ? "default" : result.signal === "SELL" ? "destructive" : "secondary"}
                        className={result.signal === "BUY" ? "bg-success" : ""}
                      >
                        {result.signal}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          result.strength === "STRONG"
                            ? "border-success text-success text-xs"
                            : result.strength === "MEDIUM"
                            ? "border-warning text-warning text-xs"
                            : "border-muted text-muted-foreground text-xs"
                        }
                      >
                        {result.strength}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <p className="font-mono text-foreground">{result.price.toLocaleString()}</p>
                    <p className={`text-xs flex items-center justify-end gap-1 ${result.change > 0 ? 'text-success' : result.change < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {result.change > 0 ? <TrendingUp className="w-3 h-3" /> : result.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      {Math.abs(result.change)}%
                    </p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`font-semibold ${result.gann > 70 ? "text-success" : result.gann > 50 ? "text-warning" : "text-muted-foreground"}`}>
                      {result.gann}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`font-semibold ${result.astro > 70 ? "text-success" : result.astro > 50 ? "text-warning" : "text-muted-foreground"}`}>
                      {result.astro}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`font-semibold ${result.ehlers > 70 ? "text-success" : result.ehlers > 50 ? "text-warning" : "text-muted-foreground"}`}>
                      {result.ehlers}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`font-semibold ${result.ml > 70 ? "text-success" : result.ml > 50 ? "text-warning" : "text-muted-foreground"}`}>
                      {result.ml}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge
                      variant="outline"
                      className={
                        result.confluence >= 4
                          ? "border-success text-success"
                          : result.confluence >= 3
                          ? "border-warning text-warning"
                          : "border-muted text-muted-foreground"
                      }
                    >
                      {result.confluence}/5
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-sm text-foreground">{result.entry}</td>
                  <td className="py-3 px-2 text-right font-mono text-sm text-destructive">{result.sl}</td>
                  <td className="py-3 px-2 text-right font-mono text-sm text-success">{result.tp}</td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant="outline" className="font-mono">{result.rr.toFixed(2)}</Badge>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Scanner;
