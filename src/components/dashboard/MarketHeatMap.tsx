import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketItem {
  symbol: string;
  name: string;
  change: number;
  volume: number;
}

const marketData: MarketItem[] = [
  { symbol: "BTC", name: "Bitcoin", change: 2.34, volume: 45000000000 },
  { symbol: "ETH", name: "Ethereum", change: 1.56, volume: 18000000000 },
  { symbol: "SOL", name: "Solana", change: 5.23, volume: 3500000000 },
  { symbol: "XRP", name: "Ripple", change: -0.89, volume: 2800000000 },
  { symbol: "DOGE", name: "Dogecoin", change: -1.45, volume: 1200000000 },
  { symbol: "ADA", name: "Cardano", change: 0.67, volume: 980000000 },
  { symbol: "AVAX", name: "Avalanche", change: 3.12, volume: 850000000 },
  { symbol: "DOT", name: "Polkadot", change: -0.23, volume: 720000000 },
  { symbol: "LINK", name: "Chainlink", change: 4.56, volume: 650000000 },
  { symbol: "MATIC", name: "Polygon", change: 1.89, volume: 580000000 },
  { symbol: "UNI", name: "Uniswap", change: -2.34, volume: 420000000 },
  { symbol: "ATOM", name: "Cosmos", change: 0.12, volume: 380000000 },
];

const getColorClass = (change: number) => {
  if (change > 3) return "bg-success/80 hover:bg-success";
  if (change > 0) return "bg-success/40 hover:bg-success/60";
  if (change > -1) return "bg-muted/50 hover:bg-muted";
  if (change > -3) return "bg-destructive/40 hover:bg-destructive/60";
  return "bg-destructive/80 hover:bg-destructive";
};

const getSizeClass = (volume: number) => {
  if (volume > 20000000000) return "col-span-2 row-span-2";
  if (volume > 5000000000) return "col-span-2";
  return "";
};

export const MarketHeatMap = () => {
  return (
    <Card className="hover-glow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Market Heat Map</CardTitle>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-1 auto-rows-fr">
          {marketData.map((item) => (
            <div
              key={item.symbol}
              className={`${getColorClass(item.change)} ${getSizeClass(item.volume)} 
                p-2 rounded-md transition-all cursor-pointer flex flex-col justify-center items-center
                min-h-[60px] group`}
            >
              <span className="font-bold text-foreground text-sm">{item.symbol}</span>
              <span className={`text-xs font-mono flex items-center gap-0.5 ${
                item.change > 0 ? 'text-success-foreground' : 
                item.change < 0 ? 'text-destructive-foreground' : 
                'text-muted-foreground'
              }`}>
                {item.change > 0 ? <TrendingUp className="w-3 h-3" /> : 
                 item.change < 0 ? <TrendingDown className="w-3 h-3" /> : 
                 <Minus className="w-3 h-3" />}
                {item.change > 0 ? '+' : ''}{item.change}%
              </span>
              <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
