import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Zap, TrendingUp, TrendingDown, Calculator, AlertCircle } from "lucide-react";

interface QuickTradeCardProps {
  symbol?: string;
  currentPrice?: number;
}

export const QuickTradeCard = ({ symbol = "BTCUSD", currentPrice = 104525 }: QuickTradeCardProps) => {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.10");
  const [limitPrice, setLimitPrice] = useState(currentPrice.toString());
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const calculateRiskReward = () => {
    if (!stopLoss || !takeProfit) return null;
    const entry = orderType === "market" ? currentPrice : parseFloat(limitPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    
    if (side === "buy") {
      const risk = entry - sl;
      const reward = tp - entry;
      return risk > 0 ? (reward / risk).toFixed(2) : "0";
    } else {
      const risk = sl - entry;
      const reward = entry - tp;
      return risk > 0 ? (reward / risk).toFixed(2) : "0";
    }
  };

  const handleTrade = () => {
    toast.success(`${side.toUpperCase()} order placed for ${amount} ${symbol}`);
  };

  const riskReward = calculateRiskReward();

  return (
    <Card className="hover-glow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Trade
          </CardTitle>
          <Badge variant="outline">{symbol}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="limit">Limit</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={side === "buy" ? "default" : "outline"}
            className={side === "buy" ? "bg-success hover:bg-success/90" : ""}
            onClick={() => setSide("buy")}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Buy
          </Button>
          <Button
            variant={side === "sell" ? "destructive" : "outline"}
            onClick={() => setSide("sell")}
          >
            <TrendingDown className="w-4 h-4 mr-1" />
            Sell
          </Button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Amount (Lots)</Label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
          />
        </div>

        {/* Limit Price (only for limit orders) */}
        {orderType === "limit" && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Limit Price</Label>
            <Input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
            />
          </div>
        )}

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-destructive">Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder={side === "buy" ? "Below entry" : "Above entry"}
              className="border-destructive/30"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-success">Take Profit</Label>
            <Input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder={side === "buy" ? "Above entry" : "Below entry"}
              className="border-success/30"
            />
          </div>
        </div>

        {/* Risk/Reward Display */}
        {riskReward && (
          <div className="flex items-center justify-between p-2 rounded bg-secondary/50">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calculator className="w-3 h-3" />
              Risk/Reward
            </span>
            <Badge variant="outline" className={parseFloat(riskReward) >= 2 ? "text-success border-success" : "text-warning border-warning"}>
              1:{riskReward}
            </Badge>
          </div>
        )}

        {/* Current Price */}
        <div className="flex items-center justify-between p-2 rounded bg-primary/10">
          <span className="text-xs text-muted-foreground">Current Price</span>
          <span className="font-mono font-bold text-primary">${currentPrice.toLocaleString()}</span>
        </div>

        {/* Execute Button */}
        <Button
          className={`w-full ${side === "buy" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"}`}
          onClick={handleTrade}
        >
          <Zap className="w-4 h-4 mr-1" />
          {side === "buy" ? "Buy" : "Sell"} {amount} {symbol}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Demo mode - Connect backend for live trading
        </p>
      </CardContent>
    </Card>
  );
};
