import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Layers,
  TrendingUp,
  DollarSign,
  Settings2,
  Shield,
  Zap,
  Activity,
  Play,
  Pause,
  Download,
  Upload,
  Server,
} from "lucide-react";
import { toast } from "sonner";

const TradingMode = () => {
  const [activeMode, setActiveMode] = useState<"spot" | "futures">("futures");
  const [isLive, setIsLive] = useState(false);
  
  const [spotConfig, setSpotConfig] = useState({
    enabled: true,
    riskPerTrade: 2,
    maxOpenPositions: 5,
    lotSize: 0.01,
  });

  const [futuresConfig, setFuturesConfig] = useState({
    enabled: true,
    leverage: 10,
    marginMode: "isolated",
    riskPerTrade: 1,
    maxDrawdown: 15,
    trailingStop: true,
    trailingStopDistance: 1.5,
  });

  const toggleLive = () => {
    setIsLive(!isLive);
    toast.success(isLive ? "Trading paused" : "Trading started");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Mode Configuration</h1>
          <p className="text-muted-foreground">Configure spot and futures trading parameters</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? "default" : "outline"} className={isLive ? "bg-success" : ""}>
            {isLive ? "LIVE" : "PAUSED"}
          </Badge>
          <Button onClick={toggleLive} variant={isLive ? "destructive" : "default"}>
            {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLive ? "Pause" : "Start"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs">Account Balance</span>
          </div>
          <p className="text-xl font-bold text-foreground">$100,000</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Open Positions</span>
          </div>
          <p className="text-xl font-bold text-foreground">3</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Today's P&L</span>
          </div>
          <p className="text-xl font-bold text-success">+$2,450</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs">Risk Used</span>
          </div>
          <p className="text-xl font-bold text-foreground">35%</p>
        </Card>
      </div>

      <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "spot" | "futures")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="spot">
            <Layers className="w-4 h-4 mr-2" />
            Spot Trading
          </TabsTrigger>
          <TabsTrigger value="futures">
            <Zap className="w-4 h-4 mr-2" />
            Futures Trading
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spot" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Spot Trading Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Spot Trading</Label>
                  <Switch 
                    checked={spotConfig.enabled}
                    onCheckedChange={(v) => setSpotConfig({...spotConfig, enabled: v})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Risk Per Trade (%)</Label>
                  <Input 
                    type="number" 
                    value={spotConfig.riskPerTrade}
                    onChange={(e) => setSpotConfig({...spotConfig, riskPerTrade: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Open Positions</Label>
                  <Input 
                    type="number" 
                    value={spotConfig.maxOpenPositions}
                    onChange={(e) => setSpotConfig({...spotConfig, maxOpenPositions: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Default Lot Size</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={spotConfig.lotSize}
                    onChange={(e) => setSpotConfig({...spotConfig, lotSize: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Card className="p-4 bg-secondary/30">
                <h4 className="font-semibold mb-3">Risk Management Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Amount:</span>
                    <span className="font-medium">${(100000 * spotConfig.riskPerTrade / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Exposure:</span>
                    <span className="font-medium">{spotConfig.maxOpenPositions * spotConfig.riskPerTrade}%</span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="futures" className="mt-6 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Futures Trading Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Futures Trading</Label>
                  <Switch 
                    checked={futuresConfig.enabled}
                    onCheckedChange={(v) => setFuturesConfig({...futuresConfig, enabled: v})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Leverage (x)</Label>
                  <Select 
                    value={futuresConfig.leverage.toString()}
                    onValueChange={(v) => setFuturesConfig({...futuresConfig, leverage: parseInt(v)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 10, 20, 50, 100, 125].map(l => (
                        <SelectItem key={l} value={l.toString()}>{l}x</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Margin Mode</Label>
                  <Select 
                    value={futuresConfig.marginMode}
                    onValueChange={(v) => setFuturesConfig({...futuresConfig, marginMode: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isolated">Isolated</SelectItem>
                      <SelectItem value="cross">Cross</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Per Trade (%)</Label>
                  <Input 
                    type="number" 
                    value={futuresConfig.riskPerTrade}
                    onChange={(e) => setFuturesConfig({...futuresConfig, riskPerTrade: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Drawdown (%)</Label>
                  <Input 
                    type="number" 
                    value={futuresConfig.maxDrawdown}
                    onChange={(e) => setFuturesConfig({...futuresConfig, maxDrawdown: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Trailing Stop</Label>
                  <Switch 
                    checked={futuresConfig.trailingStop}
                    onCheckedChange={(v) => setFuturesConfig({...futuresConfig, trailingStop: v})}
                  />
                </div>

                {futuresConfig.trailingStop && (
                  <div className="space-y-2">
                    <Label>Trailing Stop Distance (%)</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={futuresConfig.trailingStopDistance}
                      onChange={(e) => setFuturesConfig({...futuresConfig, trailingStopDistance: parseFloat(e.target.value)})}
                    />
                  </div>
                )}

                <Card className="p-4 bg-primary/10 border-primary/30">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Risk Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Effective Leverage:</span>
                      <span className="font-medium">{futuresConfig.leverage}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Amount:</span>
                      <span className="font-medium">${(100000 * futuresConfig.riskPerTrade / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Liquidation Price Delta:</span>
                      <span className="font-medium">{(100 / futuresConfig.leverage).toFixed(2)}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={() => toast.success("Configuration exported")}>
          <Download className="w-4 h-4 mr-2" />
          Export Config
        </Button>
        <Button variant="outline" onClick={() => toast.info("Select a file to import")}>
          <Upload className="w-4 h-4 mr-2" />
          Import Config
        </Button>
        <Button variant="outline" onClick={() => toast.info("Backend API configuration")}>
          <Server className="w-4 h-4 mr-2" />
          Backend Settings
        </Button>
      </div>
    </div>
  );
};

export default TradingMode;
