import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const scanResults = [
  { symbol: "BTCUSD", signal: "BUY", strength: 85, price: 47509, change: 2.11, pattern: "Bullish Gann Fan" },
  { symbol: "ETHUSD", signal: "SELL", strength: 72, price: 2489, change: -1.23, pattern: "Bearish Divergence" },
  { symbol: "BNBUSD", signal: "NEUTRAL", strength: 45, price: 389, change: 0.15, pattern: "Consolidation" },
  { symbol: "SOLUSD", signal: "BUY", strength: 78, price: 156, change: 3.45, pattern: "Square of 9 Support" },
];

const Scanner = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Market Scanner</h1>
          <p className="text-muted-foreground">Real-time pattern detection across all markets</p>
        </div>
        <Button className="gap-2">
          <Search className="w-4 h-4" />
          Scan Now
        </Button>
      </div>

      <Card className="p-6 glass-card animate-scale-in">
        <div className="space-y-4">
          {scanResults.map((result, idx) => (
            <div 
              key={result.symbol} 
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all hover-lift"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-bold text-foreground">{result.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{result.pattern}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-bold text-foreground">${result.price.toLocaleString()}</p>
                  <p className={`text-sm flex items-center gap-1 ${result.change > 0 ? 'text-green-500' : result.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {result.change > 0 ? <TrendingUp className="w-3 h-3" /> : result.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {Math.abs(result.change)}%
                  </p>
                </div>
                
                <Badge variant={result.signal === "BUY" ? "default" : result.signal === "SELL" ? "destructive" : "secondary"}>
                  {result.signal}
                </Badge>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Strength</p>
                  <p className="font-bold text-foreground">{result.strength}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Scanner;
