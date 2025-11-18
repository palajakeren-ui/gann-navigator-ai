import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Activity } from "lucide-react";

interface CycleData {
  period: string;
  confidence: number;
  status: "active" | "muted";
}

interface TimeCyclesPanelProps {
  cycles: CycleData[];
  dominantPeriod: number;
  amplitude: string;
  phase: number;
  interpretation: string;
}

export const TimeCyclesPanel = ({
  cycles,
  dominantPeriod,
  amplitude,
  phase,
  interpretation,
}: TimeCyclesPanelProps) => {
  return (
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary animate-pulse" />
        <span className="gradient-text">Time Cycles & Vibration Analysis</span>
      </h2>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cycles.filter(c => c.status === "active").map((cycle, idx) => (
          <div key={idx} className="p-3 bg-secondary/30 rounded hover-scale transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{cycle.period}</span>
              <Badge variant="outline" className="text-xs animate-pulse">
                {(cycle.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <Progress value={cycle.confidence * 100} className="h-2" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-primary/10 border border-primary/30 rounded hover-glow transition-all">
        <div className="hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Dominant Period</p>
          <p className="text-xl font-bold text-primary">{dominantPeriod} hari</p>
        </div>
        
        <div className="hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Amplitude</p>
          <p className="text-xl font-bold text-foreground capitalize">{amplitude}</p>
        </div>
        
        <div className="hover-scale transition-all">
          <p className="text-xs text-muted-foreground mb-1">Phase</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-foreground">{phase.toFixed(2)}</p>
            <Activity className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-status-info/10 border border-status-info/30 rounded hover-scale transition-all">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Interpretasi:</span> {interpretation}
        </p>
      </div>
    </Card>
  );
};
