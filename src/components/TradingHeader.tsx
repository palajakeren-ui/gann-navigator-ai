import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="p-4 mb-4 border-border bg-card">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{symbol}</h1>
            <p className="text-sm text-muted-foreground">{broker}</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Live Analysis
          </Badge>
        </div>
        
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-muted-foreground">Account Balance</p>
            <p className="text-lg font-semibold text-foreground">
              ${accountBalance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Risk/Trade</p>
            <p className="text-lg font-semibold text-foreground">
              {riskPerTrade}% (${(accountBalance * riskPerTrade / 100).toLocaleString()})
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Leverage</p>
            <p className="text-lg font-semibold text-primary">{leverage}x</p>
          </div>
          <div>
            <p className="text-muted-foreground">Lot Size</p>
            <p className="text-lg font-semibold text-foreground">{lotSize}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Last Update</p>
          <p className="text-sm font-mono text-foreground">{timestamp}</p>
        </div>
      </div>
    </Card>
  );
};
