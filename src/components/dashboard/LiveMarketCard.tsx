import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from "lucide-react";
import { useRealTimeData, MarketData } from "@/hooks/useRealTimeData";

interface LiveMarketCardProps {
  symbol: string;
  basePrice: number;
  name?: string;
}

export const LiveMarketCard = ({ symbol, basePrice, name }: LiveMarketCardProps) => {
  const { data, isConnected } = useRealTimeData(symbol, basePrice, 2000);

  return (
    <Card className="hover-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-success animate-pulse" />
            ) : (
              <WifiOff className="w-4 h-4 text-destructive" />
            )}
            <Badge variant={data.changePercent >= 0 ? "default" : "destructive"} className="text-xs">
              {data.changePercent >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
            </Badge>
          </div>
        </div>
        {name && <p className="text-xs text-muted-foreground">{name}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-foreground">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">High</p>
              <p className="font-mono text-success">${data.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Low</p>
              <p className="font-mono text-destructive">${data.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vol</p>
              <p className="font-mono text-foreground">{(data.volume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
