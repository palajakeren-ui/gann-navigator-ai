import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Clock } from "lucide-react";

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
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-bold text-gann-primary mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 animate-pulse" />
        <span className="gradient-text">Gann Wave — Time × Price Forecast</span>
      </h2>
      
      {shortTermForecast.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">7-Day Short-Term Forecast</p>
          <div className="space-y-2">
            {shortTermForecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary/30 rounded hover:bg-secondary/50 transition-all hover-scale">
                <span className="text-xs font-mono text-muted-foreground">{day.date}</span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  ${day.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs animate-pulse">
                    {(day.probability * 100).toFixed(0)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground italic">{day.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {athAtlEvents.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> ATH / ATL Projections
          </p>
          <div className="space-y-3">
            {athAtlEvents.map((event, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded border hover-glow transition-all hover-scale animate-fade-in ${
                  event.type === "ATH" 
                    ? "bg-bullish/5 border-bullish/30 hover:bg-bullish/10" 
                    : "bg-bearish/5 border-bearish/30 hover:bg-bearish/10"
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={event.type === "ATH" ? "default" : "destructive"} className="animate-pulse">
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
      )}
    </Card>
  );
};
