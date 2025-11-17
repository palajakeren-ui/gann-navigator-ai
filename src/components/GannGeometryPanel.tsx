import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hexagon, CircleDot } from "lucide-react";

interface SquareData {
  name: string;
  type: string;
  midpoint?: number;
  target?: number;
  note: string;
}

interface GannGeometryPanelProps {
  squares: SquareData[];
  square90Levels: {
    degree: number;
    price: number;
    type: "support" | "resistance" | "reversal";
  }[];
  hexagonLevels: {
    degree: number;
    price: number;
    type: string;
  }[];
  gannFanAngles: {
    ratio: string;
    price: number;
    slope: number;
    type: "support" | "resistance";
  }[];
}

export const GannGeometryPanel = ({
  squares,
  square90Levels,
  hexagonLevels,
  gannFanAngles,
}: GannGeometryPanelProps) => {
  return (
    <Card className="p-6 border-border bg-card">
      <h2 className="text-xl font-bold text-gann-primary mb-4 flex items-center gap-2">
        <CircleDot className="w-5 h-5" />
        Gann Geometry — Square of 52 / 144 / 90 / 360 / Hexagon
      </h2>
      
      <div className="space-y-4 mb-6">
        {squares.map((square, idx) => (
          <div key={idx} className="p-3 bg-secondary/30 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gann-primary">{square.name}</span>
              <Badge variant="outline" className="text-xs">{square.type}</Badge>
            </div>
            {square.midpoint && (
              <div className="text-xs text-muted-foreground mb-1">
                Midpoint: <span className="font-mono text-foreground">{square.midpoint.toLocaleString()}</span> → equilibrium pivot
              </div>
            )}
            {square.target && (
              <div className="text-xs text-muted-foreground mb-1">
                Target: <span className="font-mono text-foreground">{square.target.toLocaleString()}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground italic">{square.note}</div>
          </div>
        ))}
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <span className="text-gann-primary">◈</span> Square of 90 (Quarter-Grid / 90° Harmonic)
        </p>
        <div className="space-y-2">
          {square90Levels.map((level, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-2 rounded text-sm ${
                level.type === "support" 
                  ? "bg-gann-support/10 text-gann-support" 
                  : level.type === "resistance"
                  ? "bg-gann-resistance/10 text-gann-resistance"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <span className="font-mono">{level.degree}° harmonic</span>
              <span className="font-semibold">{level.price.toLocaleString()}</span>
              <Badge variant="outline" className="text-xs capitalize">{level.type}</Badge>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <Hexagon className="w-4 h-4 text-gann-secondary" />
          Hexagon Geometry
        </p>
        <div className="grid grid-cols-3 gap-2">
          {hexagonLevels.map((level, idx) => (
            <div key={idx} className="p-2 bg-gann-secondary/10 border border-gann-secondary/30 rounded text-center">
              <div className="text-xs text-muted-foreground">{level.degree}°</div>
              <div className="text-sm font-mono font-semibold text-foreground">
                {level.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">{level.type}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-3">Gann Fan Angles (Full Module)</p>
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {gannFanAngles.map((angle, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-2 rounded text-xs ${
                angle.type === "support" 
                  ? "bg-gann-support/10 hover:bg-gann-support/20" 
                  : "bg-gann-resistance/10 hover:bg-gann-resistance/20"
              } transition-colors`}
            >
              <span className="font-semibold text-gann-primary w-12">{angle.ratio}</span>
              <span className="font-mono text-foreground">{angle.price.toLocaleString()}</span>
              <span className="text-muted-foreground">{angle.slope}° slope</span>
              <Badge variant="outline" className="text-xs capitalize">{angle.type}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
