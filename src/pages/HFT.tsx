import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Activity,
  Settings,
  Play,
  Pause,
  BarChart3,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Server,
  Cpu,
  Network,
} from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Generate mock latency data
const generateLatencyData = () => {
  return Array.from({ length: 60 }, (_, i) => ({
    time: i,
    latency: 0.5 + Math.random() * 2,
    orderLatency: 1 + Math.random() * 3,
    marketData: 0.3 + Math.random() * 1,
  }));
};

// Generate mock P&L data
const generatePnLData = () => {
  let pnl = 0;
  return Array.from({ length: 100 }, (_, i) => {
    pnl += (Math.random() - 0.48) * 50;
    return {
      trade: i + 1,
      pnl: pnl,
      cumulative: pnl,
    };
  });
};

const HFT = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("market-making");
  const [latencyData] = useState(generateLatencyData);
  const [pnlData] = useState(generatePnLData);

  const [config, setConfig] = useState({
    enabled: false,
    maxOrdersPerSecond: 100,
    maxPositionSize: 10,
    riskLimitPerTrade: 0.1,
    targetLatency: 1.0,
    maxLatency: 5.0,
    coLocation: true,
    directMarketAccess: true,
    spreadBps: 2.0,
    inventoryLimit: 5,
    quoteSize: 0.1,
    refreshRate: 100,
  });

  const strategies = [
    { id: "market-making", name: "Market Making", status: "active", pnl: 2450 },
    { id: "arbitrage", name: "Statistical Arbitrage", status: "standby", pnl: 1200 },
    { id: "momentum", name: "Momentum Scalping", status: "active", pnl: 890 },
    { id: "mean-reversion", name: "Mean Reversion", status: "disabled", pnl: -120 },
  ];

  const systemStats = {
    avgLatency: 0.8,
    ordersPerSec: 45,
    fillRate: 98.5,
    uptime: 99.99,
    cpuUsage: 23,
    memoryUsage: 45,
    networkLatency: 0.3,
  };

  const toggleHFT = () => {
    setIsRunning(!isRunning);
    toast.success(isRunning ? "HFT System stopped" : "HFT System started");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            High-Frequency Trading
          </h1>
          <p className="text-muted-foreground">Ultra-low latency algorithmic trading system</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isRunning ? "default" : "destructive"} className={isRunning ? "bg-success animate-pulse" : ""}>
            {isRunning ? "RUNNING" : "STOPPED"}
          </Badge>
          <Button onClick={toggleHFT} variant={isRunning ? "destructive" : "default"}>
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            <span className="text-xs">Avg Latency</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.avgLatency}ms</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="w-3 h-3" />
            <span className="text-xs">Orders/sec</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.ordersPerSec}</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs">Fill Rate</span>
          </div>
          <p className="text-lg font-bold text-success">{systemStats.fillRate}%</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Server className="w-3 h-3" />
            <span className="text-xs">Uptime</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.uptime}%</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Cpu className="w-3 h-3" />
            <span className="text-xs">CPU</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.cpuUsage}%</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="w-3 h-3" />
            <span className="text-xs">Memory</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.memoryUsage}%</p>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Network className="w-3 h-3" />
            <span className="text-xs">Network</span>
          </div>
          <p className="text-lg font-bold text-foreground">{systemStats.networkLatency}ms</p>
        </Card>
      </div>

      <Tabs defaultValue="strategies">
        <TabsList>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="latency">Latency</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{strategy.name}</h4>
                  <Badge 
                    variant={strategy.status === "active" ? "default" : "outline"}
                    className={strategy.status === "active" ? "bg-success" : strategy.status === "disabled" ? "text-destructive" : ""}
                  >
                    {strategy.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">P&L Today</span>
                  <span className={`font-bold ${strategy.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {strategy.pnl >= 0 ? '+' : ''}${strategy.pnl.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Cumulative P&L</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={pnlData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="trade" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              HFT Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable HFT</Label>
                  <Switch 
                    checked={config.enabled}
                    onCheckedChange={(v) => setConfig({...config, enabled: v})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Orders/Second</Label>
                  <Input 
                    type="number" 
                    value={config.maxOrdersPerSecond}
                    onChange={(e) => setConfig({...config, maxOrdersPerSecond: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Latency (ms)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={config.targetLatency}
                    onChange={(e) => setConfig({...config, targetLatency: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Co-Location</Label>
                  <Switch 
                    checked={config.coLocation}
                    onCheckedChange={(v) => setConfig({...config, coLocation: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Direct Market Access</Label>
                  <Switch 
                    checked={config.directMarketAccess}
                    onCheckedChange={(v) => setConfig({...config, directMarketAccess: v})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Spread (bps)</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    value={config.spreadBps}
                    onChange={(e) => setConfig({...config, spreadBps: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="latency" className="mt-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Latency Monitoring</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orderLatency" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="marketData" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HFT;
