import { OptionsPanel } from "@/components/OptionsPanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, TrendingUp, TrendingDown, Calculator, Activity, DollarSign, Percent, RefreshCw } from "lucide-react";
import { useState } from "react";

const optionsChain = [
  { strike: 102000, callBid: 2850, callAsk: 2900, putBid: 320, putAsk: 350, callDelta: 0.85, putDelta: -0.15, callIV: 42, putIV: 45, volume: 1250 },
  { strike: 103000, callBid: 2100, callAsk: 2150, putBid: 520, putAsk: 560, callDelta: 0.75, putDelta: -0.25, callIV: 40, putIV: 43, volume: 2100 },
  { strike: 104000, callBid: 1450, callAsk: 1500, putBid: 850, putAsk: 900, callDelta: 0.62, putDelta: -0.38, callIV: 38, putIV: 41, volume: 3500 },
  { strike: 105000, callBid: 920, callAsk: 970, putBid: 1320, putAsk: 1380, callDelta: 0.48, putDelta: -0.52, callIV: 36, putIV: 39, volume: 4200 },
  { strike: 106000, callBid: 520, callAsk: 570, putBid: 1950, putAsk: 2020, callDelta: 0.32, putDelta: -0.68, callIV: 35, putIV: 38, volume: 2800 },
  { strike: 107000, callBid: 280, callAsk: 320, putBid: 2720, putAsk: 2800, callDelta: 0.18, putDelta: -0.82, callIV: 34, putIV: 37, volume: 1500 },
];

const greeks = [
  { name: "Delta", value: "0.58", description: "Price sensitivity", change: "+0.02" },
  { name: "Gamma", value: "0.032", description: "Delta change rate", change: "+0.001" },
  { name: "Theta", value: "-15.20", description: "Time decay ($/day)", change: "-0.50" },
  { name: "Vega", value: "125.50", description: "IV sensitivity", change: "+2.30" },
  { name: "Rho", value: "45.20", description: "Rate sensitivity", change: "+0.10" },
];

const unusualActivity = [
  { symbol: "BTCUSD", type: "Call", strike: 110000, expiry: "Jan 2025", volume: 5200, oi: 12500, premium: "$2.1M", sentiment: "Bullish" },
  { symbol: "BTCUSD", type: "Put", strike: 95000, expiry: "Dec 2024", volume: 3800, oi: 8900, premium: "$1.4M", sentiment: "Hedge" },
  { symbol: "ETHUSD", type: "Call", strike: 4500, expiry: "Jan 2025", volume: 8500, oi: 22000, premium: "$3.2M", sentiment: "Bullish" },
  { symbol: "XAUUSD", type: "Put", strike: 1950, expiry: "Dec 2024", volume: 2100, oi: 5600, premium: "$890K", sentiment: "Bearish" },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [spotPrice, setSpotPrice] = useState(104525);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Target className="w-8 h-8 text-accent" />
            Options Analysis
          </h1>
          <p className="text-muted-foreground">Options pricing, Greeks, volatility surface & flow analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calculator className="w-4 h-4 mr-1" />
            Calculator
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Spot Price</p>
          <p className="text-2xl font-bold text-foreground">${spotPrice.toLocaleString()}</p>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Implied Volatility</p>
          <p className="text-2xl font-bold text-warning">38.5%</p>
          <Badge variant="outline" className="mt-1 text-xs bg-warning/10 text-warning border-warning/20">Elevated</Badge>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Put/Call Ratio</p>
          <p className="text-2xl font-bold text-success">0.72</p>
          <Badge variant="outline" className="mt-1 text-xs bg-success/10 text-success border-success/20">Bullish</Badge>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Max Pain</p>
          <p className="text-2xl font-bold text-foreground">$105,000</p>
          <Badge variant="outline" className="mt-1 text-xs">Near ATM</Badge>
        </Card>
        <Card className="p-4 glass-card text-center">
          <p className="text-xs text-muted-foreground mb-1">Net Flow</p>
          <p className="text-2xl font-bold text-success">+$4.2M</p>
          <div className="mt-1 flex items-center justify-center text-success">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span className="text-xs">Call Bias</span>
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chain">Options Chain</TabsTrigger>
          <TabsTrigger value="greeks">Greeks</TabsTrigger>
          <TabsTrigger value="flow">Unusual Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptionsPanel 
              bias="CALL"
              delta={0.58}
              expiry="Dec 29, 2024"
              ivr={45}
              recommendation={{
                type: "BTCUSD Call Spread",
                strike: 105000,
                premium: 920,
              }}
              riskReward={2.5}
            />

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Greeks Summary
              </h3>
              <div className="space-y-4">
                {greeks.map((greek) => (
                  <div key={greek.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-semibold text-foreground">{greek.name}</p>
                      <p className="text-xs text-muted-foreground">{greek.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-mono font-bold text-foreground">{greek.value}</p>
                      <p className={`text-xs ${greek.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {greek.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Volatility Surface (Placeholder)</h3>
            <div className="bg-secondary/30 rounded-lg h-[300px] flex items-center justify-center border border-border">
              <div className="text-center space-y-4">
                <Target className="w-16 h-16 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-semibold text-foreground">IV Surface Chart</p>
                  <p className="text-sm text-muted-foreground">
                    3D visualization of implied volatility across strikes and maturities
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="chain" className="space-y-6">
          <Card className="p-6 glass-card overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">BTCUSD Options Chain</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Expiry: Dec 29, 2024</Badge>
                <Badge variant="outline">Spot: ${spotPrice.toLocaleString()}</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center bg-success/10" colSpan={4}>CALLS</TableHead>
                    <TableHead className="text-center">Strike</TableHead>
                    <TableHead className="text-center bg-destructive/10" colSpan={4}>PUTS</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-success">Bid</TableHead>
                    <TableHead className="text-success">Ask</TableHead>
                    <TableHead className="text-success">Delta</TableHead>
                    <TableHead className="text-success">IV</TableHead>
                    <TableHead className="text-center font-bold">Strike</TableHead>
                    <TableHead className="text-destructive">Bid</TableHead>
                    <TableHead className="text-destructive">Ask</TableHead>
                    <TableHead className="text-destructive">Delta</TableHead>
                    <TableHead className="text-destructive">IV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionsChain.map((row) => (
                    <TableRow key={row.strike} className={row.strike === 105000 ? "bg-primary/10" : ""}>
                      <TableCell className="font-mono text-success">${row.callBid}</TableCell>
                      <TableCell className="font-mono text-success">${row.callAsk}</TableCell>
                      <TableCell className="font-mono">{row.callDelta.toFixed(2)}</TableCell>
                      <TableCell className="font-mono">{row.callIV}%</TableCell>
                      <TableCell className="text-center font-bold text-foreground">${row.strike.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-destructive">${row.putBid}</TableCell>
                      <TableCell className="font-mono text-destructive">${row.putAsk}</TableCell>
                      <TableCell className="font-mono">{row.putDelta.toFixed(2)}</TableCell>
                      <TableCell className="font-mono">{row.putIV}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="greeks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {greeks.map((greek, idx) => (
              <Card key={greek.name} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{greek.name}</p>
                  <p className="text-3xl font-bold gradient-text mb-2">{greek.value}</p>
                  <p className="text-xs text-muted-foreground mb-2">{greek.description}</p>
                  <Badge variant="outline" className={greek.change.startsWith('+') ? 'text-success border-success' : 'text-destructive border-destructive'}>
                    {greek.change}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Greeks Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Spot Price</Label>
                <Input type="number" value={spotPrice} onChange={(e) => setSpotPrice(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Strike Price</Label>
                <Input type="number" defaultValue={105000} />
              </div>
              <div className="space-y-2">
                <Label>Days to Expiry</Label>
                <Input type="number" defaultValue={14} />
              </div>
              <div className="space-y-2">
                <Label>Implied Volatility (%)</Label>
                <Input type="number" defaultValue={38.5} />
              </div>
            </div>
            <Button className="mt-4 w-full">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Greeks
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Unusual Options Activity</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Strike</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">OI</TableHead>
                  <TableHead className="text-right">Premium</TableHead>
                  <TableHead>Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unusualActivity.map((activity, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{activity.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={activity.type === "Call" ? "default" : "destructive"} className={activity.type === "Call" ? "bg-success" : ""}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">${activity.strike.toLocaleString()}</TableCell>
                    <TableCell>{activity.expiry}</TableCell>
                    <TableCell className="text-right font-mono">{activity.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{activity.oi.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-success">{activity.premium}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        activity.sentiment === "Bullish" ? "text-success border-success" :
                        activity.sentiment === "Bearish" ? "text-destructive border-destructive" :
                        "text-warning border-warning"
                      }>
                        {activity.sentiment}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Options;
