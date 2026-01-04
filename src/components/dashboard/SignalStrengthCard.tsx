import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TradingSignal } from "@/hooks/useRealTimeData";

interface SignalStrengthCardProps {
  signal: TradingSignal | null;
  showDetails?: boolean;
}

export const SignalStrengthCard = ({ signal, showDetails = true }: SignalStrengthCardProps) => {
  if (!signal) {
    return (
      <Card className="hover-glow">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Calculating signal...</p>
        </CardContent>
      </Card>
    );
  }

  const getDirectionIcon = () => {
    switch (signal.direction) {
      case 'BUY': return <TrendingUp className="w-6 h-6 text-success" />;
      case 'SELL': return <TrendingDown className="w-6 h-6 text-destructive" />;
      default: return <Minus className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getDirectionColor = () => {
    switch (signal.direction) {
      case 'BUY': return 'bg-success/10 border-success text-success';
      case 'SELL': return 'bg-destructive/10 border-destructive text-destructive';
      default: return 'bg-muted/10 border-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`hover-glow transition-all border-2 ${
      signal.direction === 'BUY' ? 'border-success/30 bg-success/5' :
      signal.direction === 'SELL' ? 'border-destructive/30 bg-destructive/5' :
      'border-muted/30'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Trading Signal
          </CardTitle>
          <Badge className={getDirectionColor()}>
            {getDirectionIcon()}
            <span className="ml-1">{signal.direction}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Strength</p>
            <div className="flex items-center gap-2">
              <Progress value={signal.strength * 100} className="flex-1" />
              <span className="text-sm font-mono">{(signal.strength * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <div className="flex items-center gap-2">
              <Progress value={signal.confidence * 100} className="flex-1" />
              <span className="text-sm font-mono">{(signal.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
            <div className="text-center p-2 bg-background/50 rounded">
              <p className="text-xs text-muted-foreground">Entry</p>
              <p className="text-sm font-bold font-mono">${signal.entry.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-destructive/10 rounded">
              <p className="text-xs text-destructive">Stop Loss</p>
              <p className="text-sm font-bold font-mono text-destructive">${signal.stopLoss.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-success/10 rounded">
              <p className="text-xs text-success">Take Profit</p>
              <p className="text-sm font-bold font-mono text-success">${signal.takeProfit.toLocaleString()}</p>
            </div>
            <div className="text-center p-2 bg-primary/10 rounded">
              <p className="text-xs text-primary">R:R</p>
              <p className="text-sm font-bold font-mono text-primary">1:{signal.riskReward.toFixed(1)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
