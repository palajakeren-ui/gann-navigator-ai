import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalPanelProps {
  direction: "BUY" | "SELL";
  strength: number;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
}

export const SignalPanel = ({
  direction,
  strength,
  confidence,
  entry,
  stopLoss,
  takeProfit,
  riskReward,
}: SignalPanelProps) => {
  const isBullish = direction === "BUY";
  
  return (
    <Card className={cn(
      "p-6 border-2",
      isBullish ? "border-bullish bg-bullish/5" : "border-bearish bg-bearish/5"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isBullish ? (
            <ArrowUpRight className="w-8 h-8 text-bullish" />
          ) : (
            <ArrowDownRight className="w-8 h-8 text-bearish" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{direction}</h2>
            <p className="text-sm text-muted-foreground">Final Trading Signal</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Strength</span>
          </div>
          <Badge variant="outline" className="text-lg border-primary text-primary">
            {(strength * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-secondary/50 p-3 rounded">
          <p className="text-xs text-muted-foreground mb-1">Confidence</p>
          <p className="text-xl font-bold text-primary">{(confidence * 100).toFixed(0)}%</p>
        </div>
        
        <div className="bg-secondary/50 p-3 rounded">
          <p className="text-xs text-muted-foreground mb-1">Risk/Reward</p>
          <p className="text-xl font-bold text-gann-primary">1:{riskReward.toFixed(1)}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-secondary/30 rounded">
          <span className="text-sm text-muted-foreground">Entry Price</span>
          <span className="text-lg font-mono font-semibold text-foreground">
            ${entry.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-bearish/10 rounded border border-bearish/30">
          <span className="text-sm text-bearish">Stop Loss</span>
          <span className="text-lg font-mono font-semibold text-bearish">
            ${stopLoss.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-2 bg-bullish/10 rounded border border-bullish/30">
          <span className="text-sm text-bullish">Take Profit</span>
          <span className="text-lg font-mono font-semibold text-bullish">
            ${takeProfit.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
};
