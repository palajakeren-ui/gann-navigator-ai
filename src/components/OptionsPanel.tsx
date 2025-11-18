import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

interface OptionsPanelProps {
  bias: string;
  delta: number;
  expiry: string;
  ivr: number;
  recommendation: {
    type: string;
    strike: number;
    premium: number;
  };
  riskReward: number;
}

export const OptionsPanel = ({
  bias,
  delta,
  expiry,
  ivr,
  recommendation,
  riskReward,
}: OptionsPanelProps) => {
  const isBullish = bias === "CALL";
  
  return (
    <Card className={`p-6 border-2 transition-all duration-300 hover-glow animate-fade-in ${isBullish ? "border-bullish bg-bullish/5 hover:bg-bullish/10" : "border-bearish bg-bearish/5 hover:bg-bearish/10"}`}>
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-primary animate-pulse" />
        <span className="gradient-text">Options & Market Sentiment</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Bias</p>
          <Badge className={`${isBullish ? "bg-bullish text-white" : "bg-bearish text-white"} animate-pulse-glow`}>
            {bias} (bullish)
          </Badge>
        </div>
        
        <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Delta (Δ)</p>
          <p className="text-lg font-bold text-foreground">{delta > 0 ? "+" : ""}{delta.toFixed(2)}</p>
        </div>
        
        <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Expiry</p>
          <p className="text-sm font-semibold text-foreground">{expiry}</p>
        </div>
        
        <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">IVR</p>
          <p className="text-lg font-bold text-primary">{ivr.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="p-4 bg-primary/10 border border-primary/30 rounded mb-4 hover-glow transition-all">
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 animate-pulse" />
          Recommendation
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-semibold text-foreground">{recommendation.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Strike:</span>
            <span className="font-mono font-semibold text-foreground">
              ${recommendation.strike.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Premium:</span>
            <span className="font-mono font-semibold text-primary">
              ${recommendation.premium.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-secondary/30 rounded hover-scale transition-all">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Est. Risk/Reward</span>
          <span className="text-lg font-bold text-gann-primary">{riskReward.toFixed(1)}</span>
        </div>
      </div>
    </Card>
  );
};
