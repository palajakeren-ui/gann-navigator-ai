import { PositionSizePanel } from "@/components/PositionSizePanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingUp } from "lucide-react";

const riskMetrics = [
  { label: "Portfolio Value", value: "$100,000", change: "+$2,450", status: "positive" },
  { label: "Total Exposure", value: "$45,000", change: "45%", status: "neutral" },
  { label: "Daily P&L", value: "+$1,234", change: "+1.23%", status: "positive" },
  { label: "Max Drawdown", value: "-$3,250", change: "-3.25%", status: "negative" },
];

const Risk = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Risk Manager</h1>
        <p className="text-muted-foreground">Portfolio risk analysis and position sizing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics.map((metric, idx) => (
          <Card key={metric.label} className="p-6 glass-card animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex items-start justify-between mb-2">
              <Shield className={`w-5 h-5 ${
                metric.status === 'positive' ? 'text-green-500' : 
                metric.status === 'negative' ? 'text-red-500' : 
                'text-yellow-500'
              }`} />
              <Badge variant={
                metric.status === 'positive' ? 'default' : 
                metric.status === 'negative' ? 'destructive' : 
                'secondary'
              }>
                {metric.change}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
            <p className="text-2xl font-bold gradient-text">{metric.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-bold text-foreground">Risk Alerts</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="font-medium text-foreground">High Exposure Warning</p>
            <p className="text-sm text-muted-foreground">Current exposure (45%) exceeds recommended maximum (40%)</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="font-medium text-foreground">Stop Loss Active</p>
            <p className="text-sm text-muted-foreground">All positions protected with 2% stop loss</p>
          </div>
        </div>
      </Card>

      <PositionSizePanel 
        accountEquity={100000}
        riskPerTrade={2}
        riskAmount={2000}
        dollarPerPoint={10}
        stopDistance={500}
        riskPerLot={500}
        calculatedLotSize={4}
        adjustedLotSize={4}
        leverage={10}
        entry={47500}
        stopLoss={47000}
      />
    </div>
  );
};

export default Risk;
