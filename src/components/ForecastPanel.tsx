import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp } from "lucide-react";

interface ForecastDay {
  date: string;
  price: number;
  probability: number;
  note: string;
}

interface ATHATLEvent {
  type: "ATH" | "ATL";
  date: string;
  price: number;
  confidence: number;
  reversal?: { date: string; price: number };
  aspect?: string;
  gannNote: string;
}

interface ForecastPanelProps {
  shortTermForecast: ForecastDay[];
  athAtlEvents: ATHATLEvent[];
}

export const ForecastPanel = ({ shortTermForecast, athAtlEvents }: ForecastPanelProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-xl font-bold text-gann-primary mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Gann Wave — Time × Price Forecast
      </h2>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">7-Day Short-Term Forecast</p>
        <div className="space-y-2">
          {shortTermForecast.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded hover:bg-secondary/50 transition-colors">
              <span className="text-xs font-mono text-muted-foreground">{day.date}</span>
              <span className="text-sm font-mono font-semibold text-foreground">
                ${day.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {(day.probability * 100).toFixed(0)}%
                </Badge>
                <span className="text-xs text-muted-foreground italic">{day.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> ATH / ATL Projections
        </p>
        <div className="space-y-3">
          {athAtlEvents.map((event, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded border ${
                event.type === "ATH" 
                  ? "bg-bullish/5 border-bullish/30" 
                  : "bg-bearish/5 border-bearish/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={event.type === "ATH" ? "default" : "destructive"}>
                  {event.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{event.confidence * 100}% confidence</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 font-mono text-foreground">{event.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="ml-2 font-mono font-semibold text-primary">
                    ${event.price.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {event.reversal && (
                <div className="text-xs text-muted-foreground mb-1">
                  Reversal: {event.reversal.date} → ${event.reversal.price.toLocaleString()}
                </div>
              )}
              
              {event.aspect && (
                <div className="text-xs text-muted-foreground mb-1">
                  {event.aspect}
                </div>
              )}
              
              <div className="text-xs italic text-muted-foreground">
                {event.gannNote}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
