import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { GannLevel } from "@/hooks/useRealTimeData";

interface GannLevelsCardProps {
  levels: GannLevel[];
  currentPrice: number;
}

export const GannLevelsCard = ({ levels, currentPrice }: GannLevelsCardProps) => {
  return (
    <Card className="hover-glow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Gann Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {levels.map((level, idx) => {
            const isPivot = level.type === 'pivot';
            const isSupport = level.type === 'support';
            const isResistance = level.type === 'resistance';
            
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded transition-all ${
                  isPivot
                    ? 'bg-primary/20 border border-primary/40'
                    : isResistance
                    ? 'bg-destructive/10 hover:bg-destructive/20'
                    : 'bg-success/10 hover:bg-success/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs w-12 justify-center">
                    {level.angle}
                  </Badge>
                  <span className={`text-sm ${isPivot ? 'font-bold' : ''} ${
                    isResistance ? 'text-destructive' : isSupport ? 'text-success' : 'text-foreground'
                  }`}>
                    {level.type.charAt(0).toUpperCase() + level.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16">
                    <Progress 
                      value={level.strength} 
                      className={`h-1 ${
                        isResistance ? '[&>div]:bg-destructive' : isSupport ? '[&>div]:bg-success' : ''
                      }`}
                    />
                  </div>
                  <span className={`font-mono text-sm ${
                    isPivot ? 'font-bold text-foreground' : 
                    isResistance ? 'text-destructive' : 'text-success'
                  }`}>
                    {level.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Position in Range</span>
            <span className="font-mono font-bold text-primary">
              {(() => {
                const supports = levels.filter(l => l.type === 'support');
                const resistances = levels.filter(l => l.type === 'resistance');
                if (supports.length === 0 || resistances.length === 0) return 'N/A';
                const nearestSupport = Math.max(...supports.map(s => s.price));
                const nearestResistance = Math.min(...resistances.map(r => r.price));
                const range = nearestResistance - nearestSupport;
                const position = (currentPrice - nearestSupport) / range;
                return `${(position * 100).toFixed(0)}%`;
              })()}
            </span>
          </div>
          <Progress 
            value={(() => {
              const supports = levels.filter(l => l.type === 'support');
              const resistances = levels.filter(l => l.type === 'resistance');
              if (supports.length === 0 || resistances.length === 0) return 50;
              const nearestSupport = Math.max(...supports.map(s => s.price));
              const nearestResistance = Math.min(...resistances.map(r => r.price));
              const range = nearestResistance - nearestSupport;
              return ((currentPrice - nearestSupport) / range) * 100;
            })()} 
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Support</span>
            <span>Resistance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
