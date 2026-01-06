import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hexagon } from "lucide-react";

interface HexagonGeometryChartProps {
  currentPrice: number;
}

const HexagonGeometryChart = ({ currentPrice }: HexagonGeometryChartProps) => {
  // Calculate hexagon levels based on current price
  const hexagonLevels = [
    { angle: 0, price: currentPrice * 1.000, type: "center" },
    { angle: 60, price: currentPrice * 1.015, type: "resistance" },
    { angle: 120, price: currentPrice * 1.030, type: "resistance" },
    { angle: 180, price: currentPrice * 0.985, type: "support" },
    { angle: 240, price: currentPrice * 0.970, type: "support" },
    { angle: 300, price: currentPrice * 1.045, type: "resistance" },
    { angle: 360, price: currentPrice * 0.955, type: "major_support" },
  ];

  const harmonicAngles = [
    { name: "60° Harmonic", value: 60, multiplier: 1.015 },
    { name: "120° Harmonic", value: 120, multiplier: 1.030 },
    { name: "180° Opposition", value: 180, multiplier: 0.985 },
    { name: "240° Trine", value: 240, multiplier: 0.970 },
    { name: "300° Sextile", value: 300, multiplier: 1.045 },
    { name: "360° Full Cycle", value: 360, multiplier: 0.955 },
  ];

  return (
    <Card className="p-4 md:p-6 border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Hexagon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Hexagon Geometry</h3>
      </div>

      {/* Hexagon Visualization */}
      <div className="relative w-full aspect-square max-w-[300px] mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Hexagon outline */}
          <polygon
            points="100,10 170,50 170,130 100,170 30,130 30,50"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.5"
          />
          
          {/* Inner hexagons */}
          <polygon
            points="100,30 150,60 150,120 100,150 50,120 50,60"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            opacity="0.3"
          />
          <polygon
            points="100,50 130,70 130,110 100,130 70,110 70,70"
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            opacity="0.2"
          />
          
          {/* Center point */}
          <circle cx="100" cy="90" r="4" fill="hsl(var(--primary))" />
          
          {/* Angle lines */}
          {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
            const radian = (angle - 90) * Math.PI / 180;
            const x2 = 100 + Math.cos(radian) * 80;
            const y2 = 90 + Math.sin(radian) * 80;
            return (
              <line
                key={idx}
                x1="100"
                y1="90"
                x2={x2}
                y2={y2}
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}
          
          {/* Price points */}
          {hexagonLevels.slice(1).map((level, idx) => {
            const radian = (level.angle - 90) * Math.PI / 180;
            const x = 100 + Math.cos(radian) * 60;
            const y = 90 + Math.sin(radian) * 60;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="6"
                fill={level.type.includes('support') ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                opacity="0.8"
              />
            );
          })}
        </svg>
      </div>

      {/* Level List */}
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {hexagonLevels.map((level, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-accent">{level.angle}°</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  level.type.includes('support') 
                    ? 'border-success text-success' 
                    : level.type === 'center' 
                    ? 'border-primary text-primary'
                    : 'border-destructive text-destructive'
                }`}
              >
                {level.type}
              </Badge>
            </div>
            <span className="text-sm font-mono text-foreground">${level.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Harmonic Angles */}
      <div className="mt-4 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Harmonic Angles</h4>
        <div className="grid grid-cols-2 gap-2">
          {harmonicAngles.map((angle, idx) => (
            <div key={idx} className="p-2 bg-secondary/30 rounded text-center">
              <p className="text-xs text-muted-foreground">{angle.name}</p>
              <p className="text-sm font-mono text-foreground">${(currentPrice * angle.multiplier).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default HexagonGeometryChart;
