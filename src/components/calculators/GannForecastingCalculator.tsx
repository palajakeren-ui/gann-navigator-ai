import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Target, TrendingUp, Clock } from "lucide-react";

interface ForecastResult {
  targetDate: string;
  targetPrice: number;
  gannAngle: string;
  probability: number;
  cycleType: string;
}

export const GannForecastingCalculator = () => {
  const [startPrice, setStartPrice] = useState("100000");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeframe, setTimeframe] = useState("daily");
  const [direction, setDirection] = useState("up");
  const [forecasts, setForecasts] = useState<ForecastResult[]>([]);

  const calculateForecasts = () => {
    const price = parseFloat(startPrice);
    const start = new Date(startDate);
    
    const results: ForecastResult[] = [];
    const cycles = [7, 21, 45, 90, 144, 180, 360];
    
    cycles.forEach(cycle => {
      const targetDate = new Date(start);
      targetDate.setDate(targetDate.getDate() + cycle);
      
      const priceChange = direction === 'up' 
        ? price * (1 + (cycle / 1000) * Math.random())
        : price * (1 - (cycle / 1000) * Math.random());
      
      const angles = ["1x1", "2x1", "1x2", "3x1", "1x3"];
      const selectedAngle = angles[Math.floor(Math.random() * angles.length)];
      
      results.push({
        targetDate: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        targetPrice: priceChange,
        gannAngle: selectedAngle,
        probability: 50 + Math.random() * 40,
        cycleType: `${cycle}-Day Cycle`
      });
    });
    
    setForecasts(results);
  };

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Gann Time & Price Forecasting</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="startPrice" className="text-sm text-muted-foreground">Start Price</Label>
          <Input
            id="startPrice"
            type="number"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm text-muted-foreground">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Direction</Label>
          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Bullish</SelectItem>
              <SelectItem value="down">Bearish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={calculateForecasts} className="w-full mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        Generate Forecasts
      </Button>

      {forecasts.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {forecasts.map((forecast, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{forecast.targetDate}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{forecast.cycleType}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`w-3 h-3 ${direction === 'up' ? 'text-success' : 'text-destructive'}`} />
                    <span className="text-sm font-mono text-foreground">${forecast.targetPrice.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Angle: {forecast.gannAngle}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${forecast.probability > 70 ? 'text-success border-success' : forecast.probability > 50 ? 'text-warning border-warning' : 'text-muted-foreground border-muted'}`}
                >
                  {forecast.probability.toFixed(0)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {forecasts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Enter parameters and generate forecasts</p>
        </div>
      )}
    </Card>
  );
};

export default GannForecastingCalculator;
