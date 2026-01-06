import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GannFanFullModuleProps {
  currentPrice: number;
}

const GannFanFullModule = ({ currentPrice }: GannFanFullModuleProps) => {
  // Gann Fan angles with their ratios
  const gannAngles = [
    { ratio: "8x1", angle: 82.5, factor: 1.08, type: "steep_resistance", strength: 95 },
    { ratio: "4x1", angle: 75, factor: 1.04, type: "resistance", strength: 88 },
    { ratio: "3x1", angle: 71.25, factor: 1.03, type: "resistance", strength: 82 },
    { ratio: "2x1", angle: 63.43, factor: 1.02, type: "resistance", strength: 75 },
    { ratio: "1x1", angle: 45, factor: 1.00, type: "pivot", strength: 100 },
    { ratio: "1x2", angle: 26.57, factor: 0.98, type: "support", strength: 75 },
    { ratio: "1x3", angle: 18.43, factor: 0.97, type: "support", strength: 82 },
    { ratio: "1x4", angle: 14.04, factor: 0.96, type: "support", strength: 88 },
    { ratio: "1x8", angle: 7.12, factor: 0.92, type: "steep_support", strength: 95 },
  ];

  const getTypeColor = (type: string) => {
    if (type.includes('resistance')) return 'text-destructive border-destructive';
    if (type.includes('support')) return 'text-success border-success';
    return 'text-primary border-primary';
  };

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Gann Fan Analysis</h3>
        <Badge variant="outline" className="text-primary border-primary">
          1x1 @ ${currentPrice.toLocaleString()}
        </Badge>
      </div>

      {/* Fan Visualization */}
      <div className="relative w-full aspect-[2/1] max-w-[400px] mx-auto mb-4 bg-secondary/20 rounded-lg overflow-hidden">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          {/* Grid */}
          {[...Array(10)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 40}
              y1="0"
              x2={i * 40}
              y2="200"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 50}
              x2="400"
              y2={i * 50}
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          ))}

          {/* Fan lines */}
          {gannAngles.map((angle, idx) => {
            const rad = angle.angle * Math.PI / 180;
            const endX = 400;
            const endY = 200 - Math.tan(rad) * 400;
            const clampedEndY = Math.max(0, Math.min(200, endY));
            
            const color = angle.type.includes('resistance') 
              ? 'hsl(var(--destructive))' 
              : angle.type.includes('support') 
              ? 'hsl(var(--success))'
              : 'hsl(var(--primary))';
            
            return (
              <g key={idx}>
                <line
                  x1="0"
                  y1="200"
                  x2={endX}
                  y2={clampedEndY}
                  stroke={color}
                  strokeWidth={angle.ratio === "1x1" ? 2 : 1}
                  opacity={angle.ratio === "1x1" ? 1 : 0.6}
                />
                <text
                  x={endX - 30}
                  y={clampedEndY + (idx < 4 ? -5 : 15)}
                  fill={color}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {angle.ratio}
                </text>
              </g>
            );
          })}

          {/* Origin point */}
          <circle cx="0" cy="200" r="5" fill="hsl(var(--primary))" />
        </svg>
      </div>

      {/* Angle List */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {gannAngles.map((angle, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              {angle.type.includes('resistance') ? (
                <TrendingUp className="w-4 h-4 text-destructive" />
              ) : angle.type.includes('support') ? (
                <TrendingDown className="w-4 h-4 text-success" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-primary" />
              )}
              <span className="text-sm font-bold text-accent">{angle.ratio}</span>
              <span className="text-xs text-muted-foreground">({angle.angle.toFixed(2)}°)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-foreground">
                ${(currentPrice * angle.factor).toFixed(2)}
              </span>
              <Badge variant="outline" className={`text-xs ${getTypeColor(angle.type)}`}>
                {angle.strength}%
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-destructive/10 rounded">
          <p className="text-xs text-muted-foreground">Resistance</p>
          <p className="text-sm font-bold text-destructive">${(currentPrice * 1.04).toFixed(0)}</p>
        </div>
        <div className="text-center p-2 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">Pivot (1x1)</p>
          <p className="text-sm font-bold text-primary">${currentPrice.toFixed(0)}</p>
        </div>
        <div className="text-center p-2 bg-success/10 rounded">
          <p className="text-xs text-muted-foreground">Support</p>
          <p className="text-sm font-bold text-success">${(currentPrice * 0.96).toFixed(0)}</p>
        </div>
      </div>
    </Card>
  );
};

export default GannFanFullModule;
