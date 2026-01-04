import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

interface EhlersIndicatorsCardProps {
  indicators: Array<{
    name: string;
    signal: string;
    value: string;
    confidence: number;
  }>;
  compositeScore: number;
}

export const EhlersIndicatorsCard = ({ indicators, compositeScore }: EhlersIndicatorsCardProps) => {
  return (
    <Card className="hover-glow transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Ehlers DSP Indicators
          </CardTitle>
          <Badge 
            variant="outline" 
            className={compositeScore >= 0.5 ? 'text-success border-success' : 'text-destructive border-destructive'}
          >
            Score: {(compositeScore * 100).toFixed(0)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {indicators.slice(0, 6).map((indicator, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-secondary/30 hover:bg-secondary/50 transition-all"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{indicator.name}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs mt-1 ${
                    indicator.signal.toLowerCase().includes('bullish') || 
                    indicator.signal.toLowerCase().includes('up') ||
                    indicator.signal.toLowerCase().includes('rising')
                      ? 'text-success border-success' 
                      : indicator.signal.toLowerCase().includes('bearish') ||
                        indicator.signal.toLowerCase().includes('down')
                      ? 'text-destructive border-destructive'
                      : 'text-muted-foreground border-muted'
                  }`}
                >
                  {indicator.signal}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-foreground">{indicator.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Progress value={indicator.confidence * 100} className="w-12 h-1" />
                  <span className="text-xs text-muted-foreground">{(indicator.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {indicators.length > 6 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              +{indicators.length - 6} more indicators available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
