import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp } from "lucide-react";

interface Pattern {
  name: string;
  type: string;
  confidence: number;
  priceRange: string;
  timeWindow: string;
}

interface PatternRecognitionPanelProps {
  patterns: Pattern[];
  summary: string[];
}

export const PatternRecognitionPanel = ({
  patterns,
  summary,
}: PatternRecognitionPanelProps) => {
  const getPatternColor = (confidence: number) => {
    if (confidence >= 0.85) return "text-bullish border-bullish";
    if (confidence >= 0.75) return "text-primary border-primary";
    return "text-muted-foreground border-muted";
  };
  
  return (
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary animate-pulse" />
        <span className="gradient-text">Pattern Recognition — (dengan Price & Time)</span>
      </h2>
      
      <div className="space-y-3 mb-6">
        {patterns.map((pattern, idx) => (
          <div 
            key={idx} 
            className={`p-4 border-l-4 rounded ${getPatternColor(pattern.confidence)} bg-secondary/20 hover-scale transition-all hover:bg-secondary/30`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{pattern.name}</span>
                <Badge variant="outline" className="text-xs">{pattern.type}</Badge>
              </div>
              <Badge className={`${getPatternColor(pattern.confidence)} animate-pulse`}>
                {(pattern.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold">Price Range:</span> {pattern.priceRange}
              </div>
              <div>
                <span className="font-semibold">Time Window:</span> {pattern.timeWindow}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-primary/5 border border-primary/20 rounded hover-glow transition-all">
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 animate-pulse" />
          Pattern Summary
        </p>
        <div className="space-y-2">
          {summary.map((text, idx) => (
            <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
              • {text}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
};
