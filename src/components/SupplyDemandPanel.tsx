import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

interface Zone {
  name: string;
  range: string;
  type: string;
  strength: string;
  note: string;
}

interface SupplyDemandPanelProps {
  zones: Zone[];
}

export const SupplyDemandPanel = ({ zones }: SupplyDemandPanelProps) => {
  const getZoneColor = (type: string) => {
    if (type === "Accumulation") return "bg-gann-support/10 border-gann-support";
    if (type === "Distribution") return "bg-gann-resistance/10 border-gann-resistance";
    return "bg-neutral/10 border-neutral";
  };
  
  return (
    <Card className="p-6 border-border bg-card hover-glow transition-all duration-300 animate-fade-in">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary animate-pulse" />
        <span className="gradient-text">Gann Supply & Demand Zones & TIME</span>
      </h2>
      
      <div className="space-y-3">
        {zones.map((zone, idx) => (
          <div 
            key={idx} 
            className={`p-4 border-2 rounded ${getZoneColor(zone.type)} hover-glow transition-all hover-scale animate-fade-in`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-foreground">{zone.name}</span>
                <div className="text-sm text-muted-foreground mt-1">
                  Range: <span className="font-mono text-foreground">{zone.range}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-1 animate-pulse">{zone.type}</Badge>
                <div className="text-xs font-semibold text-primary">{zone.strength}</div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground italic">
              {zone.note}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-secondary/30 rounded text-xs text-muted-foreground hover-scale transition-all">
        <p>
          <span className="font-semibold text-foreground">Catatan:</span> Equilibrium (balance point) sama dengan pivot Square of 52. 
          Zona 90°–180° sering menandai transisi Demand→Supply pada TF mingguan; 
          full Gann hexagon adds 60°/120° for precision.
        </p>
      </div>
    </Card>
  );
};
