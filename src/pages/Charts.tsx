import { TradingChart } from "@/components/charts/TradingChart";
import { Card } from "@/components/ui/card";

const Charts = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Advanced Charts</h1>
        <p className="text-muted-foreground">Multi-timeframe technical analysis and pattern recognition</p>
      </div>

      <TradingChart />
    </div>
  );
};

export default Charts;
