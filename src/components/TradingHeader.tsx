import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface TradingHeaderProps {
  symbol: string;
  broker: string;
  accountBalance: number;
  riskPerTrade: number;
  leverage: number;
  lotSize: number;
  timestamp: string;
}

export const TradingHeader = ({
  symbol,
  broker,
  accountBalance,
  riskPerTrade,
  leverage,
  lotSize,
  timestamp,
}: TradingHeaderProps) => {
  return (
    <Card className="p-4 lg:p-6 border-border bg-card animate-fade-in hover-glow transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
              {symbol}
            </h1>
            <p className="text-sm text-muted-foreground">{broker}</p>
          </div>
          <Badge className="bg-primary text-primary-foreground animate-pulse-glow">
            Live Analysis
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-2 lg:p-3 bg-secondary/30 rounded hover-scale transition-all">
            <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
            <p className="text-sm lg:text-base font-bold text-foreground">
              ${accountBalance.toLocaleString()}
            </p>
          </div>
          
          <div className="p-2 lg:p-3 bg-secondary/30 rounded hover-scale transition-all">
            <p className="text-xs text-muted-foreground mb-1">Risk/Trade</p>
            <p className="text-sm lg:text-base font-bold text-primary">
              {riskPerTrade}%
            </p>
          </div>
          
          <div className="p-2 lg:p-3 bg-secondary/30 rounded hover-scale transition-all">
            <p className="text-xs text-muted-foreground mb-1">Leverage</p>
            <p className="text-sm lg:text-base font-bold text-foreground">
              {leverage}x
            </p>
          </div>
          
          <div className="p-2 lg:p-3 bg-secondary/30 rounded hover-scale transition-all">
            <p className="text-xs text-muted-foreground mb-1">Lot Size</p>
            <p className="text-sm lg:text-base font-bold text-foreground">
              {lotSize}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Last Update: {timestamp}
        </p>
      </div>
    </Card>
  );
};
