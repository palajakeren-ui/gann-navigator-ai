import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Compass } from "lucide-react";

interface GannLevel {
  angle: string;
  level: number;
  strength: number;
  confidence: number;
}

interface GannAnalysisPanelProps {
  supports: number[];
  resistances: number[];
  position: number;
  angles: GannLevel[];
}

export const GannAnalysisPanel = ({
  supports,
  resistances,
  position,
  angles,
}: GannAnalysisPanelProps) => {
  return (
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <Compass className="w-5 h-5 text-gann-primary animate-pulse" />
        <span className="gradient-text">Square of Nine & Gann Angles</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="hover-scale transition-all">
          <p className="text-sm text-muted-foreground mb-2">Support Levels</p>
          <div className="space-y-1">
            {supports.map((level, idx) => (
              <div
                key={idx}
                className="text-sm font-mono text-gann-support bg-gann-support/10 px-2 py-1 rounded hover:bg-gann-support/20 transition-colors"
              >
                {level.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
        
        <div className="hover-scale transition-all">
          <p className="text-sm text-muted-foreground mb-2">Resistance Levels</p>
          <div className="space-y-1">
            {resistances.map((level, idx) => (
              <div
                key={idx}
                className="text-sm font-mono text-gann-resistance bg-gann-resistance/10 px-2 py-1 rounded hover:bg-gann-resistance/20 transition-colors"
              >
                {level.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded hover-scale transition-all">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Position</span>
          <span className="text-foreground font-semibold">{(position * 100).toFixed(1)}%</span>
        </div>
        <Progress value={position * 100} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {position < 0.4 ? "Near support - bullish zone" : position > 0.6 ? "Near resistance - watch for rejection" : "Mid-range - neutral"}
        </p>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-3">Gann Angles</p>
        <div className="space-y-2">
          {angles.map((angle, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-2 bg-secondary/50 rounded hover-scale transition-all hover:bg-secondary/70">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-semibold text-gann-primary w-12">{angle.angle}</span>
                <span className="text-sm font-mono text-foreground">{angle.level.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={angle.strength * 100} className="w-20 h-1.5" />
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {(angle.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
