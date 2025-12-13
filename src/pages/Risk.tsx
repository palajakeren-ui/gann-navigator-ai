import { PositionSizePanel } from "@/components/PositionSizePanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Shield, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Percent, Calculator, RefreshCw, Target } from "lucide-react";
import { useState } from "react";

const equityData = Array.from({ length: 100 }, (_, i) => ({
  day: i + 1,
  equity: 100000 + i * 250 + Math.sin(i / 8) * 3000 + Math.random() * 1000,
  drawdown: -Math.abs(Math.sin(i / 12) * 5),
}));

const positions = [
  { symbol: "BTCUSD", side: "Long", entry: 103500, current: 104525, size: 0.15, pnl: 153.75, pnlPercent: 0.99, risk: 200, status: "Active" },
  { symbol: "ETHUSD", side: "Long", entry: 3820, current: 3890, size: 2.5, pnl: 175, pnlPercent: 1.83, risk: 150, status: "Active" },
  { symbol: "XAUUSD", side: "Short", entry: 2055, current: 2045, size: 1.0, pnl: 100, pnlPercent: 0.49, risk: 180, status: "Active" },
];

const riskMetrics = [
  { label: "Portfolio Value", value: "$102,450", change: "+$2,450", changePercent: "+2.45%", status: "positive" },
  { label: "Total Exposure", value: "$45,000", change: "45%", changePercent: "of equity", status: "neutral" },
  { label: "Daily P&L", value: "+$428.75", change: "+0.43%", changePercent: "today", status: "positive" },
  { label: "Max Drawdown", value: "-$3,250", change: "-3.25%", changePercent: "peak", status: "negative" },
];

const riskAlerts = [
  { severity: "warning", message: "BTCUSD position approaching max size limit", action: "Monitor", time: "5 min ago" },
  { severity: "info", message: "Volatility increased 15% - consider tightening stops", action: "Review", time: "12 min ago" },
  { severity: "success", message: "All positions have active stop losses", action: "OK", time: "1 hour ago" },
  { severity: "info", message: "Correlation alert: BTCUSD-ETHUSD high (0.92)", action: "Diversify", time: "2 hours ago" },
];

const Risk = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [accountEquity, setAccountEquity] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(2);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
            <Shield className="w-8 h-8 text-success" />
            Risk Manager
          </h1>
          <p className="text-muted-foreground">Portfolio risk analysis, position sizing & monitoring</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {riskMetrics.map((metric, idx) => (
          <Card key={metric.label} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start justify-between mb-2">
              <Shield className={`w-5 h-5 ${
                metric.status === 'positive' ? 'text-success' : 
                metric.status === 'negative' ? 'text-destructive' : 
                'text-warning'
              }`} />
              <Badge variant={
                metric.status === 'positive' ? 'default' : 
                metric.status === 'negative' ? 'destructive' : 
                'secondary'
              } className={metric.status === 'positive' ? 'bg-success' : ''}>
                {metric.change}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <p className="text-2xl font-bold gradient-text">{metric.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{metric.changePercent}</p>
          </Card>
        ))}
      </div>

      {/* Risk Status Card */}
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Risk Status
          </h3>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-lg px-4 py-2">
            LOW RISK
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="sizing">Position Sizing</TabsTrigger>
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Equity Curve</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="equity" stroke="hsl(var(--success))" fill="url(#equityGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 glass-card">
              <h3 className="text-lg font-bold text-foreground mb-4">Drawdown History</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="ddGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[-10, 0]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="drawdown" stroke="hsl(var(--destructive))" fill="url(#ddGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 glass-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Stop Loss Settings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ATR Multiplier</span>
                  <span className="font-semibold text-foreground">2.0x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max SL %</span>
                  <span className="font-semibold text-foreground">3.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trailing Stop</span>
                  <span className="font-semibold text-success">Active</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Correlation Matrix</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BTC-ETH</span>
                  <span className="font-semibold text-warning">0.92</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BTC-GOLD</span>
                  <span className="font-semibold text-foreground">0.35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GOLD-USD</span>
                  <span className="font-semibold text-foreground">-0.65</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 glass-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Risk Limits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Daily Loss Limit</span>
                  <span className="font-semibold text-foreground">5.0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Open Positions</span>
                  <span className="font-semibold text-foreground">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Leverage</span>
                  <span className="font-semibold text-foreground">5x</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card className="p-6 glass-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Open Positions</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Entry</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos) => (
                  <TableRow key={pos.symbol}>
                    <TableCell className="font-bold">{pos.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={pos.side === "Long" ? "default" : "destructive"} className={pos.side === "Long" ? "bg-success" : ""}>
                        {pos.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">${pos.entry.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">${pos.current.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{pos.size}</TableCell>
                    <TableCell className={`text-right font-mono font-bold ${pos.pnl > 0 ? 'text-success' : 'text-destructive'}`}>
                      ${pos.pnl.toFixed(2)} ({pos.pnlPercent}%)
                    </TableCell>
                    <TableCell className="text-right font-mono text-warning">${pos.risk}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">{pos.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="sizing" className="space-y-6">
          <PositionSizePanel 
            accountEquity={accountEquity}
            riskPerTrade={riskPercent}
            riskAmount={accountEquity * (riskPercent / 100)}
            dollarPerPoint={1}
            stopDistance={825}
            riskPerLot={825}
            calculatedLotSize={2.42}
            adjustedLotSize={0.19}
            leverage={5}
            entry={104525}
            stopLoss={103700}
          />

          <Card className="p-6 glass-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Custom Position Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Account Equity ($)</Label>
                <Input 
                  type="number" 
                  value={accountEquity} 
                  onChange={(e) => setAccountEquity(Number(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <Label>Risk Per Trade (%)</Label>
                <Input 
                  type="number" 
                  value={riskPercent} 
                  onChange={(e) => setRiskPercent(Number(e.target.value))} 
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Entry Price</Label>
                <Input type="number" defaultValue={104525} />
              </div>
              <div className="space-y-2">
                <Label>Stop Loss Price</Label>
                <Input type="number" defaultValue={103700} />
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-muted-foreground mb-1">Calculated Position Size</p>
              <p className="text-3xl font-bold text-primary">0.19 lots</p>
              <p className="text-xs text-muted-foreground mt-1">Risk Amount: ${(accountEquity * (riskPercent / 100)).toFixed(2)}</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="p-6 glass-card">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
              <h3 className="text-xl font-bold text-foreground">Risk Alerts</h3>
            </div>
            <div className="space-y-3">
              {riskAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    alert.severity === "warning"
                      ? "bg-warning/5 border-warning/20"
                      : alert.severity === "info"
                      ? "bg-accent/5 border-accent/20"
                      : "bg-success/5 border-success/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {alert.severity === "warning" && (
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      )}
                      {alert.severity === "info" && (
                        <TrendingDown className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      )}
                      {alert.severity === "success" && (
                        <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm text-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        alert.severity === "warning"
                          ? "border-warning text-warning"
                          : alert.severity === "info"
                          ? "border-accent text-accent"
                          : "border-success text-success"
                      }
                    >
                      {alert.action}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Risk;
