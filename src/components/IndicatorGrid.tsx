import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Indicator {
  name: string;
  signal: string;
  value: string | number;
  confidence: number;
}

interface IndicatorGridProps {
  title: string;
  indicators: Indicator[];
  compositeScore?: number;
}

export const IndicatorGrid = ({ title, indicators, compositeScore }: IndicatorGridProps) => {
  const getSignalColor = (signal: string) => {
    if (signal.toLowerCase().includes("bullish") || signal.toLowerCase().includes("up")) {
      return "text-bullish";
    }
    if (signal.toLowerCase().includes("bearish") || signal.toLowerCase().includes("down")) {
      return "text-bearish";
    }
    return "text-neutral-foreground";
  };
  
  const getSignalIcon = (signal: string) => {
    if (signal.toLowerCase().includes("bullish") || signal.toLowerCase().includes("up")) {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (signal.toLowerCase().includes("bearish") || signal.toLowerCase().includes("down")) {
      return <TrendingDown className="w-4 h-4" />;
    }
    return null;
  };
  
  return (
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        {compositeScore !== undefined && (
          <Badge 
            variant="outline" 
            className={`animate-pulse-glow ${compositeScore > 0.7 ? "border-bullish text-bullish" : compositeScore < 0.3 ? "border-bearish text-bearish" : "border-neutral text-neutral-foreground"}`}
          >
            Score: {(compositeScore * 100).toFixed(0)}%
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        {indicators.map((indicator, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 bg-secondary/30 rounded hover:bg-secondary/50 transition-all hover-scale"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-foreground">{indicator.name}</span>
              <div className={`flex items-center gap-1 ${getSignalColor(indicator.signal)}`}>
                {getSignalIcon(indicator.signal)}
                <span className="text-sm font-semibold">{indicator.signal}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground">
                {indicator.value}
              </span>
              <Badge variant="outline" className="text-xs">
                {(indicator.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
