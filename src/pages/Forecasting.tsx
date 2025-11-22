import { ForecastPanel } from "@/components/ForecastPanel";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Forecasting = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Price Forecasting</h1>
        <p className="text-muted-foreground">Multi-model prediction engine with Gann and Astro cycles</p>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <ForecastPanel 
            shortTermForecast={[
              { date: "2024-11-23", price: 48200, probability: 75, note: "Strong upward momentum" },
              { date: "2024-11-24", price: 48800, probability: 68, note: "Consolidation expected" },
              { date: "2024-11-25", price: 49500, probability: 62, note: "Breakout potential" },
            ]}
            athAtlEvents={[
              { date: "2024-11-20", type: "ATH", price: 49000, confidence: 85, gannNote: "Square of 9 resistance" },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <ForecastPanel 
            shortTermForecast={[
              { date: "Week 48", price: 50200, probability: 72, note: "Weekly uptrend intact" },
              { date: "Week 49", price: 51800, probability: 65, note: "Major resistance zone" },
            ]}
            athAtlEvents={[
              { date: "Week 47", type: "ATH", price: 49000, confidence: 80, gannNote: "Time cycle completion" },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <ForecastPanel 
            shortTermForecast={[
              { date: "Dec 2024", price: 52000, probability: 68, note: "Monthly trend bullish" },
              { date: "Jan 2025", price: 55000, probability: 58, note: "New cycle beginning" },
            ]}
            athAtlEvents={[
              { date: "Nov 2024", type: "ATH", price: 49000, confidence: 75, gannNote: "Fibonacci extension" },
            ]}
          />
        </TabsContent>
        
        <TabsContent value="yearly" className="space-y-4">
          <ForecastPanel 
            shortTermForecast={[
              { date: "2025", price: 65000, probability: 55, note: "Long-term bullish cycle" },
              { date: "2026", price: 78000, probability: 45, note: "Major resistance ahead" },
            ]}
            athAtlEvents={[
              { date: "2024", type: "ATH", price: 49000, confidence: 70, gannNote: "Yearly pivot high" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forecasting;
