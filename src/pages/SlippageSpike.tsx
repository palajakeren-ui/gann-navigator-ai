import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings2, Zap, AlertTriangle, TrendingUp, Activity, Shield, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SlippageSpike = () => {
  const [slippageSettings, setSlippageSettings] = useState({
    autoSlippage: true,
    slippageValue: "0.5",
    maxSlippage: "2.0",
    marketImpact: true,
    liquidityAdjust: true,
  });

  const [spikeSettings, setSpikeSettings] = useState({
    autoDetect: true,
    sensitivity: "medium",
    threshold: "3.0",
    filterSpikes: true,
    alertOnSpike: true,
  });

  const stats = {
    currentSlippage: "0.35%",
    avgSlippage24h: "0.42%",
    maxSlippage24h: "1.2%",
    spikesDetected: 7,
    lastSpikeTime: "2 hours ago",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Slippage & Spike Detection
          </h1>
          <p className="text-muted-foreground">Manage slippage tolerance and detect price spikes</p>
        </div>
        <Button onClick={() => toast.success("Calibrating slippage model...")}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Calibrate
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Current Slippage</p>
          <p className="text-xl font-bold text-foreground">{stats.currentSlippage}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">24h Average</p>
          <p className="text-xl font-bold text-foreground">{stats.avgSlippage24h}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">24h Max</p>
          <p className="text-xl font-bold text-destructive">{stats.maxSlippage24h}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Spikes Detected</p>
          <p className="text-xl font-bold text-foreground">{stats.spikesDetected}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Last Spike</p>
          <p className="text-xl font-bold text-foreground">{stats.lastSpikeTime}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Slippage Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Slippage</Label>
              <Switch checked={slippageSettings.autoSlippage} onCheckedChange={(v) => setSlippageSettings({...slippageSettings, autoSlippage: v})} />
            </div>
            <div className="space-y-2">
              <Label>Slippage Tolerance (%)</Label>
              <Input value={slippageSettings.slippageValue} onChange={(e) => setSlippageSettings({...slippageSettings, slippageValue: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Max Slippage (%)</Label>
              <Input value={slippageSettings.maxSlippage} onChange={(e) => setSlippageSettings({...slippageSettings, maxSlippage: e.target.value})} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Market Impact Adjustment</Label>
              <Switch checked={slippageSettings.marketImpact} onCheckedChange={(v) => setSlippageSettings({...slippageSettings, marketImpact: v})} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Spike Detection
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto Detect Spikes</Label>
              <Switch checked={spikeSettings.autoDetect} onCheckedChange={(v) => setSpikeSettings({...spikeSettings, autoDetect: v})} />
            </div>
            <div className="space-y-2">
              <Label>Threshold (%)</Label>
              <Input value={spikeSettings.threshold} onChange={(e) => setSpikeSettings({...spikeSettings, threshold: e.target.value})} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Filter Spike Trades</Label>
              <Switch checked={spikeSettings.filterSpikes} onCheckedChange={(v) => setSpikeSettings({...spikeSettings, filterSpikes: v})} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Alert on Spike</Label>
              <Switch checked={spikeSettings.alertOnSpike} onCheckedChange={(v) => setSpikeSettings({...spikeSettings, alertOnSpike: v})} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SlippageSpike;
